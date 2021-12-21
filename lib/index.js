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
}

function prepareRequest(host, options, requestOptions){
	checkOptions(host, options, requestOptions);

	// @ts-ignore
	const url = new URL(`https://${host}/${sites.getFrom(sites.paths, host)}`);
	// if(sites.http.includes(host)) url.protocol = 'http';

	if(!('headers' in requestOptions)) requestOptions.headers = {};
	if(!('User-Agent' in requestOptions.headers)){
		requestOptions.headers['User-Agent'] = `request by ${
			options.user || process.env.USERNAME || 'unknown'
		} with Node.js (${process.version}) module https://github.com/Fabricio-191/images`;
	}

	const params = sites.getFrom(sites.searchParams, host);
	const max = sites.getFrom(sites.maxLimits, host);

	if(max < options.limit){
		throw Error(`Limit exceeded, for "${host}" max limit is: ${max}`);
	}
	url.searchParams.set(params.limit, options.limit || max);

	if('page' in options){
		// @ts-ignore
		url.searchParams.set(params.page, options.page - sites.pageZero.includes(host));
	}
	if('query' in options){
		url.searchParams.set(params.query, options.query);
	}else if(host === 'derpibooru.org' && !options.query){
		options.query = 'image';
	}

	const auth = sites.getFrom(sites.auths, host);
	if(auth !== null && 'user' in options && 'pass' in options){
		auth(url, options, requestOptions);
	}

	url.host = sites.hosts[host] || host;

	return url;
}

module.exports = async function main(host, options = {}, requestOptions = {}){
	const url = prepareRequest(host, options, requestOptions);

	const { body } = await fetch(url, requestOptions);

	return sites.getFrom(sites.parsers, host)(body, host)
		// eslint-disable-next-line no-confusing-arrow
		.filter(img => img.file ? img.file.url : img.id)
		.map(d => sites.parseImage(d, host));
};
module.exports.prepare = function prepare(host, options = {}, requestOptions = {}){
	const url = prepareRequest(host, options, requestOptions);
	const parser = sites.getFrom(sites.parsers, host);

	return async () => {
		const { body } = await fetch(url, requestOptions);

		return parser(body, host)
			// eslint-disable-next-line no-confusing-arrow
			.filter(img => img.file ? img.file.url : img.id)
			.map(d => sites.parseImage(d, host));
	};
};
module.exports.hosts = workingHosts;
module.exports.reddit = require('./modules/reddit.js');