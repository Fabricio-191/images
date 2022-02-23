const axios = require('axios').default;
const { parse, checkOptions } = require('./utils');

async function request(url, options, requestOptions){
	for(const key of ['limit', 'after', 'before']){
		if(key in options) url.searchParams.set(key, options[key]);
	}
	// await authentication(url, options, requestOptions);

	const { data } = await axios.get(url.toString(), requestOptions);
	if(data.error) throw new Error(`${data.message} (code: ${data.error})`);

	return data.data.children.map(parse).filter(x => x);
}

async function search(searchString, options = {}, requestOptions = {}){
	if(typeof searchString !== 'string' && searchString !== ''){
		throw new Error('"searchString" must be a non-empty string');
	}else checkOptions(options, requestOptions);

	// @ts-ignore
	const url = new URL('https://www.reddit.com/search.json?sort=new&data_json=1');
	url.searchParams.set('q', searchString);
	if('subreddit' in options){
		if(await subredditExists(options.subreddit)){
			url.pathname = `r/${options.subreddit}.json`;
		}else{
			throw new Error(`subreddit "${options.subreddit}" does not exists`);
		}
	}

	return await request(url, options, requestOptions);
}

async function getFromSubreddit(subreddit, options = {}, requestOptions = {}){
	if(typeof subreddit !== 'string' && subreddit !== ''){
		throw new Error('"subreddit" must be a non-empty string');
	}else checkOptions(options, requestOptions);

	return await request(
		// @ts-ignore
		new URL(`https://www.reddit.com/r/${subreddit}/new.json?data_json=1`),
		options,
		requestOptions
	);
}

module.exports = { getFromSubreddit, search, subredditExists };

async function subredditExists(subreddit){
	try{
		const { data } = await axios.get(`https://www.reddit.com/r/${subreddit}/about.json?data_json=1`);

		if(data.error === 404) return false;

		return true;
	}catch{
		return false;
	}
}

// &include_over_18=1