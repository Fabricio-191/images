/* eslint-disable no-invalid-this */
/* eslint-env mocha */
// @ts-nocheck
const Images = require('../lib');

const isStr = str => typeof str === 'string' && str.length > 0;
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

const ratings = ['explicit', 'questionable', 'safe', 'unknown'];
function checkImage(image){
	if(typeof image.raw !== 'object'){
		throw new Error('"image.raw" should be an object');
	}
	if(!isURL(image.URL)){
		throw new Error('"image.URL" is not a valid URL');
	}
	if(!Array.isArray(image.tags) || !image.tags.every(isStr)){
		throw new Error('"image.tags" are invalid');
	}
	if(!isStr(image.rating) || !ratings.includes(image.rating)){
		throw new Error('"image.rating" is invalid');
	}
	if(typeof image.isVideo !== 'boolean'){
		throw new Error('"image.isVideo" should be a boolean');
	}
	if(!isURL(image.file.URL)){
		throw new Error('"image.file.URL" should be a URL');
	}
	if(typeof image.file.width !== 'number'){
		throw new Error('"image.file.width" should be a number');
	}
	if(typeof image.file.height !== 'number'){
		throw new Error('"image.file.height" should be a number');
	}
	if('resized' in image){
		if(!isURL(image.resized.URL)){
			throw new Error('"image.resized.URL" should be a URL');
		}
		if('width' in image.resized || 'height' in image.resized){
			if(typeof image.resized.width !== 'number'){
				throw new Error('"image.resized.width" should be a number');
			}
			if(typeof image.resized.height !== 'number'){
				throw new Error('"image.resized.height" should be a number');
			}
		}
	}
	if(!isURL(image.thumbnailURL)){
		throw new Error('"image.thumbnailURL" is not a valid URL');
	}
	if(Object.prototype.propertyIsEnumerable.call(image, 'raw')){
		throw new Error('"image.raw" should not be enumerable');
	}
}

const credentials = {
	'behoimi.org': { user: 'bananagaming1245', pass: 'GV3#-dTkGtJJD!k' },
	'e621.net': { user: 'bananagaming1245', pass: '8Eu5R4HF7qaTtANhewNXx73z' },
	'e926.net': { user: 'bananagaming1245', pass: '8Eu5R4HF7qaTtANhewNXx73z' },
};

describe('Hosts', () => {
	for(const host of Images.allHosts){
		it(host, done => {
			Images(host, credentials[host])
				.then(images => {
					images.forEach(checkImage);
				})
				.then(done)
				.catch(done);
		});
	}
});

describe('Reddit', () => {
	it('should work', function(done){
		this.timeout(30000);

		Promise.all([
			Images.reddit.getFromSubreddit('memes'),
			Images.reddit.search('runescape'),
		])
			.then(() => done())
			.catch(done);
	});
});