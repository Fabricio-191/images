const { fetch, merge, random, getType, subredditExists } = require('./utils.js'),
	CONSTANTS = require('./constants.json');

// https://www.reddit.com/dev/api#GET_new
// const EMPTY_IMG = Buffer.from(CONSTANTS.EMPTY_IMG);
// const REGEX = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|gifv)/g;
const BASE_URL = 'https://www.reddit.com';

/*
	"banned_by": null,
	"banned_at_utc": null,
	"selftext": "",
	"selftext_html": null,
	"category": null,
	"can_mod_post": false,
	"approved_by": null,
	"content_categories": null,
	"likes": null,
	"suggested_sort": null,
	"view_count": null,
	"no_follow": false,
	"num_crossposts": 0,
	"is_crosspostable": false,
	"is_self": false,
	"is_meta": false,
	"treatment_tags": [],
	"num_reports": null,
	"mod_reason_by": null,
	"mod_reports": [],
	"report_reasons": null,
	"user_reports": [],
	"mod_note": null,
	"removal_reason": null,
	"removed_by": null,
	"removed_by_category": null,
	"author_patreon_flair": false,
*/

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

	const result = {
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
			id: data.author_fullname.split('_')[1],
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
		flags: new Set,
	};

	Object.entries(CONSTANTS.FLAGS).forEach(([key, flag]) => {
		if(data[key]) result.flags.add(flag);
	});

	return {
		type,
		...handlers[type](data),
		postData: result,
	};
}

async function SubredditCache(subreddit){
	if(!await subredditExists(subreddit)){
		throw new Error(`Subreddit "${subreddit}" does not exists`);
	}
	const cache = [];
	const usedImages = [];
	let lastPage = 0;

	return async function getImage(){
		const image = cache.shift();

		if(image){
			if(usedImages.includes(image.post.id)){
				return await getImage();
			}
			return image;
		}

		const images = await getFromSubreddit(subreddit, lastPage++);
		cache.push(...images);

		return await getImage();
	};
}

class Images{
	constructor(options){
		this.options = Object.assign({
			checkImages: false,
			defaultCategories: true,
		}, options);
	}
	options = null;
	_cache = {};

	async getFromCategory(category){
		const subreddits = CONSTANTS.CATEGORIES[category];
		if(!subreddits) throw new Error('That category does not exists');

		return await this.getFromSubreddit(random(subreddits));
	}

	async getFromSubreddit(subreddit){
		if(!this._cache[subreddit]){
			this._cache[subreddit] = await SubredditCache(subreddit);
		}

		return await this._cache[subreddit].getImage();
	}
}

module.exports = Images;

exports.categories = CONSTANTS.CATEGORIES;
exports.addSubreddits = obj => merge(CONSTANTS.CATEGORIES, obj);
exports.search = async function(searchString, sort = 'new'){
	const data = await fetch(
		`https://www.reddit.com/search.json?q=${encodeURIComponent(searchString)}&sort=${sort}&limit=100&raw_json=1`
	);

	return data.data.children.map(Image).filter(x => x);
};

async function getFromSubreddit(subreddit, page = 0){
	if(Array.isArray(subreddit)) subreddit = random(subreddit);
	const response = await fetch(`https://www.reddit.com/r/${subreddit}/new.json?raw_json=1&count=${page}`);
	const data = await response.JSON();

	return data.data.children.map(Image);
}