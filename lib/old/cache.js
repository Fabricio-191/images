/* eslint-disable */
const { getFromSubreddit } = require('../reddit');

/* eslint-disable no-invalid-this */
const globalCache = {}, timeout = 7200000; // 2 hours
// const inspect = Symbol.for('nodejs.util.inspect.custom');

const random = array => array[Math.floor(Math.random() * array.length)] || null;

async function getMore(subreddit){
	const cache = globalCache[subreddit], options = { limit: 100 };
	const last = cache.images[cache.images.length - 1] || null;

	if(last !== null){
		if(cache.end){
			if(cache.nextCheck > Date.now()) return null;
			options.before = cache.images[0].ID;
		}else{
			options.after = last.ID;
		}
	}
	const images = await getFromSubreddit(subreddit, options);

	if(images.length === 0){
		if(cache.end){
			cache.nextCheck = Date.now() + 60000;
		}else{
			cache.end = true;
		}
		return null;
	}
	cache.images[cache.end ? 'push' : 'unshift'](...images);

	setTimeout(() => {
		const index = cache.images.indexOf(images[0]);
		cache.images.splice(index, images.length);
	}, timeout).unref();

	return images;
}

async function get(video = null){
	if(typeof video !== 'boolean' && video !== null){
		throw new Error('"video" must be a boolean or null');
	}
	let { images } = this._cache;

	while(images !== null){
		const image = images.find(img =>
			!this._used.includes(img.ID) &&
			(video === null || img.isVideo === video)
		);
		if(image){
			this._used.push(image.ID);
			return image;
		}

		images = await getMore(this.subreddit);
	}

	return random(this._cache.images);
}

class Cache{
	constructor(host){
		this.host = host;
		this._cache = globalCache[host];
	}
	host = null;
	used = [];
	cache = {
		videos: [],
		images: [],
		gifs: [],
	};
	async getVideo(){

	}
	async getImage(){

	}
	async getGIF(){

	}
	async getAny(){

	}
}

module.exports = function SubredditCache(subreddit){
	if(!globalCache[subreddit]) globalCache[subreddit] = {
		images: [],
		untilCheck: 0,
		end: false,
	};

	return get.bind({
		_cache: globalCache[subreddit],
		_used: [],
		subreddit,
	});
};

/*
messageCacheMaxSize 200
Maximum number of messages to cache per channel (-1 or Infinity for unlimited - don't do this without message sweeping, otherwise memory usage will climb indefinitely)

messageCacheLifetime 0
How long a message should stay in the cache until it is considered sweepable (in seconds, 0 for forever)

messageSweepInterval 0
How frequently to remove messages from the cache that are older than the message cache lifetime (in seconds, 0 for never)
*/