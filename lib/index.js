/* eslint-disable no-confusing-arrow */
const { fetch } = require('./modules/utils.js');
const sites = require('./modules/sites.js');

const workingHosts = [
	'danbooru.donmai.us',
	'safebooru.donmai.us',
	'hypnohub.net',
	'booru.allthefallen.moe',
	'e621.net',
	'e926.net',
	'konachan.com',
	'konachan.net',
	'yande.re',
	'www.sakugabooru.com',
	'lolibooru.moe',
	'shimmie.shishnet.org',
	'cascards.fluffyquack.com',
	'www.booru.realmofastra.ca',
	'rule34.paheal.net',
	'gelbooru.com',
	'safebooru.org',
	'tbib.org',
	'rule34.xxx',
	'mspabooru.com',
	'derpibooru.org',
	'xbooru.com',
];

function checkOptions(options, requestOptions, host){
	if(!workingHosts.includes(host)) throw new Error(`"${host}" is not a valid host`);

	if(typeof options !== 'object'){
		throw new Error('"options" must be an object');
	}
	if(typeof requestOptions !== 'object'){
		throw new Error('"options" must be an object');
	}
	for(const key of ['query', 'user', 'pass']){
		if(key in options && typeof options[key] !== 'string'){
			throw new Error(`"${key}" must be a string`);
		}
	}
	for(const key of ['page', 'limit']){
		if(key in options && typeof options[key] !== 'number'){
			throw new Error(`"${key}" must be a number`);
		}
	}

	const max = sites.getFrom(sites.maxLimits, host);
	if('limit' in options && max < options.limit){
		throw Error('Limit exceeded');
	}else{
		options.limit = max;
	}
	if(!options.query && host === 'derpibooru.org') options.query = 'image';

	if(!('headers' in requestOptions)) requestOptions.headers = {};
	if(!('User-Agent' in requestOptions.headers)){
		requestOptions.headers['User-Agent'] = `request by ${
			options.user || process.env.USERNAME || 'unknown'
		} with Node.js (${process.version}) module https://github.com/Fabricio-191/images`;
	}
}

async function main(host, options = {}, requestOptions = {}){
	checkOptions(options, requestOptions, host);

	// @ts-ignore
	const url = new URL(`https://${host}/${sites.getFrom(sites.paths, host)}`);
	if(sites.http.includes(host)) url.protocol = 'http';

	const params = sites.getFrom(sites.searchParams, host);
	for(const key in params){
		if(key in options){
			url.searchParams.set(params[key], options[key]);
		}
	}

	const auth = sites.getFrom(sites.auths, host);
	if(auth !== null) auth(url, requestOptions, options);

	const { body } = await fetch(url, requestOptions);
	return sites.getFrom(sites.parsers, host)(body, host)
		.filter(img => img.file ? img.file.url : img.id)
		.map(d => sites.parseImage(d, host));
}

module.exports = main;
module.exports.allHosts = workingHosts;
module.exports.reddit = require('./modules/reddit.js');