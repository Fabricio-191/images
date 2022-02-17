const { getFrom } = require('../utils/utils.js');
const crypto = require('crypto');

const SHA1hash = str => crypto.createHash('sha1').update(str).digest('hex');

const passParam = {
	'lolibooru.moe': '--your-password--',
	'hypnohub.net': '--your-password--',
	'yande.re': 'choujin-steiner--your-password--',
	'konachan.com': 'So-I-Heard-You-Like-Mupkids-?--your-password--',
	'konachan.net': 'So-I-Heard-You-Like-Mupkids-?--your-password--',
	'www.sakugabooru.com': 'er@!$rjiajd0$!dkaopc350!Y%)--your-password--',
};

const authsParams = [
	{
		keys: [
			'gelbooru.com',
		],
		value: {
			user: 'user_id',
			pass: 'api_key',
		},
	}, {
		keys: Object.keys(passParam),
		value: {
			user: 'login',
			pass: 'password_hash',
		},
	},
];

const auths = [
	{
		keys: [
			'gelbooru.com',
		],
		value(url, { user, pass }){
			const params = getFrom(authsParams, url.host);

			url.searchParams.set(params.user, user);
			url.searchParams.set(params.pass, pass);
		},
	}, {
		keys: [
			'safebooru.donmai.us',
			'danbooru.donmai.us',
			'e621.net',
			'e926.net',
		],
		value(url, { user, pass }, requestOptions){
			requestOptions.headers.Authorization = 'Basic ' +
				Buffer.from(user + ':' + pass).toString('base64');
		},
	}, {
		keys: [
			'lolibooru.moe',
			'hypnohub.net',
			'yande.re',
			'konachan.com',
			'konachan.net',
			'www.sakugabooru.com',
		],
		value(url, { user, pass }){
			const params = getFrom(authsParams, url.host);

			url.searchParams.set(params.user, user);

			const password = SHA1hash(
				url.host in passParam ?
					passParam[url.host].replace('your-password', pass) :
					pass
			);

			url.searchParams.set(params.pass, password);
		},
	},
];

module.exports = function(host, url, options, requestOptions){
	if('user' in options && 'pass' in options){
		const auth = getFrom(auths, host);
		if(auth !== null) auth(url, options, requestOptions);
	}
};