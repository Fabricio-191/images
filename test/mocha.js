/* eslint-disable complexity */
/* eslint-disable no-invalid-this */
/* eslint-disable prefer-arrow-callback */
/* eslint-env mocha */
// @ts-nocheck
const Images = require('../lib');
const https = require('https'), http = require('http');
function get(url){
	return new Promise((res, rej) => {
		(new URL(url).protocol === 'https:' ? https : http)
			.request(url, response => {
				response.destroy();
				if(response.statusCode !== 200){
					rej(new Error(`${response.statusMessage} (code: ${response.statusCode})`));
				}

				res();
			})
			.once('error', rej)
			.end();
	});
}

const hostsToTest = Images.allHosts;
const checkAllImages = false;

describe('Reddit', function(){
	this.timeout(25000);
	this.slow(15000);
	it('getFromSubreddit', async function(){
		const images = await Images.reddit.getFromSubreddit('memes');

		await Promise.all(
			checkAllImages ? images.map(checkRedditImage) : [
				checkRedditImage(images[Math.floor(Math.random() * images.length)]),
				checkRedditImage(images[Math.floor(Math.random() * images.length)]),
				checkRedditImage(images[Math.floor(Math.random() * images.length)]),
				checkRedditImage(images.find(x => !x.video) || null),
			]
		);
	});

	it('search', async function(){
		const images = await Images.reddit.search('runescape');

		await Promise.all(
			checkAllImages ? images.map(checkRedditImage) : [
				checkRedditImage(images[Math.floor(Math.random() * images.length)]),
				checkRedditImage(images[Math.floor(Math.random() * images.length)]),
				checkRedditImage(images[Math.floor(Math.random() * images.length)]),
				checkRedditImage(images.find(x => !x.video) || null),
			]
		);
	});
});

describe("Booru's", function(){
	this.timeout(25000);
	this.slow(15000);

	for(const host of hostsToTest){
		it(host, async () => {
			const images = await Images(host);
			if(images.length === 0){
				throw new Error('0 results');
			}

			await Promise.all(
				checkAllImages ? images.map(check) : [
					check(images[Math.floor(Math.random() * images.length)]),
					check(images[Math.floor(Math.random() * images.length)]),
					check(images[Math.floor(Math.random() * images.length)]),
					check(images.find(x => !x.isVideo) || null),
				]
			);
		});
	}
});

function isStr(str){
	return typeof str === 'string' && str.length > 0;
}
function isURL(str){
	if(!isStr(str)) return false;

	try{
		// eslint-disable-next-line no-new
		new URL(str);
		return true;
	}catch(e){
		return false;
	}
}

async function checkRedditImage(image){
	if(image === null) return;
	if(typeof image !== 'object'){
		throw new Error("'image' must be an object");
	}

	const errors = [];
	if(typeof image.raw !== 'object'){
		errors.push('"image.raw" should be an object');
	}
	if(Object.prototype.propertyIsEnumerable.call(image, 'raw')){
		errors.push('"image.raw" should not be enumerable');
	}
	if(!isStr(image.title)){
		errors.push("'image.title' must be a string");
	}
	if(isURL(image.URL)){
		try{
			await get(image.URL);
		}catch(e){
			errors.push("'image.URL' is not valid");
		}
	}else{
		errors.push("'image.URL' must be a URL");
	}
	if(!isURL(image.postURL)){
		errors.push("'image.postURL' must be a URL");
	}
	if(!isStr(image.domain)){
		errors.push("'image.domain' must be a string");
	}
	if('thumbnail' in image){
		if(isURL(image.thumbnail.URL)){
			try{
				await get(image.thumbnail.URL);
			}catch(e){
				errors.push('"image.thumbnail.URL" is not a valid image');
			}
		}else{
			errors.push('"image.thumbnail.URL" is not a valid URL');
		}
		if(isNaN(image.thumbnail.width)){
			errors.push('"image.thumbnail.width" should be a number');
		}
		if(isNaN(image.thumbnail.height)){
			errors.push('"image.thumbnail.height" should be a number');
		}
	}else{
		errors.push("'image.thumbnail' is missing");
	}
	if('video' in image){
		if(isURL(image.video.URL)){
			try{
				await get(image.video.URL);
			}catch(e){
				errors.push('"image.video.URL" is not a valid image');
			}
		}else{
			errors.push('"image.video.URL" is not a valid URL');
		}
		if(isNaN(image.video.width)){
			errors.push('"image.video.width" should be a number');
		}
		if(isNaN(image.video.height)){
			errors.push('"image.video.height" should be a number');
		}
		if(isNaN(image.video.duration)){
			errors.push('"image.video.duration" should be a number');
		}
		if(typeof image.video.isGif !== 'boolean'){
			errors.push('"image.video.duration" should be a boolean');
		}
	}

	if(errors.length){
		const err = Error(image.video ? 'Invalid video' : 'Invalid image');
		// eslint-disable-next-line no-extra-parens
		err.stack = errors.map(x => (
			image.video ? x.replace('image', 'video') : x
		)).join('\n');
		throw err;
	}
}

async function check(image){
	if(image === null) return;
	if(typeof image !== 'object'){
		throw new Error("'image' must be an object");
	}
	const errors = [];

	if(typeof image.raw !== 'object'){
		errors.push('"image.raw" should be an object');
	}
	if(Object.prototype.propertyIsEnumerable.call(image, 'raw')){
		errors.push('"image.raw" should not be enumerable');
	}
	if(!isURL(image.URL)){
		errors.push('"image.URL" is not a valid URL');
	}
	if(!Array.isArray(image.tags) || !image.tags.every(isStr)){
		errors.push('"image.tags" are invalid');
	}
	if(!['explicit', 'questionable', 'safe', 'unknown'].includes(image.rating)){
		errors.push('"image.rating" is invalid');
	}
	if(typeof image.isVideo !== 'boolean'){
		errors.push('"image.isVideo" should be a boolean');
	}
	if(isURL(image.file.URL)){
		try{
			await get(image.file.URL);
		}catch(e){
			errors.push('"image.file.URL" is not a valid image');
		}
	}else{
		errors.push('"image.file.URL" is not a valid URL');
	}
	if(isNaN(image.file.width)){
		errors.push('"image.file.width" should be a number');
	}
	if(isNaN(image.file.height)){
		errors.push('"image.file.height" should be a number');
	}
	if(isURL(image.thumbnailURL)){
		try{
			await get(image.thumbnailURL);
		}catch(e){
			errors.push('"image.thumbnailURL" is not a valid image');
		}
	}else{
		errors.push('"image.thumbnailURL" is not a valid URL');
	}

	if('resized' in image){
		if(isURL(image.resized.URL)){
			try{
				await get(image.resized.URL);
			}catch(e){
				errors.push('"image.resized.URL" is not a valid image');
			}
		}else{
			errors.push('"image.resized.url" is not a valid URL');
		}

		if('width' in image.resized || 'height' in image.resized){
			if(isNaN(image.resized.width)){
				errors.push('"image.resized.width" should be a number');
			}
			if(isNaN(image.resized.height)){
				errors.push('"image.resized.height" should be a number');
			}
		}
	}

	if(errors.length){
		const err = Error(image.isVideo ? 'Invalid video' : 'Invalid image');
		// eslint-disable-next-line no-extra-parens
		err.stack = errors.map(x => (
			image.isVideo ? x.replace('image', 'video') : x
		)).join('\n');
		throw err;
	}
}