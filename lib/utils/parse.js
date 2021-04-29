const BASE_URL = 'https://www.reddit.com';
const CONSTANTS = require('./constants.json');
const flags = Object.entries(CONSTANTS.FLAGS);

function getType(data){
	const type = {
		'rich:video': 'video',
		image: 'image',
		undefined: 'gif',
	}[data.post_hint];

	if(!type) return null;

	if(data.is_reddit_media_domain){
		return type;
	}
	if(data.crosspost_parent || data.crosspost_parent_list){
		return 'cross:' + type;
	}
	return 'ext:' + type;
}

const handlers = {
	image(data){
		return {
			url: data.url,
		};
	},
	video(data){
		return {
			url: data.url,
		};
	},
	gif(data){
		return {
			url: data.url,
		};
	},
	'cross:image'(data){
		return {
			url: data.url,
		};
	},
	'cross:video'(data){
		return {
			url: data.url,
		};
	},
	'cross:gif'(data){
		return {
			url: data.url,
		};
	},
	'ext:image'(data){
		return {
			url: data.url,
		};
	},
	'ext:video'(data){
		return {
			url: data.url,
		};
	},
	'ext:gif'(data){
		return {
			url: data.url,
		};
	},
};

function Image({ data }){
	const type = getType(data);
	if(!type) return null;

	return {
		type,
		...handlers[type](data),
		data: {
			// name: data.name,
			id: data.id,
			title: data.title,
			url: BASE_URL + data.permalink,
			thumbnail: {
				url: data.thumbnail,
				height: data.thumbnail_height,
				width: data.thumbnail_width,
			},
			author: {
				id: data.author_fullname,
				name: data.author,
				premium: data.author_premium || false,
			},
			createdAtUTC: new Date(data.created_utc * 1000) || null,
			votes: {
				up: data.ups,
				down: data.downs,
				total: data.score,
				ratio: data.upvote_ratio,
			},
			subreddit: {
				id: data.subreddit_id,
				name: data.subreddit,
				type: data.subreddit_type,
				subscribersQuantity: data.subreddit_subscribers || 0,
			},
			awards: {
				quantity: data.total_awards_received,
				all: data.all_awardings,
				awarders: data.awarders,
			},
			commentsQuantity: data.num_comments,
			flags: flags.reduce((acc, [key, flag]) => {
				if(data[key]) acc.add(flag);
				return acc;
			}, new Set()),
		},
	};
}

module.exports = Image;