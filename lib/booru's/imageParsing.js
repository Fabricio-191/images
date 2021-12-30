/* eslint-disable no-extra-parens */
const { parseXML, getFrom } = require('../utils/utils');

const bodyParsers = [
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

const postsPaths = [
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
		keys: [
			'safebooru.donmai.us',
			'danbooru.donmai.us',
			'booru.allthefallen.moe',
			'e621.net',
			'e926.net',
		],
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

			if(host === 'rule34.paheal.net') return d;
			if(host === 'shimmie.shishnet.org'){
				d.file.URL = `https://${host}` + d.file.URL;
				d.thumbnailURL = `https://${host}` + d.thumbnailURL;
			}else{
				d.file.URL = `https://${host}` + d.file.URL.slice(1);
				d.thumbnailURL = `https://${host}` + d.thumbnailURL.slice(1);
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

const booruRatings = {
	e: 'explicit',
	q: 'questionable',
	s: 'safe',
	u: 'unknown',
	'?': 'unknown',
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

function parse(body, host){
	const parser = getFrom(imageParsers, host);
	const postsPath = getFrom(postsPaths, host);

	return getFrom(bodyParsers, host)(body)
		.filter(data => !( // pending or deleted images
			!data ||
			!data.id ||
			(data.file && data.file.url === null)
		))
		.map(raw => {
			const data = {
				URL: `https://${host}/${postsPath}${raw.id}`,
				rating: booruRatings[raw.rating] || raw.rating || 'unknown',
				...parser(raw, host),
				raw,
			};

			data.type = getType(data);

			if(data.resized && data.file.URL === data.resized.URL){
				delete data.resized;
			}

			Object.defineProperty(data, 'raw', { enumerable: false });

			return data;
		});
}

module.exports = parse;