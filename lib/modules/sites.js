/* eslint-disable no-mixed-operators */
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
			'mspabooru.com',
		],
		value: 1000,
	}, {
		hosts: [
			'e621.net',
			'e926.net',
		],
		value: 320,
	}, {
		hosts: [
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
		hosts: [
			'derpibooru.org',
		],
		value: 50,
	},
];

exports.paths = [
	{
		hosts: [
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com',
			'xbooru.com',
		],
		value: 'index.php?page=dapi&s=post&q=index&json=1',
	}, {
		hosts: [
			'danbooru.donmai.us',
			'safebooru.donmai.us',
			'booru.allthefallen.moe',
			'e621.net',
			'e926.net',
		],
		value: 'posts.json',
	}, {
		hosts: [
			'konachan.com',
			'konachan.net',
			'yande.re',
			'www.sakugabooru.com',
			'lolibooru.moe',
		],
		value: 'post.json',
	}, {
		hosts: [
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net',
		],
		value: 'api/danbooru/find_posts/index.xml',
	}, {
		hosts: [
			'derpibooru.org',
		],
		value: 'api/v1/json/search/images',
	}, {
		hosts: [
			'hypnohub.net',
		],
		value: 'post/index.json',
	},
];
exports.searchParams = [
	{
		hosts: [
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
		hosts: [
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
		hosts: [
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
		hosts: [

		],
		user: 'user_id',
		pass: 'api_key',
	}, {
		hosts: [

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
				if(passParam[url.host]){
					url.searchParams.set(
						params.pass,
						passParam[url.host].replace(
							'{p}', SHA1hash(options.pass)
						)
					);
				}else{
					url.searchParams.set(params.pass, SHA1hash(options.pass));
				}
			}
		},
	},
];

const booruRatings = {
	e: 'explicit',
	q: 'questionable',
	s: 'safe',
	u: 'unknown',
	'?': 'unknown',
};
const postsPath = [
	{
		hosts: [
			'shimmie.shishnet.org',
			'cascards.fluffyquack.com',
			'www.booru.realmofastra.ca',
			'rule34.paheal.net',
		],
		value: 'post/view/',
	}, {
		hosts: [
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
		hosts: [
			'gelbooru.com',
			'safebooru.org',
			'tbib.org',
			'rule34.xxx',
			'mspabooru.com',
			'xbooru.com',
		],
		value: 'index.php?page=post&s=view&id=',
	}, {
		hosts: ['booru.allthefallen.moe', 'e621.net', 'e926.net'],
		value: 'posts/',
	}, {
		hosts: ['derpibooru.org'],
		value: 'images/',
	},
];
const imageParsers = [
	{
		hosts: [
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
		hosts: [
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
		hosts: [
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
		hosts: ['gelbooru.com', 'safebooru.org', 'xbooru.com', 'tbib.org'],
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
		hosts: ['e621.net', 'e926.net'],
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
		hosts: ['derpibooru.org'],
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
		hosts: [
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
			const data = JSON.parse(body);

			return data.images || data.posts || data;
		},
	}, {
		hosts: [
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

exports.parseImage = function(raw, host){
	const data = {
		URL: `https://${host}/${getFrom(postsPath, host)}${raw.id}`,
		rating: booruRatings[raw.rating] || raw.rating || 'unknown',
		isVideo: false,
		...getFrom(imageParsers, host)(raw, host),
		raw,
	};

	if(
		data.tags.includes('video') ||
		data.file.URL && (
			data.file.URL.endsWith('mp4') ||
			data.file.URL.endsWith('webm')
		)
	) data.isVideo = true;

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