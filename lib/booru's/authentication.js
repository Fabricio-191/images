const { getFrom } = require('../utils/utils.js');
const crypto = require('crypto');

const SHA1hash = str => crypto.createHash('sha1').update(str).digest('hex');

const authsParams = [
	{
		keys: [

		],
		value: {
			user: 'user_id',
			pass: 'api_key',
		},
	}, {
		keys: [

		],
		value: {
			user: 'login',
			pass: 'password_hash',
		},
	},
];

const passParam = {
	'gelbooru.com': '--Ñ--',
};

const auths = [ // To do:
	{
		keys: [],
		value(url, options){
			const params = getFrom(authsParams, url.host);

			url.searchParams.set(params.user, options.user);
			url.searchParams.set(params.pass, options.pass);
		},
	}, {
		keys: [],
		value(url, options, requestOptions){
			requestOptions.headers.Authorization = 'Basic ' + Buffer.from(
				options.user + ':' + options.pass
			).toString('base64');
		},
	}, {
		keys: [],
		value(url, options){
			const params = getFrom(authsParams, url.host);

			url.searchParams.set(params.user, options.user);

			const password = url.host in passParam ?
				passParam[url.host].replace('Ñ', SHA1hash(options.pass)) :
				SHA1hash(options.pass);

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