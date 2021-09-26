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

async function test(host, opts = {}){
	if(host === '') return;
	if(host){
		Object.assign(opts, credentials[host]);
		return Images(host, opts)
			.then(d => {
				console.log(d[0], d[0].raw);
				return d;
			})
			.catch(console.error);
	}else{
		const obj = {};
		for(const host of Images.allHosts){
			try{
				const res = await Images(host, credentials[host]);
				obj[host] = res[0];
				delete obj[host].raw;
				
				console.log(`${host.padEnd(30, ' ')} \x1B[32mOK\x1B[0m`);
			}catch(e){
				console.log(`${host.padEnd(30, ' ')} \x1B[31mNOT OK\x1B[0m ${e.message.trim()}`);
			}
		}
		save(obj);
	}
}

test('e621.net')

// https://danbooru.donmai.us/wiki_pages/help:cheatsheet
// https://rule34.xxx/index.php?page=help&topic=cheatsheet

// https://www.reddit.com/dev/api#GET_new
// https://github.com/reddit-archive/reddit/wiki/API