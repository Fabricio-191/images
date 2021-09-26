const https = require('https'), http = require('http');
const entities = require('./entities.json');
const regexes = {
	attributes: (function(){
		const key = '([^\\s=]+)', equal = ' {0,2}= {0,2}';
		const value = '(?:(?<quote>\'|")(.*?)\\k<quote>|(\\S+))';

		return RegExp(`${key}(?:${equal}${value})?`, 'gs');
	})(),
	elements: (function(){
		const element = '<[!/?]?([\\w:-]+)([^<>]*?)[/?]?>';

		return RegExp(`${element}|(.+?)(?=${element})`, 'gs');
	})(),
	identation: /^[ \t]+/mg,
	newLines: /^\s*\n$/,
	whiteSpaces: /\s/,
	entities: RegExp(Object.keys(entities).join('|'), 'g'),
};

function fetch(url, options = {}){
	return new Promise((res, rej) => {
		// @ts-ignore
		url = new URL(url);

		(url.protocol === 'https:' ? https : http)
			.request(url, options, response => {
				const chunks = [];

				response
					.on('data', chunk => chunks.push(chunk))
					.once('end', () => {
						// showResponse(url, response, Buffer.concat(chunks).toString());
						/*
						if(response.statusCode === 302 && response.headers.location){
							return fetch(response.headers.location + url.pathname + url.search, options)
								.then(res).catch(rej);
						}else
						*/
						if(response.statusCode !== 200){
							rej(new Error(`${response.statusMessage} (code: ${response.statusCode})`));
						}

						res(Buffer.concat(chunks).toString());
					})
					.once('error', rej);
			})
			.once('error', rej)
			.end();
	});
}

// @ts-ignore
// eslint-disable-next-line no-unused-vars
function showResponse(url, response, body){
	const obj = {
		requestURL: url.toString(),
		body,
	};
	for(const key of ['httpVersion', 'url', 'method', 'statusCode', 'statusMessage', 'headers']){
		obj[key] = response[key];
	}
	// eslint-disable-next-line no-console
	console.log(obj);
}

function decodeEntities(str){
	const matches = str.match(regexes.entities);
	if(!matches) return str;

	return matches.reduce((acc, match) => acc.replace(match, entities[match]), str);
}

function matchAll(string, regex){
	const matches = [];

	// eslint-disable-next-line no-constant-condition
	while(true){
		const match = regex.exec(string);
		if(match === null) break;

		matches.push(match);
	}

	return matches;
}

function findClosing(matches, type, i){
	let counter = 0;
	for(;i < matches.length; i++){
		const match = matches[i];

		if(match[1] === type){
			if(match[0].startsWith('</')) counter--;
			else counter++;

			if(counter === 0) return i;
		}
	}

	return -1;
}

function parseAttr(str){
	const data = {}, matches = matchAll(str, regexes.attributes);

	for(const match of matches){
		data[
			decodeEntities(match[1])
		] = decodeEntities(match[3] || match[4] || '');
	}

	return data;
}

function parseMatches(matches, opts){
	const result = [];

	for(let i = 0; i < matches.length; i++){
		const match = matches[i];
		if(!match[1]){
			result.push(match[0]);
			continue;
		}

		const data = { type: 2, tag: match[1] };
		if(match[2]){ // Has attributes
			data.attrs = parseAttr(match[2]);
		}

		if(match[0].startsWith('</')){ // Closing element without opening element
			data.type = 3;
		}else if(match[0].endsWith('/>')){ // Self closing
			data.type = 4;
		}else{
			const endIndex = findClosing(matches, data.tag, i);
			if(endIndex !== -1){
				data.type = 1;
				if(endIndex !== i + 1){
					data.content = parseMatches(matches.slice(i + 1, endIndex), opts);
				}
				i = endIndex;
			}
		}

		result.push(data);
	}

	return result;
}

