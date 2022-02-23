const axios = require('axios').default;

const prepareRequest = require('./sites.js');
// const handleAuth = require('./authentication.js');
const parse = require('./imageParsing.js');

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

module.exports = async function main(host, options = {}, requestOptions = {}){
	checkOptions(host, options, requestOptions);

	const url = prepareRequest(host, options, requestOptions);
	// handleAuth(host, url, options, requestOptions);

	const response = await axios.get(url.toString(), {
		responseType: 'text',
		...requestOptions,
	});

	return parse(response.data, host);
};
module.exports.hosts = workingHosts;