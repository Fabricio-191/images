/* eslint-disable switch-colon-spacing */
const https = require('https');

function fetch(url, options = {}){
	return new Promise((resolve, reject) => {
		https
			.request(url, options, response => {
				const buffer = () => new Promise((res, rej) => {
					const chunks = [];

					response
						.on('data', chunk => chunks.push(chunk))
						.on('end', () => res(Buffer.concat(chunks)))
						.on('error', rej);
				});

				resolve({
					response,
					buffer,
					async body(){
						return (await buffer()).toString();
					},
					async JSON(){
						return JSON.parse(await buffer());
					},
				});
			})
			.once('error', reject)
			.end();
	});
}

function random(array){
	return array[
		Math.floor(Math.random() * array.length)
	];
}

function merge(...sources){
	return sources.reduce((acc, obj) => {
		Object.entries(obj).forEach(([key, value]) => {
			if(typeof value === 'object' && value !== null && acc[key]){
				merge(acc[key], value);
			}else{
				acc[key] = value;
			}
		});

		return acc;
	}, Array.isArray(sources[0]) ? [] : {});
}

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
	if(data.crosspost_parent_list){
		return 'cross:' + type;
	}
	return 'ext:' + type;
}

async function subredditExists(subreddit){
	try{
		const res = await fetch(`https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`);
		const data = await res.JSON();

		// eslint-disable-next-line eqeqeq
		if(data.error == 404) return false;

		return true;
	}catch(e){
		return false;
	}
}

module.exports = {
	fetch,
	random,
	merge,
	getType,
	subredditExists,
};