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
						if(response.statusCode !== 200){
							rej(new Error(`${response.statusMessage} (code: ${response.statusCode})`));
						}

						res({
							body: Buffer.concat(chunks).toString(),
							response,
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