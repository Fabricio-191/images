const { fetch } = require('./utils.js');
// https://www.reddit.com/dev/api#GET_new
// https://www.reddit.com/dev/api#GET_search
// https://github.com/reddit-archive/reddit/wiki/API

function parse({ data }){
	if(!['image', 'hosted:video'].includes(data.post_hint)) return null;

	const d = {
		URL: `https://www.reddit.com${data.permalink}`,
		title: data.title,
		domain: data.domain,
		nsfw: data.over_18 || false,
		raw: data,
	};

	if(!d.nsfw){
		d.thumbnail = {
			URL: data.thumbnail,
			height: data.thumbnail_height,
			width: data.thumbnail_width,
		};
	}

	Object.defineProperty(d, 'raw', { enumerable: false });

	// eslint-disable-next-line default-case
	switch(data.post_hint){
		case 'image':{
			d.fileURL = data.url;
			break;
		}
		case 'hosted:video':{
			const video = data.media.reddit_video;

			d.video = {
				URL: video.fallback_url || null,
				height: video.height,
				width: video.width,
				duration: video.duration || null,
			};

			break;
		}
	}

	return d;
}

async function search(searchString, options = {}){
	// @ts-ignore
	const url = new URL('https://www.reddit.com/search.json?sort=new&data_json=1');
	if('subreddit' in options){
		if(await subredditExists(options.subreddit)){
			url.pathname = `r/${options.subreddit}.json`;
		}else{
			throw new Error(`subreddit "${options.subreddit}" does not exists`);
		}
	}

	url.searchParams.set('q', searchString);
	if('limit' in options) url.searchParams.set('limit', options.quantity);

	const { body } = await fetch(url);
	const data = JSON.parse(body);

	return data.data.children.map(parse).filter(x => x !== null);
}

async function getFromSubreddit(subreddit, options = {}, requestOptions = {}){
	if(typeof subreddit !== 'string'){
		throw new Error('"subreddit" must be a string');
	}
	checkOptions(options);

	// @ts-ignore
	const url = new URL(`https://www.reddit.com/r/${subreddit}/new.json?data_json=1`);
	for(const key of ['limit', 'after', 'before']){
		if(key in options) url.searchParams.set(key, options[key]);
	}

	if('pass' in options && 'user' in options){
		if(!requestOptions.headers) requestOptions.headers = {};

		requestOptions.headers['Authorization'] = '';
	}

	const { body } = await fetch(url, requestOptions);
	const data = JSON.parse(body);
	if(data.error) throw new Error(`${data.message} (code: ${data.error})`);

	return data.data.children.map(parse).filter(x => x);
}

module.exports = { getFromSubreddit, search, subredditExists };

async function subredditExists(subreddit){
	try{
		const { body } = await fetch(`https://www.reddit.com/r/${subreddit}/about.json?data_json=1`);
		const data = JSON.parse(body);

		if(data.error === 404) return false;

		return true;
	}catch(e){
		return false;
	}
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