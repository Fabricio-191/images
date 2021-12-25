/* eslint-env mocha */
/* eslint-disable no-invalid-this */
// @ts-nocheck
const Images = require('../');
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
	return typeof str === 'string' && str.length > 0 && !['undefined', 'null', 'NaN'].includes(str);
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

describe('Reddit', function(){
	this.timeout(25000);
	this.slow(15000);

	it('getFromSubreddit', () => Images.reddit.getFromSubreddit('memes'));
	it('search', () => Images.reddit.search('runescape'));
});

describe("Booru's", function(){
	this.timeout(25000);
	this.slow(15000);

	for(const host of Images.hosts){
		it(host, async () => {
			for(let i = 0; i < 3; i++){
				const images = await Images(host, { limit: 30 });

				if(images.length === 0) throw new MyError('0 results');
				if(
					images.length > 30 ||
					images.length < 20
				){
					throw new MyError('"limit" param is not working well');
				}

				if(host === 'rule34.paheal.net') return;

				const URLs = new Set(images.map(img => img.URL));

				const firstPage = await Images(host, { limit: 30, page: 1 });
				for(const img of firstPage) URLs.delete(img.URL);

				if(URLs.size !== 0){
					throw new MyError('"page" param is not working well');
				}
			}
		});
	}
});

