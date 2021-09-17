/* eslint-disable */
const fs = require('fs');
const images = require('../lib');
const data = require('./data.json'), temp = require('./temp.json');

const save = d => fs.writeFileSync('./temp.json', JSON.stringify(d, null, '\t'));

/*
11 	 Gelbooru v0.2
10 	 danbooru
5 	 danbooru (old api)
1 	 philomena
1 	 szurubooru
5 	 undefined
1 	 g4?
1 	 Zerochain (=lainchan = vichan)
7 	 moebooru
28 	 Shimmie
1496 Gelbooru v0.1
*/

// @ts-ignore
const getHost = url => (new URL(url)).host;

// save(data.filter(x => x.System === 'Gelbooru v0.1').map(x => (new URL(x.URL)).host))

async function test(host, opts){
	if(host === '') return;
	if(host){
		images(host, opts)
			.then(console.log)
			.catch(console.error);
	}else{
		const imgs = {};
		for(const host of images.allHosts){
			try{
				const res = await images(host);
				console.log(`${host} \x1B[32mOK\x1B[0m`);
			}catch(e){
				console.log(`${host} \x1B[31mNOT OK\x1B[0m: ${e.message.trim()}`);
			}
		}
 
		// save(imgs);
	}
}

/*
furry.booru.org NOT OK: Forbidden (code: 403)
safebooru.org OK
tbib.org OK
rule34.xxx OK
mspabooru.com OK
gelbooru.com OK
danbooru.donmai.us OK
sonohara.donmai.us OK
hijiribe.donmai.us OK
safebooru.donmai.us OK
yukkuri.shii.org OK
hypnohub.net OK
booru.allthefallen.moe OK
behoimi.org NOT OK: connect ECONNREFUSED 204.74.214.38:443
chan.sankakucomplex.com NOT OK: Internal Server Error (code: 500)
idol.sankakucomplex.com NOT OK: Internal Server Error (code: 500)
e621.net NOT OK: Forbidden (code: 403)
e926.net NOT OK: Forbidden (code: 403)
konachan.com OK
konachan.net OK
yande.re OK
www.sakugabooru.com OK
img.genshiken-itb.org OK
lolibooru.moe OK
derpibooru.org NOT OK: Forbidden (code: 403)
*/

test('e621.net', { auth: ['bananagaming1245', 'Sr9RMsi4AVuzPnuCx2qCN8Gm'] });

// https://danbooru.donmai.us/wiki_pages/help:cheatsheet
// https://rule34.xxx/index.php?page=help&topic=cheatsheet

// https://www.reddit.com/dev/api#GET_new
// https://github.com/reddit-archive/reddit/wiki/API