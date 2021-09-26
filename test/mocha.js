// @ts-nocheck
/* eslint-env mocha */
const Images = require('../lib');

function isURL(str){
	return isStr(str) && new URL(str);
}

function isStr(str){
	return typeof str === 'string' && str.length > 0;
}

function isNumber(num){
	return !isNaN(num);
}

const types = {
	URL: str => types.string(str) && new URL(str),
	string: str => typeof str === 'string' && str.length > 0,
	number: num => !isNaN(num),
	tags: tags => Array.isArray(tags) && tags.every(types.string),
	image(img){

	},
};

/*

	'file.URL': isURL,
	'file.width': isNumber,
	'file.height': isNumber,
*/

const keys = {
	URL: 'URL',
	tags: 'tags',
	rating: 'string',
	file: 'image',
	resized: 'image',
	thumbnailURL: 'URL',
};

function checkImage(image){
	if()
}

describe('hosts', () => {
	for(const host of Images.allHosts){
		it(host, done => {
			Images(host)
				.then(images => images.forEach(checkImage))
				.then(done)
				.catch(done);
		});
	}
});

function expect(value){
	return {
		toBe(val){
			if(typeof value === 'function') value = value();
			if(val !== value) throw new Error(`expected ${value} to be equal to ${val}`);
		},
		toBeType(type){
			const t = typeof value;

			if(type !== t){
				throw new Error(`expected ${value} to be type ${type} instead of ${t}`);
			}
		},
		toNotThrowError(){
			try{
				value();
			}catch(e){
				throw Error('expected fn not to throw an exception');
			}
		},
		toThrowError(){
			try{
				value();
			}catch(e){
				return;
			}

			throw Error('expected fn to throw an exception');
		},
	};
}