function parseXML(string){
	let matches = matchAll(string, regexes.elements);
	if(matches.length === 0) return null;

	const last = matches[matches.length - 1];
	const end = string.slice(last.index + last[0].length);
	// @ts-ignore
	if(end !== '') matches.push([end]);

	// eslint-disable-next-line no-extra-parens
	matches = matches.map(match => match.map(str => (str ? str.replace(regexes.identation, '') : null)));
	matches = matches.filter(match => match[0].match(regexes.newLines) === null);

	return parseMatches(matches);
}

module.exports = { fetch, parseXML, decodeEntities };

/*
https://furry.booru.org/index.php?page=help&topic=dapi
https://rule34.xxx/index.php?page=help&topic=dapi
https://gelbooru.com/index.php?page=wiki&s=view&id=18780 (auth)
https://danbooru.donmai.us/wiki_pages/help:api (auth)
http://behoimi.org/post/index.xml
https://chan.sankakucomplex.com/wiki/show?title=help%3Aapi
https://e621.net/help/api
https://derpibooru.org/pages/api
https://konachan.com/help/api
https://yande.re/help/api
https://lolibooru.moe/help/api
https://github.com/danbooru/danbooru/blob/master/doc/api.txt
https://github.com/rr-/szurubooru/blob/master/doc/API.md

Most of boorus runs different versions of Gelbooru
Gelbooru Beta 0.1.11 has not any api
Gelbooru is a modified version of Danbooru
e621.net is another modified version of Danbooru

https://github.com/AtoraSuunva/booru/blob/master/src/sites.json
https://booru.org/top


{
	'e621.net': {
		api: {
			search: '/posts.json?',
			postView: '/post/show/',
		},
		random: true,
	},

	'hypnohub.net': {
		api: {
			search: '/post/index.json?',
			postView: '/post/show/',
		},
		random: true,
	},
	'danbooru.donmai.us': {
		api: {
			search: '/posts.json?',
			postView: '/posts/',
		},
		random: true,
	},

	'konachan.com': {
		api: {
			search: '/post.json?',
			postView: '/post/show/',
		},
		random: true,
	},
	'konachan.net': {
		api: {
			search: '/post.json?',
			postView: '/post/show/',
		},
		random: true,
	},

	'yande.re': {
		api: {
			search: '/post.json?',
			postView: '/post/show/',
		},
		random: true,
	},
	'gelbooru.com': {
		api: {
			search: '/index.php?page=dapi&s=post&q=index&json=1&',
			postView: '/index.php?page=post&s=view&json=1&id=',
		},
		paginate: 'pid',
		random: false,
	},
	'rule34.xxx': {
		api: {
			search: '/index.php?page=dapi&s=post&q=index&json=1&',
			postView: '/index.php?page=post&s=view&json=1&id=',
		},
		paginate: 'pid',
		random: false,
	},
	'safebooru.org': {
		api: {
			search: '/index.php?page=dapi&s=post&q=index&json=1&',
			postView: '/index.php?page=post&s=view&json=1&id=',
		},
		paginate: 'pid',
		random: false,
	},
	'tbib.org': {
		api: {
			search: '/index.php?page=dapi&s=post&q=index&json=1&',
			postView: '/index.php?page=post&s=view&json=1&id=',
		},
		paginate: 'pid',
		random: false,
	},
	'xbooru.com': {
		api: {
			search: '/index.php?page=dapi&s=post&q=index&json=1&',
			postView: '/index.php?page=post&s=view&json=1&id=',
		},
		paginate: 'pid',
		random: false,
	},
	'rule34.paheal.net': {
		type: 'xml',
		api: {
			search: '/api/danbooru/find_posts/index.xml?',
			postView: '/post/view/',
		},
		random: false,
	},
	'derpibooru.org': {
		type: 'derpi',
		api: {
			search: '/api/v1/json/search/images?',
			postView: '/images/',
		},
		tagQuery: 'q',
		random: 'sf=random',
	},
	'realbooru.com': {
		api: {
			search: '/index.php?page=dapi&s=post&q=index&json=1&',
			postView: '/index.php?page=post&s=view&id=',
		},
		paginate: 'pid',
		random: false,
	},
};
*/
