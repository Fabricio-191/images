/* eslint-disable no-shadow */
const {
	fetch, random, subredditExists,
	CONSTANTS, Image,
} = require('./utils/utils.js');

// https://www.reddit.com/dev/api#GET_new
// const EMPTY_IMG = Buffer.from(CONSTANTS.EMPTY_IMG);
// const REGEX = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|gifv)/g;

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

const globalCache = new Map();
let timeout = 1800000; // .5h

async function SubredditCache(subreddit){
	if(!await subredditExists(subreddit)){
		throw new Error(`Subreddit "${subreddit}" does not exists`);
	}
	if(!globalCache.has(subreddit)){
		globalCache.set(subreddit, []);
	}
	const cache = globalCache.get(subreddit);
	const usedImages = [];
	let lastPage = 0;

	return async function getImage(){
		const image = cache.find(x => !usedImages.includes(x.post.id));

		if(image){
			if(usedImages.includes(image.post.id)){
				return await getImage();
			}
			return image;
		}

		const images = await getFromSubreddit(subreddit, lastPage++);
		cache.push(...images);

		setTimeout(cache => {
			for(const image of images){
				cache.splice(cache.indexOf(image), 1);
			}
		}, timeout, cache);

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
exports.search = async function(searchString, options){
	const { sort = 'new', quantity = 100, subreddit } = options;

	if(!CONSTANTS.SEARCH_SORTS.includes(sort)){
		throw new Error(`"${sort}" is not a valid sorting`);
	}

	const url = (
		subreddit ? `https://www.reddit.com/r/${subreddit}` : 'https://www.reddit.com/search.json'
	) + `?q=${encodeURIComponent(searchString)}&sort=${sort}&limit=${quantity}&raw_json=1`;

	const data = await fetch(url);

	return data.data.children.map(Image).filter(x => x);
};
exports.setTimeout = time => {
	if(typeof time !== 'number'){
		throw new Error('');
	}
	timeout = time;
};

async function getFromSubreddit(subreddit, page = 0){
	if(Array.isArray(subreddit)) subreddit = random(subreddit);
	const response = await fetch(`https://www.reddit.com/r/${subreddit}/new.json?raw_json=1&count=${page}`);
	const data = await response.JSON();

	return data.data.children.map(Image);
}