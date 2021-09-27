// @ts-nocheck
/* eslint-disable */
const Images = require('../lib');

function save(data){
	require('fs').writeFileSync(
		require('path').join(__dirname, './temp.json'),
		JSON.stringify(data, null, '  ')
	);
}

const credentials = {
	'behoimi.org': { user: 'bananagaming1245', pass: 'GV3#-dTkGtJJD!k' },
	'e621.net': { user: 'bananagaming1245', pass: '8Eu5R4HF7qaTtANhewNXx73z' },
	'e926.net': { user: 'bananagaming1245', pass: '8Eu5R4HF7qaTtANhewNXx73z' }
};

function test(host, find = img => img, opts = {}){
	Object.assign(opts, credentials[host]);
	return Images(host, opts)
		.then(images => {
			const img = images.find(find);
			console.log(img.raw, img);

			return images;
		})
		.catch(console.error);
}

(async function(){
	const obj = {};

	for(const host of Images.allHosts){
		try{
			console.log(host);
			const [img] = await Images(host, credentials[host]);
			obj[host] = img;
		}catch(e){
			obj[host] = e.message;
		}
	}

	console.log('End');
	save(obj);
});

test('xbooru.com', img => img);
// https://danbooru.donmai.us/wiki_pages/help:cheatsheet
// https://rule34.xxx/index.php?page=help&topic=cheatsheet

// https://www.reddit.com/dev/api#GET_new
// https://github.com/reddit-archive/reddit/wiki/API

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
*/
