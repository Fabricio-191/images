/* eslint-disable no-mixed-operators */
const { fetch } = require('./utils.js');

function getType(raw){
	if(!raw.post_hint) return null;
	if(raw.post_hint === 'image'){
		return false;
	}else if(
		raw.post_hint.endsWith('video') ||
		raw.post_hint === 'link' && (
			raw.preview.reddit_video_preview ||
			raw.media && (raw.media.reddit_video || raw.media.oembed)
		)
	) return true;

	return null;
}

function parseImage({ data: raw }){
	const isVideo = getType(raw);
	if(isVideo === null) return null;

	const data = {
		title: raw.title,
		URL: raw.url,
		postURL: `https://www.reddit.com${raw.permalink}`,
		// @ts-ignore
		domain: raw.domain || new URL(raw.url).host,
		raw,
		thumbnail: {
			URL: raw.thumbnail,
			height: raw.thumbnail_height,
			width: raw.thumbnail_width,
		},
	};

	Object.defineProperty(data, 'raw', { enumerable: false });

	if(isVideo){
		const video = raw.preview.reddit_video_preview ||
			raw.media.reddit_video || raw.media.oembed;

		data.video = {
			URL: video.fallback_url || null,
			height: video.height,
			width: video.width,
			duration: video.duration || null,
			isGif: video.is_gif || false,
		};
	}

	return data;
}

async function search(searchString, { quantity = 100, subreddit = null } = {}){
	const url = (
		subreddit ? `https://www.reddit.com/r/${subreddit}.json` :
			'https://www.reddit.com/search.json'
	) + `?q=${encodeURIComponent(searchString)}&sort=new&limit=${quantity}&raw_json=1`;

	const { body } = await fetch(url);
	const data = JSON.parse(body);

	return data.data.children.map(parseImage).filter(x => x !== null);
}

async function subredditExists(subreddit){
	try{
		const { body } = await fetch(`https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`);
		const data = JSON.parse(body);

		if(data.error === 404) return false;

		return true;
	}catch(e){
		return false;
	}
}

async function getFromSubreddit(subreddit, options = {}){
	if(!await subredditExists(subreddit)){
		throw new Error(`subreddit "${subreddit}" does not exists`);
	}
	// @ts-ignore
	const url = new URL(
		`https://www.reddit.com/r/${subreddit}/new.json?raw_json=1&limit=100`
	);

	const { body } = await fetch(url, options);
	const data = JSON.parse(body);
	if(data.error) throw new Error(`${data.message} (code: ${data.error})`);

	return data.data.children.map(parseImage).filter(x => x !== null);
}

module.exports = { search, getFromSubreddit, subredditExists };