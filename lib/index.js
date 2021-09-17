const hosts = Object.entries(require('./modules/hosts.json'));
const sites = require('./modules/sites.js');
const { fetch } = require('./modules/utils.js');

/*
const regex = /^<(!DOCTYPE )?html/i;
function type(text){
	text = text.trim();
	const [f] = text;

	if(f === '{' || f === '['){
		return 'JSON';
	}else if(f === '<'){
		return text.match(regex) ? 'HTML' : 'XML';
	}
	return null;
}
*/

// query, page, limit, after, before, auth, request
function parseOptions(options = {}){
	if(typeof options !== 'object'){
		throw new Error('"options" must be an object');
	}else if(options.query && typeof options.query !== 'string'){
		throw new Error('"query" must be a string');
	}else if(options.page && typeof options.page !== 'number'){
		throw new Error('"page" must be a number');
	}else if(options.limit && typeof options.limit !== 'number'){
		throw new Error('"limit" must be a number');
	}else if(options.after && typeof options.after !== 'number'){
		throw new Error('"after" must be a number');
	}else if(options.before && typeof options.before !== 'number'){
		throw new Error('"before" must be a number');
	}
	if(options.auth && (
		!Array.isArray(options.auth) || options.auth.length === 0
	)){
		throw new Error('"auth" must be an array');
	}
	return options;
}

const findSite = host => {
	const a = hosts.find(x => x[1].includes(host));
	if(!a) throw new Error(`'${host}' is not a supported or is not a valid booru`);

	return sites[a[0]];
};

/**
 * @param {{
 * 	query?: string,
 * 	page?: number,
 *  limit?: number,
 *  auth?: { password?: string, user?: string },
 * 	after?: number,
 * 	before?: number,
 *  request?: any,
 * }} [options]
 */
module.exports = async function getFrom(host, options){
	options = parseOptions(options);
	const opts = options.request || {}, site = findSite(host);

	if(options.auth && site.handleAuth){
		if(!opts.headers) opts.headers = {};
		site.handleAuth(opts, options);
	}

	const response = await fetch(`https://${host}/${site.makePath(host, options)}`, opts);

	return site.parse(response.body);
};
module.exports.reddit = require('./modules/reddit.js');
module.exports.allHosts = [].concat(...hosts.map(s => s[1]));