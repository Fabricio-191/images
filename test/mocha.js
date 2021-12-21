/* eslint-disable complexity */
/* eslint-disable no-invalid-this */
/* eslint-disable prefer-arrow-callback */
/* eslint-env mocha */
// @ts-nocheck
const Images = require('../lib');
/*
const https = require('https'), http = require('http');

function checkURL(url){
	return new Promise((res, rej) => {
		(new URL(url).protocol === 'https:' ? https : http)
			.request(url, response => {
				response.destroy();
				if(response.statusCode !== 200){
					rej(Error(`${response.statusMessage} (code: ${response.statusCode})`));
				}

				res();
			})
			.once('error', rej)
			.end();
	});
}
function isStr(str){
	return typeof str === 'string' && str.length > 0;
}
function random(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}
*/

class MyError extends Error{
	constructor(message, stack = ''){
		super(message);
		this.stack = stack;
	}
}

/*
describe('Reddit', function(){
	this.timeout(25000);
	this.slow(15000);

	it('getFromSubreddit', Images.reddit.getFromSubreddit('memes'));
	it('search', Images.reddit.search('runescape'));
});
*/

describe("Booru's", function(){
	this.timeout(20000);
	this.slow(10000);

	for(const host of Images.hosts){
		it(host, async () => {
			const images = await Images(host, { limit: 30 });

			if(images.length === 0) throw new MyError('0 results');
			if(images.length !== 30) throw new MyError('"limit" param is not working well');

			const URLs = new Set(images.map(i => i.URL));

			const secondPage = await Images(host, { limit: 30, page: 2 });
			if(secondPage.some(img => URLs.has(img.URL))){
				throw new MyError('"page" param is not working well');
			}

			const firstPage = await Images(host, { limit: 30, page: 1 });
			for(const img of firstPage) URLs.delete(img.URL);

			if(URLs.size !== 0){
				throw new MyError('"page" param is not working well');
			}
		});
	}
});