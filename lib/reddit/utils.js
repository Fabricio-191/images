const { fetch } = require('../utils/utils.js');
// https://www.reddit.com/dev/api#GET_new
// https://www.reddit.com/dev/api#GET_search
// https://github.com/reddit-archive/reddit/wiki/API

function parse({ data }){
	const d = {
		URL: `https://www.reddit.com${data.permalink}`,
		title: data.title,
		domain: data.domain,
		nsfw: data.over_18 || false,
		raw: data,
	};

	if(!d.nsfw){ // si es NSFW no hay thumbnail
		d.thumbnail = {
			URL: data.thumbnail,
			height: data.thumbnail_height,
			width: data.thumbnail_width,
		};
	}

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
				URL: video.fallback_url || null,
				height: video.height,
				width: video.width,
				duration: video.duration || null,
			};
			break;
		}
		default:{
			if(data.is_gallery){
				// to-do
			}
			return null;
		}
	}

	return d;
}

function checkOptions(options){
	if(typeof options !== 'object'){
		throw new Error('"options" should be a object');
	}
	for(const key of ['after', 'subreddit', 'before', 'after']){
		if(key in options && typeof options[key] !== 'string'){
			throw new Error(`"${key}" must be a string`);
		}
	}
	if('limit' in options && typeof options.limit !== 'number'){
		throw new Error('"limit" must be a number');
	}else if(options.limit < 1 && options.limit > 100){
		throw new Error('"limit" must be between 1 and 100');
	}
}

function authentication(url, options, requestOptions){
	if(!('pass' in options && 'user' in options)) return;
	if(!('headers' in requestOptions)) requestOptions.headers = {};

	requestOptions.headers['Authorization'] = '';
}

module.exports = {
	parse,
	checkOptions,
	authentication,
	fetch,
};