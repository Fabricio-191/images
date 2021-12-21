/* eslint-disable no-mixed-operators */
const { parseXML } = require('./utils');
const crypto = require('crypto');

const SHA1hash = str => crypto.createHash('sha1').update(str).digest('hex');

function getFrom(source, key){
	const pair = source.find(p => p.keys.includes(key));
	return pair ? pair.value : null;
}

exports.getFrom = getFrom;

// exports.http = [];
exports.maxLimits = [
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

exports.pageZero = [
	'gelbooru.com',
	'safebooru.org',
	'rule34.xxx',
	'xbooru.com',
	'tbib.org',
	'mspabooru.com',
];
exports.paths = [
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
exports.searchParams = [
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

const authsParams = [
	{
		keys: [

		],
		user: 'user_id',
		pass: 'api_key',
	}, {
		keys: [

		],
		user: 'login',
		pass: 'password_hash',
	},
];
const passParam = {
	'gelbooru.com': '--{p}--',
};
exports.auths = [ // To do:
	{
		keys: [],
		value(url, options){
			const params = getFrom(authsParams, url.host);

			url.searchParams.set(params.user, options.user);
			url.searchParams.set(params.pass, options.pass);
		},
	}, {
		keys: [],
		value(url, options, requestOptions){
			requestOptions.headers.Authorization = 'Basic ' + Buffer.from(
				options.user + ':' + options.pass
			).toString('base64');
		},
	}, {
		keys: [],
		value(url, options){
			const params = getFrom(authsParams, url.host);

			url.searchParams.set(params.user, options.user);

			if(url.host in passParam){
				url.searchParams.set(
					params.pass,
					passParam[url.host].replace(
						'{p}', SHA1hash(options.pass)
					)
				);
			}else{
				url.searchParams.set(params.pass, SHA1hash(options.pass));
			}
		},
	},
];

const postsPath = [
	{
		keys: [
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net',
		],
		value: 'post/view/',
	}, {
		keys: [
			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'lolibooru.moe',
			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'hypnohub.net',
		],
		value: 'post/show/',
	}, {
		keys: [
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com',
			'xbooru.com',
		],
		value: 'index.php?page=post&s=view&id=',
	}, {
		keys: ['booru.allthefallen.moe', 'e621.net', 'e926.net'],
		value: 'posts/',
	}, {
		keys: ['derpibooru.org'],
		value: 'images/',
	},
];
const imageParsers = [
	{
		keys: [
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net',
		],
		value(data, host){
			const d = {
				tags: data.tags.split(' '),
				file: {
					URL: data.file_url,
					width: Number(data.width),
					height: Number(data.height),
				},
				thumbnailURL: data.preview_url,
			};

			if(host !== 'rule34.paheal.net'){
				if(host === 'shimmie.shishnet.org'){
					d.file.URL = `https://${host}` + d.file.URL;
					d.thumbnailURL = `https://${host}` + d.thumbnailURL;
				}else{
					d.file.URL = `https://${host}` + d.file.URL.slice(1);
					d.thumbnailURL = `https://${host}` + d.thumbnailURL.slice(1);
				}
			}

			return d;
		},
	}, {
		keys: [
			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'booru.allthefallen.moe',
		],
		value(data){
			return {
				tags: (data.tag_string || data.tags).split(' '),
				// detailed tags
				file: {
					URL: data.file_url,
					width: data.image_width,
					height: data.image_height,
				},
				resized: {
					URL: data.large_file_url,
				},
				thumbnailURL: data.preview_file_url,
			};
		},
	}, {
		keys: [
			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'lolibooru.moe',
			'hypnohub.net',
			'rule34.xxx',
			'mspabooru.com',
		],
		value(data, host){
			const d = {
				tags: (data.tag_string || data.tags).split(' '),
				// detailed tags
				file: {
					URL: data.file_url || `https://${host}/images/${data.directory}/${data.image}`,
					width: data.width,
					height: data.height,
				},
				resized: {
					URL: data.sample_url || `https://${host}/samples/${data.directory}/sample_${data.image}`,
					width: data.sample_width,
					height: data.sample_height,
				},
				thumbnailURL: data.preview_url || `https://${host}/thumbnails/${data.directory}/thumbnail_${data.image}`,
			};

			if(!data.sample) delete d.resized;

			return d;
		},
	}, {
		keys: ['gelbooru.com', 'safebooru.org', 'xbooru.com', 'tbib.org'],
		value(data, host){
			const [hash] = data.image.split('.');
			const d = {
				tags: (data.tag_string || data.tags).split(' '),
				// detailed tags
				file: {
					URL: data.file_url || `https://${host}/images/${data.directory}/${data.image}`,
					width: data.width,
					height: data.height,
				},
				resized: {
					URL: data.sample_url || `https://${host}/samples/${data.directory}/sample_${hash}.jpg`,
					width: data.sample_width,
					height: data.sample_height,
				},
				thumbnailURL: data.preview_url || `https://${host}/thumbnails/${data.directory}/thumbnail_${hash}.jpg`,
			};

			if(!data.sample) delete d.resized;

			return d;
		},
	}, {
		keys: ['e621.net', 'e926.net'],
		value(data){
			return {
				tags: [].concat(...Object.values(data.tags)),
				// detailed tags
				file: {
					URL: data.file.url,
					width: data.file.width,
					height: data.file.width,
				},
				resized: {
					URL: data.sample.url,
					width: data.sample.width || null,
					height: data.sample.height || null,
				},
				thumbnailURL: data.preview.url,
			};
		},
	}, {
		keys: ['derpibooru.org'],
		value(data){
			return {
				tags: data.tags,
				file: {
					URL: data.representations.full,
					width: data.width,
					height: data.height,
				},
				resized: {
					URL: data.representations.medium,
				},
				thumbnailURL: data.representations.thumb,
			};
		},
	},
];
exports.parsers = [
	{
		keys: [
			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'hypnohub.net',
			'booru.allthefallen.moe',
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com',
			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'lolibooru.moe',
			'xbooru.com',
			'derpibooru.org',
			'e621.net',
			'e926.net',
		],
		value(body){
			if(body === '') return [];
			const data = JSON.parse(body);

			return data.images || data.posts || data;
		},
	}, {
		keys: [
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net',
		],
		value(body){
			const [data] = parseXML(body);
			if(data.attrs.count === '0') return [];

			return data.content.map(d => d.attrs);
		},
	},
];

exports.hosts = {
	'rule34.xxx': 'api.rule34.xxx',
};

const videosRegex = /\.(mp4|webm)\W?/;
const gifRegex = /\.(gif|gifv)\W?/;

function getType(img){
	if(gifRegex.test(img.file.URL)){
		return 'gif';
	}

	if(img.tags.includes('video') || videosRegex.test(img.file.URL)){
		return 'video';
	}

	return 'image';
}

const booruRatings = {
	e: 'explicit',
	q: 'questionable',
	s: 'safe',
	u: 'unknown',
	'?': 'unknown',
};
exports.parseImage = function(raw, host){
	const data = {
		URL: `https://${host}/${getFrom(postsPath, host)}${raw.id}`,
		rating: booruRatings[raw.rating] || raw.rating || 'unknown',
		...getFrom(imageParsers, host)(raw, host),
		raw,
	};

	data.type = getType(data);

	if(data.resized && data.file.URL === data.resized.URL){
		delete data.resized;
	}

	Object.defineProperty(data, 'raw', { enumerable: false });

	return data;
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