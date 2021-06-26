/* eslint-disable no-console */
const utils = require('./utils.js');
const globalCache = {}, timeout = 300000; // 5 mins

// https://www.reddit.com/dev/api#GET_new

function SubredditCache(subreddit){
	if(!globalCache[subreddit]) globalCache[subreddit] = [];

	const cache = globalCache[subreddit], used = [];

	return async function getImage(type){
		const image = cache.find(img =>
			!used.includes(img.postData.id) &&
			(!type || img.type.endsWith(type))
		);

		if(image) return image;

		const last = cache[cache.length - 1];
		const images = await getFromSubreddit(subreddit, last);
		if(images.length === 0) return null;
		cache.push(...images);

		setTimeout(() => {
			const index = cache.indexOf(images[0]);
			cache.splice(index, images.length);
		}, timeout).unref();

		return await getImage(type);
	};
}

class ImagesManager{
	_cache = {};

	async getFromCategory(category, type){
		const subreddits = utils.CONSTANTS.CATEGORIES[category];
		if(!subreddits) throw new Error('That category does not exists');

		return await this.getFromSubreddit(utils.random(subreddits), type);
	}

	async getFromSubreddit(subreddit, type = 'image'){
		if(!await utils.subredditExists(subreddit)){
			throw new Error(`subreddit "${subreddit}" does not exists`);
		}
		if(!this._cache[subreddit]){
			this._cache[subreddit] = SubredditCache(subreddit);
		}

		return await this._cache[subreddit](type);
	}

	static categories = utils.CONSTANTS.CATEGORIES;
	static async search(searchString, { quantity = 100, subreddit = null } = {}){
		const url = (
			subreddit ? `https://www.reddit.com/r/${subreddit}.json` : 'https://www.reddit.com/search.json'
		) + `?q=${encodeURIComponent(searchString)}&sort=new&limit=${quantity}&raw_json=1`;

		const data = await utils.fetch(url);

		return data.data.children.map(utils.Image);
	}
}

module.exports = ImagesManager;

async function getFromSubreddit(subreddit, last){
	let url = `https://www.reddit.com/r/${subreddit}/new.json?raw_json=1&limit=100`;
	if(last) url += `&after=${encodeURIComponent(last.postData.id)}`;

	const data = await utils.fetch(url);

	return data.data.children.map(utils.Image);
}

const images = new ImagesManager();
images.getFromSubreddit('nsfw')
	.then(result => {
		console.log(result);

		images.getFromSubreddit('nsfw')
			.then(console.log)
			.catch(console.error);
	})
	.catch(console.error);