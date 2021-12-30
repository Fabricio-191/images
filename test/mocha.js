/* eslint-env mocha */
/* eslint-disable no-invalid-this */
/* eslint-disable complexity */

// @ts-nocheck
const Images = require('../');
const https = require('https'), http = require('http');

const validRatings = ['safe', 'questionable', 'explicit', 'unknown'];

function get(url){
	return new Promise((res, rej) => {
		(new URL(url).protocol === 'https:' ? https : http)
			.request(url, {
				headers: {
					'User-Agent': `test request with Node.js (${process.version}) module https://github.com/Fabricio-191/images`,
				},
			}, response => {
				response.destroy();

				// const obj = { requestURL: url.toString() }; for(const key of ['httpVersion', 'url', 'method', 'statusCode', 'statusMessage', 'headers']){ obj[key] = response[key]; } console.log(obj); // eslint-disable-line no-console

				if(response.statusCode !== 200){
					rej(Error(`${response.statusMessage} (code: ${response.statusCode})`));
				}

				res();
			})
			.once('error', rej)
			.end();
	});
}
const is = {
	url(url){
		try{
			// eslint-disable-next-line no-new
			new URL(url);
			return true;
		}catch{
			return false;
		}
	},
	str(str){
		return typeof str === 'string' && str.length > 0 && !['undefined', 'null', 'NaN'].includes(str);
	},
	num(num){
		return typeof num === 'number' && !isNaN(num) && num !== Infinity && num !== -Infinity;
	},
	obj(obj){
		return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
	},
	arr(arr){
		return typeof arr === 'object' && arr !== null && Array.isArray(arr);
	},
};

class MyError extends Error{
	constructor(message, stack = ''){
		super(message);
		this.stack = stack;
	}
}

describe('Reddit', function(){
	this.timeout(25000);
	this.slow(15000);

	async function testMethod(fn){
		const images = await fn({ limit: 30 });

		const imagesAfter = await fn({ limit: 30, after: images[14].ID });
		for(let i = 0; i < 15; i++){
			if(images[i + 15].ID !== imagesAfter[i].ID) throw new MyError('"after" param is not working well');
		}

		const imagesBefore = await fn({ limit: 30, before: images[15].ID });
		for(let i = 0; i < 15; i++){
			if(images[i].ID !== imagesBefore[i].ID) throw new MyError('"before" param is not working well');
		}
	}

	it('getFromSubreddit', async () => {
		await testMethod(async opts => {
			const images = await Images.reddit.getFromSubreddit('memes', opts);
			if(images.length === 0) throw new MyError('0 results');
			if(images.length !== opts.limit){
				throw new MyError('"limit" param is not working well');
			}

			return images;
		});
	});
	it('search', async () => {
		await testMethod(async opts => {
			const images = await Images.reddit.search('runescape', opts);

			if(images.length === 0) throw new MyError('0 results');
			if(images.length > opts.limit){
				throw new MyError('"limit" param is not working well');
			}

			return images;
		});
	});
});

describe("Booru's", function(){
	this.timeout(25000);
	this.slow(15000);

	for(const host of ['rule34.xxx']){ // Images.hosts){
		it(host, async () => {
			const images = await Images(host, { limit: 30 });

			if(images.length === 0) throw new MyError('0 results');
			if(images.length > 30 || images.length < 25){
				throw new MyError('"limit" param is not working well');
			}

			if(host !== 'rule34.paheal.net'){
				const URLs = new Set(images.map(img => img.URL));

				const firstPage = await Images(host, { limit: 30, page: 1 });
				for(const img of firstPage) URLs.delete(img.URL);

				if(URLs.size !== 0){
					throw new MyError('"page" param is not working well');
				}
			}

			const toCheck = images.filter(x => x.type === 'image').slice(0, 3);

			if(images.find(x => x.type === 'video')){
				toCheck.push(images.find(x => x.type === 'video'));
			}
			if(images.find(x => x.type === 'gif')){
				toCheck.push(images.find(x => x.type === 'gif'));
			}

			await Promise.all(toCheck.map(checkImage));
		});
	}
});

async function checkImage(image){
	if(typeof image !== 'object') throw new MyError('"image" must be an object');

	const errors = [];

	if(is.url(image.URL)){
		try{
			await get(image.URL);
		}catch(e){
			errors.push(`'image.URL' is not a valid image (${image.URL}, ${e})`);
		}
	}else errors.push('"image.URL" must be a valid URL');

	if(!is.arr(image.tags) || !image.tags.every(is.str)){
		errors.push('"image.tags" must be a array of strings');
	}
	if(!validRatings.includes(image.rating)) errors.push('"image.rating" must be a valid rating');

	if(is.url(image.file.URL)){
		try{
			await get(image.file.URL);
		}catch(e){
			errors.push(`'image.file.URL' is not a valid image (${image.file.URL}, ${e})`);
		}
	}else errors.push('"image.file.URL" must be a valid URL');
	if(!is.num(image.file.width)) errors.push('"image.file.width" must be a number');
	if(!is.num(image.file.height)) errors.push('"image.file.height" must be a number');

	if('resized' in image){
		if(is.url(image.resized.URL)){
			try{
				await get(image.resized.URL);
			}catch(e){
				errors.push(`'image.resized.URL' is not a valid image (${image.resized.URL}, ${e})`);
			}
		}else errors.push('"image.resized.URL" must be a valid URL');

		if('width' in image.resized && 'height' in image.resized){
			if(!is.num(image.resized.width)) errors.push('"image.resized.width" must be a number');
			if(!is.num(image.resized.height)) errors.push('"image.resized.height" must be a number');
		}else if('width' in image.resized || 'height' in image.resized){
			errors.push('there must be "image.resized.width" and "image.resized.height" or none of them');
		}
	}

	if(is.url(image.thumbnailURL)){
		try{
			await get(image.thumbnailURL);
		}catch{
			errors.push("'image.thumbnailURL' is not a valid image");
		}
	}else errors.push('"image.thumbnailURL" must be a valid URL');

	if(!('raw' in image)){
		errors.push('"image.raw" is missing');
	}else if(typeof image.raw !== 'object') errors.push('"image.raw" must be an object');

	if(errors.length){
		throw new MyError('Invalid image', errors.join('\n'));
	}
}