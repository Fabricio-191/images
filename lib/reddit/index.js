const { parse, checkOptions, authentication, fetch } = require('./utils');

async function search(searchString, options = {}, requestOptions = {}){
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
	if('limit' in options) url.searchParams.set('limit', options.limit);

	const { body } = await fetch(url, requestOptions);
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

	authentication(url, options, requestOptions);

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