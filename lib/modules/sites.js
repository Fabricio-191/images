const { parseXML } = require('./utils');
const crypto = require('crypto');

const SHA1hash = str => crypto.createHash('sha1').update(str).digest('hex');

function getFrom(source, host){
	const pair = source.find(p => p.hosts.includes(host));
	return pair ? pair.value : null;
}

exports.getFrom = getFrom;

exports.http = [];
exports.maxLimits = [
	{
		hosts: [
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com'
			// 'furry.booru.org', (Cloudfare DDos protection)
		],
		value: 1000,
	}, {
		hosts: [
			'e621.net',
			'e926.net'
		],
		value: 320,
	}, {
		hosts: [
			/*
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
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net',

			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'img.genshiken-itb.org',
			'lolibooru.moe',

			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'hypnohub.net',
			'booru.allthefallen.moe',
			'behoimi.org'
			// 'yukkuri.shii.org', (maintenance)
		],
		value: 100,
	}, {
		hosts: [
			'derpibooru.org'
		],
		value: 50,
	}
];

exports.paths = [
	{
		hosts: [
			'hypnohub.net',
			'behoimi.org'
		],
		value: 'post/index.json',
	}, {
		hosts: [
			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'booru.allthefallen.moe',
			'e621.net',
			'e926.net'
			// 'yukkuri.shii.org', (maintenance)
		],
		value: 'posts.json',
	}, {
		hosts: [
			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'img.genshiken-itb.org',
			'lolibooru.moe'
		],
		value: 'post.json',
	}, {
		hosts: [
			/*
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
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net'
		],
		value: 'api/danbooru/find_posts/index.xml',
	}, {
		hosts: [
			'derpibooru.org'
		],
		value: 'api/v1/json/search/images',
	}, {
		hosts: [
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com'
			// 'furry.booru.org', (Cloudfare DDos protection)
		],
		value: 'index.php?page=dapi&s=post&q=index&json=1',
	}
];
exports.searchParams = [
	{
		hosts: [
			// Danbooru
			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'hypnohub.net',
			'booru.allthefallen.moe',
			'e621.net',
			'e926.net',
			'behoimi.org',
			// 'yukkuri.shii.org', (maintenance)

			// Moebooru
			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'img.genshiken-itb.org',
			'lolibooru.moe',

			// Shimmie
			/*
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
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net'
		],
		value: {
			query: 'tags',
			limit: 'limit',
			page: 'page',
		},
	}, {
		hosts: [
			// Gelbooru
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com'
			// 'furry.booru.org', (Cloudfare DDos protection)
		],
		value: {
			query: 'tags',
			limit: 'limit',
			page: 'pid',
		},
	}, {
		hosts: [
			// Philomena
			'derpibooru.org'
		],
		value: {
			query: 'q',
			page: 'page',
			limit: 'per_page',
		},
	}
];

const authsParams = [
	{
		hosts: [
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com'
			// 'furry.booru.org', (Cloudfare DDos protection)
		],
		value: {
			user: 'user_id',
			pass: 'api_key',
		},
	}, {
		hosts: [

		],
		value: {
			user: 'login',
			pass: 'password_hash',
		},
	}
];
exports.auths = [
	{
		hosts: [],
		value(url, requestOptions, options){
			if('user' in options && 'pass' in options){
				const params = getFrom(authsParams, url.host);

				url.searchParams.set(params.user, options.user);
				url.searchParams.set(params.pass, options.pass);
			}
		},
	}, {
		hosts: [],
		value(url, requestOptions, options){
			if('user' in options && 'pass' in options){
				requestOptions.headers.Authorization = 'Basic ' + Buffer.from(
					options.user + ':' + options.pass
				).toString('base64');
			}
		},
	}, {
		hosts: [],
		value(url, requestOptions, options){
			if('user' in options && 'pass' in options){
				const params = getFrom(authsParams, url.host);

				url.searchParams.set(params.user, options.user);
				url.searchParams.set(params.pass, SHA1hash(options.pass));
			}
		},
	}
];

exports.parsers = [
	{
		hosts: [
			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'hypnohub.net',
			'booru.allthefallen.moe',
			'behoimi.org',
			// 'yukkuri.shii.org', (maintenance)
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com',
			// 'furry.booru.org', (Cloudfare DDos protection)
			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'img.genshiken-itb.org',
			'lolibooru.moe'
		],
		value(body){
			return JSON.parse(body);
		},
	}, {
		hosts: [
			'derpibooru.org',
			'e621.net',
			'e926.net'
		],
		value(body){
			const data = JSON.parse(body);

			return data.images || data.posts;
		},
	}, {
		hosts: [
			/*
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
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net'],
		value(body){
			const [data] = parseXML(body);
			if(data.attrs.count === '0') return [];

			return data.content.map(d => d.attrs);
		},
	}
];
exports.postsPath = [
	{
		hosts: [
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net'
		],
		value: 'post/view/',
	}, {
		hosts: [
			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'img.genshiken-itb.org',
			'lolibooru.moe',
			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'hypnohub.net',
			'behoimi.org'
		],
		value: 'post/show/',
	}, {
		hosts: [
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com'
		],
		value: 'index.php?page=post&s=view&id=',
	}, {
		hosts: ['booru.allthefallen.moe', 'e621.net', 'e926.net'],
		value: 'posts/',
	}, {
		hosts: ['derpibooru.org'],
		value: 'images/',
	}
];


/*
'furry.booru.org', (Cloudfare DDos protection)
'yukkuri.shii.org', (maintenance)
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