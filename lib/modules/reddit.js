const { fetch } = require('./utils.js');
const hints = {
	'hosted:video': 'video',
	'rich:video': 'video',
	link: 'link',
	self: 'text',
	undefined: 'text',
	image: 'image',
};

const FLAGS = Object.entries({
	pinned: 'PINNED',
	archived: 'ARCHIVED',
	edited: 'EDITED',
	distinguished: 'DISTINGUISHED',
	whitelist_status: 'NO_ADS',
	over_18: 'NSFW',
	is_original_content: 'ORIGINAL_CONTENT',
	spoiler: 'SPOILER',
	locked: 'LOCKED',
	stickied: 'STICKIED',
	crosspost_parent: 'CROSSPOSTED',
});

const handlers = {
	image(data){
		// @ts-ignore
		const domain = data.domain || new URL(data.url).host;

		return {
			URL: data.url,
			domain,
			direct: ['i.imgur.com', 'imgur.com', 'i.redd.it'].includes(domain),
		};
	},
	video(data){
		const video = data.preview.reddit_video_preview || data.media.oembed;

		return {
			URL: data.url,
			// @ts-ignore
			domain: data.domain || new URL(data.url).host,
			fallbackURL: video.fallback_url || null,
			height: video.height,
			width: video.width,
			duration: video.duration || null,
			isGif: video.is_gif || false,
		};
	},
	/*
	link(data){
		return { URL: data.url };
	},
	text(data){ return { text: data.selftext }; },
	deleted(data){
		return {
			reason: data.removed_by_category,
			text: data.selftext,
		};
	},
	null(){ return {}; },
	*/
};

function getType(data){
	if(data.removed_by_category || data.banned_by) return 'deleted';
	let type = hints[data.post_hint] || null;

	if(
		type === 'link' && data.preview &&
		data.preview.reddit_video_preview
	) type = 'video';

	return type;
}

function Image({ data }){
	const type = getType(data);

	if(type !== 'video' && type !== 'image') return null;

	return {
		type,
		isVideo: type === 'video',
		...handlers[type](data),
		postData(){
			return {
				ID: data.name,
				URL: `https://www.reddit.com${data.permalink}`,
				title: data.title,
				thumbnail: {
					URL: data.thumbnail,
					height: data.thumbnail_height,
					width: data.thumbnail_width,
				},
				authorID: data.author_fullname || null,
				authorName: data.author,
				createdAtUTC: new Date(data.created_utc * 1000) || null,
				upvotes: data.ups,
				downvotes: data.downs,
				subreddit: {
					ID: data.subreddit_id,
					name: data.subreddit,
					type: data.subreddit_type,
					subscribers: data.subreddit_subscribers || 0,
				},
				flags: FLAGS.reduce((acc, [key, flag]) => {
					if(data[key]) acc.push(flag);
					return acc;
				}, []),
			};
		},
		raw(){ return data; },
	};
}

async function search(searchString, { quantity = 100, subreddit = null } = {}){
	const url = (
		subreddit ? `https://www.reddit.com/r/${subreddit}.json` : 'https://www.reddit.com/search.json'
	) + `?q=${encodeURIComponent(searchString)}&sort=new&limit=${quantity}&raw_json=1`;

	const data = await fetch(url);

	return data.data.children.map(Image);
}

async function subredditExists(subreddit){
	try{
		const response = await fetch(`https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`);
		const data = JSON.parse(response.body);

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
	let url = `https://www.reddit.com/r/${subreddit}/new.json?raw_json=1&limit=100`;
	if(options.last) url += `&after=${encodeURIComponent(options.last.postData.id)}`;

	const response = await fetch(url, options);
	const data = JSON.parse(response.body);
	// console.log(data.headers);
	if(data.error) throw new Error(`${data.message} (code: ${data.error})`);

	return data.data.children.map(Image);
}

module.exports = { search, getFromSubreddit, subredditExists };