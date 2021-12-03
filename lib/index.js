const { fetch } = require('./modules/utils.js');
const sites = require('./modules/sites.js');

const workingHosts = [
	'gelbooru.com',
	'safebooru.donmai.us',
	'safebooru.org',
	'danbooru.donmai.us',
	'rule34.paheal.net',
	'rule34.xxx',
	'lolibooru.moe',
	'e621.net',
	'e926.net',
	'xbooru.com',
	'derpibooru.org',
	'tbib.org',

	'yande.re',
	'hypnohub.net',
	'konachan.com',
	'konachan.net',
	'mspabooru.com',
	'www.sakugabooru.com',
	'shimmie.shishnet.org',
	'booru.allthefallen.moe',
	'cascards.fluffyquack.com',
	'www.booru.realmofastra.ca',
];

function checkOptions(host, options, requestOptions){
	if(!workingHosts.includes(host)) throw new Error(`"${host}" is not a valid host`);

	if(typeof options !== 'object'){
		throw new Error('"options" must be an object');
	}
	if(typeof requestOptions !== 'object'){
		throw new Error('"requestOptions" must be an object');
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
		throw Error(`Limit exceeded, for "${host}" max limit is: ${max}`);
	}else{
		options.limit = max;
	}
	if(!('query' in options) && host === 'derpibooru.org') options.query = 'image';

	if(!('headers' in requestOptions)) requestOptions.headers = {};
	if(!('User-Agent' in requestOptions.headers)){
		requestOptions.headers['User-Agent'] = `request by ${
			options.user || process.env.USERNAME || 'unknown'
		} with Node.js (${process.version}) module https://github.com/Fabricio-191/images`;
	}
}

async function main(host, options = {}, requestOptions = {}){
	checkOptions(host, options, requestOptions);

	// @ts-ignore
	const url = new URL(`https://${host}/${sites.getFrom(sites.paths, host)}`);

	// if(sites.http.includes(host)) url.protocol = 'http';

	const params = sites.getFrom(sites.searchParams, host);
	for(const key in params){
		if(key in options){
			url.searchParams.set(params[key], options[key]);
		}
	}

	const auth = sites.getFrom(sites.auths, host);
	if(auth !== null) auth(url, requestOptions, options);

	url.host = sites.hosts[host] || host;

	const { body } = await fetch(url, requestOptions);
	return sites.getFrom(sites.parsers, host)(body, host)
		// eslint-disable-next-line no-confusing-arrow
		.filter(img => img.file ? img.file.url : img.id)
		.map(d => sites.parseImage(d, host));
}

module.exports = main;
module.exports.hosts = workingHosts;
module.exports.reddit = require('./modules/reddit.js');