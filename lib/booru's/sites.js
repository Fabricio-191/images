/* eslint-disable no-mixed-operators */
const { getFrom } = require('../utils/utils.js');

// const http = [];

const hosts = {
	'rule34.xxx': 'api.rule34.xxx',
};

const maxLimits = [
	{
		keys: [
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com',
		],
		value: 1000,
	}, {
		keys: [
			'e621.net',
			'e926.net',
		],
		value: 320,
	}, {
		keys: [
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net',
			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'lolibooru.moe',
			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'hypnohub.net',
			'booru.allthefallen.moe',
			'xbooru.com',
		],
		value: 100,
	}, {
		keys: [
			'derpibooru.org',
		],
		value: 50,
	},
];

const pageZero = [
	'gelbooru.com',
	'safebooru.org',
	'rule34.xxx',
	'xbooru.com',
	'tbib.org',
	'mspabooru.com',
];

const paths = [
	{
		keys: [
			'rule34.xxx',
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'mspabooru.com',
			'xbooru.com',
		],
		value: 'index.php?page=dapi&s=post&q=index&json=1',
	}, {
		keys: [
			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'booru.allthefallen.moe',
			'e621.net',
			'e926.net',
		],
		value: 'posts.json',
	}, {
		keys: [
			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'lolibooru.moe',
		],
		value: 'post.json',
	}, {
		keys: [
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net',
		],
		value: 'api/danbooru/find_posts/index.xml',
	}, {
		keys: [
			'derpibooru.org',
		],
		value: 'api/v1/json/search/images',
	}, {
		keys: [
			'hypnohub.net',
		],
		value: 'post/index.json',
	},
];

const searchParams = [
	{
		keys: [
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
		],
		value: {
			query: 'tags',
			limit: 'limit',
			page: 'page',
		},
	}, {
		keys: [
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com',
			'xbooru.com',
		],
		value: {
			query: 'tags',
			limit: 'limit',
			page: 'pid',
		},
	}, {
		keys: [
			'derpibooru.org',
		],
		value: {
			query: 'q',
			page: 'page',
			limit: 'per_page',
		},
	},
];

module.exports = function prepareRequest(host, options, requestOptions){
	// @ts-ignore
	const url = new URL(`https://${host}/${getFrom(paths, host)}`);
	// if(http.includes(host)) url.protocol = 'http';

	if(!('headers' in requestOptions)) requestOptions.headers = {};
	if(!('User-Agent' in requestOptions.headers)){
		requestOptions.headers['User-Agent'] = `request by ${
			options.user || process.env.USERNAME || 'unknown'
		} with Node.js (${process.version}) module https://github.com/Fabricio-191/images`;
	}

	const params = getFrom(searchParams, host);

	const max = getFrom(maxLimits, host);
	if(max < options.limit){
		throw Error(`Limit exceeded, for "${host}" max limit is: ${max}`);
	}
	url.searchParams.set(params.limit, options.limit || max);

	if('page' in options){ // @ts-ignore
		url.searchParams.set(params.page, options.page - pageZero.includes(host));
	}

	if('query' in options){
		url.searchParams.set(params.query, options.query);
	}else if(host === 'derpibooru.org'){
		url.searchParams.set(params.query, 'image');
	}

	url.host = hosts[host] || host;

	return url;
};

/*
'furry.booru.org', (Cloudfare DDos protection)
'yukkuri.shii.org', (maintenance)
'behoimi.org', (unauthorized ?)
'gallery.burrowowl.net',
'shimmie2.xele.org',
'sheslostcontrol.net',
'taskforce.moe',
'zumki.ru',
'fanservice.fan',
'rule34yaoi.com',
'rule34hentai.net',
'giantessbooru.com',
'tentaclerape.net',
'wh40kart.im',
*/