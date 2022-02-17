const { fetch } = require('../../lib/utils/utils.js');
// https://www.reddit.com/dev/api#GET_new
// https://www.reddit.com/dev/api#GET_search
// https://github.com/reddit-archive/reddit/wiki/API

/*
const FLAGS = Object.entries({
	is_original_content: 'ORIGINAL_CONTENT',
	crosspost_parent: 'CROSSPOSTED',
	distinguished: 'DISTINGUISHED',
	whitelist_status: 'NO_ADS',
	archived: 'ARCHIVED',
	stickied: 'STICKIED',
	spoiler: 'SPOILER',
	pinned: 'PINNED',
	edited: 'EDITED',
	locked: 'LOCKED',
	over_18: 'NSFW',
});
// author_cakeday
*/

function parse({ data }){
	const d = {
		ID: data.name,
		URL: `https://www.reddit.com${data.permalink}`,
		title: data.title,
		domain: data.domain,
		createdAtUTC: new Date(data.created_utc),
		nsfw: data.over_18 || false,
		raw: data,
		thumbnail: {
			URL: data.thumbnail,
			height: data.thumbnail_height,
			width: data.thumbnail_width,
		},
	};

	Object.defineProperty(d, 'raw', { enumerable: false });

	switch(data.post_hint){
		case 'image':{
			d.type = 'image';
			d.fileURL = data.url;
			break;
		}
		case 'hosted:video':{
			d.type = 'video';
			const video = data.media.reddit_video;

			d.video = {
				URL: video.fallback_url,
				height: video.height,
				width: video.width,
				duration: video.duration,
			};
			break;
		}
		case 'rich:video':{
			d.type = 'ext:video';
			d.embedType = data.media.type;
			d.embed = data.media.oembed;
			break;
		}
		default:{
			if(data.is_gallery){
				d.type = 'gallery';

				d.gallery = Object.values(data.media_metadata).map(g => ({
					URL: g.s.u,
					height: g.s.y,
					width: g.s.x,
				}));
			}

			return null;
		}
	}

	return d;
}

function checkOptions(options, requestOptions){
	if(typeof options !== 'object'){
		throw new Error('"options" should be a object');
	}
	for(const key of ['subreddit', 'before', 'after']){
		if(key in options && typeof options[key] !== 'string'){
			throw new Error(`"${key}" must be a string`);
		}
	}
	if('limit' in options && typeof options.limit !== 'number'){
		throw new Error('"limit" must be a number');
	}else if(options.limit < 1 && options.limit > 100){
		throw new Error('"limit" must be between 1 and 100');
	}

	if(!('headers' in requestOptions)) requestOptions.headers = {};
	if(!('User-Agent' in requestOptions.headers)){
		if('user' in options){
			requestOptions.headers['User-Agent'] = `request by ${options.user} with Node.js (${process.version}) module https://github.com/Fabricio-191/images`;
		}else{
			requestOptions.headers['User-Agent'] = `request with Node.js (${process.version}) module https://github.com/Fabricio-191/images`;
		}
	}
}

async function getToken(options){
	const { body } = await fetch('https://www.reddit.com/api/v1/access_token', {
		method: 'POST',
		body: JSON.stringify({
			grant_type: 'password',
			username: options.user,
			password: options.pass,
		}),
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
		},
	});

	return JSON.parse(body);
}

const auths = {};

async function authentication(url, options, requestOptions){
	if(!('pass' in options && 'user' in options)) return;
	if(!('headers' in requestOptions)) requestOptions.headers = {};

	if(!(options.user in auths)){
		auths[options.user] = await getToken(options);

		setTimeout(() => {
			delete auths[options.user];
		}, auths[options.user].expires_in * 995);
	}

	const authData = auths[options.user];

	requestOptions.headers['Authorization'] = authData.token_type + ' ' + authData.access_token;
}

module.exports = {
	parse,
	checkOptions,
	authentication,
	fetch,
};