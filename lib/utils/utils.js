const CONSTANTS = require('./constants.json'),
	Image = require('./parse.js'),
	https = require('https');

class Response{
	constructor(response, reject){
		this.response = response;

		this.buffer = new Promise((res, rej) => {
			const chunks = [];

			response
				.on('data', chunk => chunks.push(chunk))
				.once('end', () => res(Buffer.concat(chunks)))
				.once('error', rej);
		})
			.catch(reject);
	}
	response = null;
	buffer = null;

	async body(){ return (await this.buffer).toString(); }

	async JSON(){ return JSON.parse(await this.body()); }
}

function fetch(url, options = {}){
	return new Promise((resolve, reject) => {
		https.request(url, options, response => {
			resolve(new Response(response, reject));
		})
			.once('error', reject)
			.end();
	});
}

const random = array => array[Math.floor(Math.random() * array.length)];

async function subredditExists(subreddit){
	try{
		const res = await fetch(`https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`);
		const data = await res.JSON();

		if(data.error === 404) return false;

		return true;
	}catch(e){
		return false;
	}
}

module.exports = {
	fetch, random, subredditExists,
	CONSTANTS, Image,
};