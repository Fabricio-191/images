const { fetch } = require('./modules/utils.js');
const sites = require('./modules/sites.js');

const booruRatings = {
	e: 'explicit',
	q: 'questionable',
	s: 'safe',
	'?': 'unknown',
};

const videoExtensions = ['mp4', 'webm'];
function normalizeImage(raw, host){
	const s = sites.http.includes(host) ? '' : 's';
	const path = sites.getFrom(sites.postsPath, host);

	const data = {
		URL: `http${s}://${host}/${path}${raw.id}`,
		tags: raw.tag_string || raw.tags.general || raw.tags,
		rating: booruRatings[raw.rating] || raw.rating,
		isVideo: false,
		file: {
			URL: raw.file_url,
			width: raw.image_width || raw.width || null,
			height: raw.image_height || raw.height || null,
		},
		resized: {
			URL: raw.large_file_url || raw.sample_url,
			width: raw.sample_width || null,
			height: raw.sample_height || null,
		},
		thumbnailURL: raw.preview_file_url || raw.preview_url || null,
		raw,
	};

	if(typeof data.tags === 'string'){
		data.tags = data.tags.trim().split(' ');
	}
	if(!data.resized.URL || data.resized.URL === data.file.URL){
		data.resized = data.file;
	}
	if(
		// eslint-disable-next-line no-mixed-operators
		data.tags.includes('video') || data.file.URL &&
		videoExtensions.some(e => data.file.URL.endsWith(e))
	) data.isVideo = true;

	Object.defineProperty(data, 'raw', { enumerable: false });

	return data;
}

function checkOptions(options, requestOptions, host){
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

const workingHosts = [
	'danbooru.donmai.us',
	'safebooru.donmai.us',
	'hypnohub.net',
	'booru.allthefallen.moe',
	'e621.net',
	'e926.net',
	'behoimi.org',
	'konachan.com',
	'konachan.net',
	'yande.re',
	'www.sakugabooru.com',
	'img.genshiken-itb.org',
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
	'derpibooru.org'
];

async function main(host, options = {}, requestOptions = {}){
	if(!workingHosts.includes(host)) throw new Error(host + ' is not a valid host');
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

	const body = await fetch(url, requestOptions);
	return sites.getFrom(sites.parsers, host)(body, host)
		.map(d => normalizeImage(d, host));
}

module.exports = main;
module.exports.allHosts = workingHosts;
module.exports.reddit = require('./modules/reddit.js');