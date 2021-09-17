const https = require('https'), http = require('http');

function fetch(url, options = {}){
	// @ts-ignore
	url = new URL(url);
	return new Promise((res, rej) => {
		(url.protocol === 'https:' ? https : http)
			.request(url, options, response => {
				showResponse(url, response);
				if(response.statusCode === 302 && response.headers.location){
					return fetch(response.headers.location + url.pathname + url.search, options)
						.then(res).catch(rej);
				}else if(response.statusCode !== 200){
					rej(new Error(`${response.statusMessage} (code: ${response.statusCode})`));
				}
				const chunks = [];

				response
					.on('data', chunk => chunks.push(chunk))
					.once('end', () => {
						res({
							headers: response.headers,
							body: Buffer.concat(chunks).toString(),
						});
					})
					.once('error', rej);
			})
			.once('error', rej)
			.end();
	});
}

// @ts-ignore
// eslint-disable-next-line no-unused-vars
function showResponse(url, response){
	// eslint-disable-next-line no-console
	console.log(url.toString());
	for(const key of [ 'req', '_readableState', 'socket', 'client', 'rawHeaders' ]){
		Object.defineProperty(response, key, { enumerable: false });
	}

	// eslint-disable-next-line no-console
	console.log({ ...response, headers: response.headers });
}

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
	if(typeof string !== 'string'){
		// 😬 🙄 🤯 😐 😑
		throw new Error(`'string' must be a string (🤯), recieved: ${typeof string}`);
	}

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

module.exports = { parseXML, fetch, decodeEntities };