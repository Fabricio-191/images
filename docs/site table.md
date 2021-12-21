# Images properties by site

✔️ always  
❌ never  
⚪️ maybe

> This may contain errors

| hostname                                  | limit | URL | tags | rating | file | resized | thumbnailURL |
|-------------------------------------------|:-----:|:---:|:----:|:------:|:----:|:-------:|:------------:|
| [gelbooru.com](https://gelbooru.com)                            | 1000 | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [safebooru.donmai.us](https://safebooru.donmai.us)              | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [safebooru.org](https://safebooru.org)                          | 1000 | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [danbooru.donmai.us](https://danbooru.donmai.us)                | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [rule34.paheal.net](https://rule34.paheal.net)                  | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |
| [rule34.xxx](https://rule34.xxx)                                | 1000 | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [lolibooru.moe](https://lolibooru.moe)                          | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |
| [e621.net](https://e621.net)                                    | 320  | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [e926.net](https://e926.net)                                    | 320  | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [xbooru.com](https://xbooru.com)                                | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [derpibooru.org](https://derpibooru.org)                        | 50   | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| [tbib.org](https://tbib.org)                                    | 1000 | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [yande.re](https://yande.re)                                    | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |
| [hypnohub.net](https://hypnohub.net)                            | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |
| [konachan.com](https://konachan.com)                            | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |
| [konachan.net](https://konachan.net)                            | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |
| [mspabooru.com](https://mspabooru.com)                          | 1000 | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [www.sakugabooru.com](https://www.sakugabooru.com)              | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |
| [shimmie.shishnet.org](https://shimmie.shishnet.org)            | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |
| [booru.allthefallen.moe](https://booru.allthefallen.moe)        | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ✔️ |
| [cascards.fluffyquack.com](https://cascards.fluffyquack.com)    | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |
| [www.booru.realmofastra.ca](https://www.booru.realmofastra.ca)  | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |

<!--
/* eslint-disable no-extra-parens */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// @ts-nocheck
const Images = require('../lib');

const fs = require('fs');
const { maxLimits, getFrom } = require('../lib/modules/sites');

function check(results, prop){
	if(results.every(x => prop in x)){
		return ' ✔️ |';
	}

	if(results.some(x => prop in x)){
		return ' ⚪️ |';
	}

	return ' ❌ |';
}

function checkImgs(results, prop, prop2){
	const fn = x => (prop2 in x) ? (prop in x[prop2]) : false);

	if(results.every(fn){
		return ' ✔️ |';
	}

	if(results.some(fn)){
		return ' ⚪️ |';
	}

	return ' ❌ |';
}

const props = [ 'URL', 'tags', 'rating', 'file', 'resized', 'thumbnailURL' ];
const imgProps = [ 'URL', 'width', 'height' ];

(async function(){
	const max = Images.hosts.map(x => x).sort((a, b) => b.length - a.length)[0].length;
	const len = (max * 2) + 15;

	let str = '| hostname | limit | URL | tags | rating ' +
		'| file | file.URL | file.width | file.height ' + 
		'| resized | resized.URL | resized.width | resized.height ' +
		'| thumbnailURL |\n';

	for(const host of Images.hosts){
		str += `| [${host}](https://${host})`.padEnd(len) + ` | ${getFrom(maxLimits, host).toString().padEnd(4)} |`;

		const results = [];

		for(let i = 1; i < 2; i++){
			const temp = await Images(host, { page: i });

			if(temp.some(img => results.some(img2 => img.file.URL === img2.file.URL))){
				console.log('Duplicated image ' + host);
			}

			results.push(...temp);
		}

		for(const key of [ 'URL', 'tags', 'rating', 'file' ]){
			str += check(results, key);
		}
		for(const key of [ 'URL', 'width', 'height' ]){
			str += checkImgs(results, key, 'file');
		}
		str += check(results, 'resized');
		for(const key of [ 'URL', 'width', 'resized' ]){
			str += checkImgs(results, key, 'file');
		}

		str += check(results, 'thumbnailURL');

		str += '\n';
	}

	fs.writeFileSync('./test.md', `# Images properties by site

✔️ always  
❌ never  
⚪️ maybe
	
> This may contain errors

${str}

<!--
${fs.readFileSync('./test.js')}
--` + '>');
})();
-->
