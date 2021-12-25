const https = require('https'), http = require('http');
const entities = require('./entities.json');
const regexes = {
	attributes: /([^\s=]+)(?: {0,2}= {0,2}(?:(?<quote>'|")(.*?)\k<quote>|(\S+)))?/gs,
	elements: (function(){
		const element = '<[!/?]?([\\w:-]+)([^<>]*?)[/?]?>';

		return RegExp(`${element}|(.+?)(?=${element})`, 'gs');
	})(),
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

	while(i < matches.length){
		if(matches[i][1] === type){
			if(matches[i][0].startsWith('</')) counter--;
			else counter++;

			if(counter === 0) return i;
		}

		i++;
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

		const data = { tag: match[1] };
		if(match[2]) data.attrs = parseAttr(match[2]);

		const endIndex = findClosing(matches, data.tag, i);
		if(endIndex !== -1){
			if(endIndex !== i + 1){
				data.content = parseMatches(matches.slice(i + 1, endIndex), opts);
			}
			i = endIndex;
		}

		result.push(data);
	}

	return result;
}

function parseXML(string){
	const matches = matchAll(string, regexes.elements);
	if(matches.length === 0) return null;

	const last = matches[matches.length - 1];
	const end = string.slice(last.index + last[0].length);
	// @ts-ignore
	if(end !== '') matches.push([end]);

	return parseMatches(matches);
}

function fetch(url, options = {}){
	return new Promise((res, rej) => {
		// @ts-ignore
		url = new URL(url);

		(url.protocol === 'https:' ? https : http)
			.request(url, options, response => {
				const chunks = [];

				// const obj = { requestURL: url.toString(), body: Buffer.concat(chunks).toString() }; for(const key of ['httpVersion', 'url', 'method', 'statusCode', 'statusMessage', 'headers']){ obj[key] = response[key]; } console.log(obj); // eslint-disable-line no-console

				response
					.on('data', chunk => chunks.push(chunk))
					.once('end', () => {
						if(response.statusCode !== 200){
							rej(new Error(`${response.statusMessage} (code: ${response.statusCode})`));
						}

						res({ body: Buffer.concat(chunks).toString(), response });
					})
					.once('error', rej);
			})
			.once('error', rej)
			.end();
	});
}

function getFrom(source, key){
	const pair = source.find(p => p.keys.includes(key));
	return pair ? pair.value : null;
}

module.exports = { fetch, parseXML, decodeEntities, getFrom };