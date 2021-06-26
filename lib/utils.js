const CONSTANTS = require('./constants.json'),
	flags = Object.entries(CONSTANTS.FLAGS),
	https = require('https');

function fetch(url, options = {}){
	return new Promise((res, rej) => {
		https.request(url, options, response => {
			const chunks = [];

			response
				.on('data', chunk => chunks.push(chunk))
				.once('end', () => res(JSON.parse(
					Buffer.concat(chunks).toString()
				)))
				.once('error', rej);
		})
			.once('error', rej)
			.end();
	});
}

const random = array => array[Math.floor(Math.random() * array.length)];

// const save = (data, path = 'cosas') => require('fs').writeFileSync(`../${path}.json`, JSON.stringify(data, null, '\t'))

async function subredditExists(subreddit){
	try{
		const data = await fetch(`https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`);

		if(data.error === 404) return false;

		return true;
	}catch(e){
		return false;
	}
}

const handlers = {
	link(data){
		return { url: data.url };
	},
	image(data){ return { url: data.url }; },
	video(data){
		const video = data.media ? data.media.reddit_video || data.media.oembed :
			data.preview.reddit_video_preview;

		return {
			url: data.url,
			// @ts-ignore
			domain: data.domain || new URL(data.url).host,
			fallbackUrl: video.fallback_url || null,
			height: video.height,
			width: video.width,
			duration: video.duration || null,
			isGif: video.is_gif || false,
		};
	},
	'ext:image'(data){
		return {
			url: data.url,
			domain: data.domain,
		};
	},
	text(data){ return { text: data.selftext }; },
	deleted(data){
		return {
			reason: data.removed_by_category,
			text: data.selftext,
		};
	},
	null(){ return {}; },
};

function getType(data){
	if(data.removed_by_category || data.banned_by) return 'deleted';
	let type = CONSTANTS.HINTS[data.post_hint] || null;

	if(type === 'image' && !data.is_reddit_media_domain){
		type = 'ext:image';
	}else if(
		type === 'link' && data.preview &&
		data.preview.reddit_video_preview
	) type = 'video';

	return type;
}

function Image({ data }){
	const type = getType(data);

	return {
		type,
		...handlers[type](data),
		postData: {
			id: data.name,
			url: CONSTANTS.BASE_URL + data.permalink,
			title: data.title,
			thumbnail: {
				url: data.thumbnail,
				height: data.thumbnail_height,
				width: data.thumbnail_width,
			},
			authorId: data.author_fullname,
			authorName: data.author,
			createdAtUTC: new Date(data.created_utc * 1000) || null,
			upvotes: data.ups,
			downvotes: data.downs,
			subreddit: {
				id: data.subreddit_id,
				name: data.subreddit,
				type: data.subreddit_type,
				subscribersQty: data.subreddit_subscribers || 0,
			},
			/*
			awards: {
				quantity: data.total_awards_received,
				all: data.all_awardings,
				awarders: data.awarders,
			},
			*/
			commentsQty: data.num_comments,
			flags: flags.reduce((acc, [key, flag]) =>
				// eslint-disable-next-line no-extra-parens
				(data[key] ? acc.add(flag) : acc), new Set()
			),
		},
		get raw(){ return data; },
	};
}

module.exports = {
	fetch, random, subredditExists,
	CONSTANTS, Image,
};