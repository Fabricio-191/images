// const utils = require('./utils.js');

/*
https://furry.booru.org/index.php?page=help&topic=dapi
https://rule34.xxx/index.php?page=help&topic=dapi
https://gelbooru.com/index.php?page=wiki&s=view&id=18780 (auth)
https://danbooru.donmai.us/wiki_pages/help:api (auth)
http://behoimi.org/post/index.xml
https://chan.sankakucomplex.com/wiki/show?title=help%3Aapi
https://e621.net/help/api (user agent)
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

function basicHttpAuth(headers, user, pass){
	headers.Authorization = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');
}

module.exports = {
	'Gelbooru Beta 0.2': {
		makePath(host, opts){
			if(opts.limit > 1000) throw new Error('');
			// &deleted=show
			return assignParams('index.php?page=dapi&s=post&q=index&json=1', {
				tags: opts.query,
				limit: opts.limit,
				pid: opts.page,
			});
		},
	},
	'Gelbooru Beta 0.2.5': {
		handleAuth(headers, auth){
			if(!auth[0] || !auth[1]){
				throw new Error('Invalid auth');
			}
			basicHttpAuth(headers, ...auth);
			if(!headers['User-Agent']){
				headers['User-Agent'] = `by ${auth[0]}`;
			}
		},
		makePath(host, opts){
			if(opts.limit > 1000) throw new Error('');
			const params = {
				tags: opts.query,
				limit: opts.limit,
				pid: opts.page,
			};
			// &deleted=show
			if(opts.auth){
				params.user_id = opts.auth.user;
				params.api_key = opts.auth.key;
			}

			return assignParams('index.php?page=dapi&s=post&q=index', params);
		},
	},
	Danbooru: {
		makePath(host, opts){
			if(opts.limit > 100) throw new Error('');

			return assignParams('posts.json?', {
				limit: opts.limit,
				page: opts.page,
				tags: opts.query,
			});
		},
	},
	'Danbooru (old api)': {
		handleAuth(headers, auth){
			if(!auth[0] || !auth[1]){
				throw new Error('Invalid auth');
			}
			basicHttpAuth(headers, ...auth);
			if(!headers['User-Agent']){
				headers['User-Agent'] = `by ${auth[0]}`;
			}
		},
		makePath(host, opts){
			const path = {
				'behoimi.org': 'post/index.xml?',
			}[host];

			return assignParams(path || 'posts.json?', opts);
		},
	},
	philomena: {
		makePath(host, opts){
			return assignParams('api/v1/json/search/images?', {
				q: opts.query || 'image',
			});
		},
	},
	moebooru: {
		makePath(host, opts){
			return assignParams('post.json?', opts);
		},
	},
};

function assignParams(url, opts){
	// eslint-disable-next-line guard-for-in
	for(const key in opts){
		if(key === 'auth') continue;
		url += `&${key}=${opts[key]}`;
	}
	return url;
}

/*
{
  "e621.net": {
    "domain": "e621.net",
    "aliases": [
      "e6",
      "e621"
    ],
    "nsfw": true,
    "api": {
      "search": "/posts.json?",
      "postView": "/post/show/"
    },
    "random": true
  },
  "e926.net": {
    "domain": "e926.net",
    "aliases": [
      "e9",
      "e926"
    ],
    "nsfw": false,
    "api": {
      "search": "/posts.json?",
      "postView": "/post/show/"
    },
    "random": true,
    "defaultTags": ["rating:safe"]
  },
  "hypnohub.net": {
    "domain": "hypnohub.net",
    "aliases": [
      "hh",
      "hypno",
      "hypnohub"
    ],
    "nsfw": true,
    "api": {
      "search": "/post/index.json?",
      "postView": "/post/show/"
    },
    "random": true
  },
  "danbooru.donmai.us": {
    "domain": "danbooru.donmai.us",
    "aliases": [
      "db",
      "dan",
      "danbooru"
    ],
    "nsfw": true,
    "api": {
      "search": "/posts.json?",
      "postView": "/posts/"
    },
    "random": true
  },
  "konachan.com": {
    "domain": "konachan.com",
    "aliases": [
      "kc",
      "konac",
      "kcom"
    ],
    "nsfw": true,
    "api": {
      "search": "/post.json?",
      "postView": "/post/show/"
    },
    "random": true
  },
  "konachan.net": {
    "domain": "konachan.net",
    "aliases": [
      "kn",
      "konan",
      "knet"
    ],
    "nsfw": false,
    "api": {
      "search": "/post.json?",
      "postView": "/post/show/"
    },
    "random": true
  },
  "yande.re": {
    "domain": "yande.re",
    "aliases": [
      "yd",
      "yand",
      "yandere"
    ],
    "nsfw": true,
    "api": {
      "search": "/post.json?",
      "postView": "/post/show/"
    },
    "random": true
  },
  "gelbooru.com": {
    "domain": "gelbooru.com",
    "aliases": [
      "gb",
      "gel",
      "gelbooru"
    ],
    "nsfw": true,
    "api": {
      "search": "/index.php?page=dapi&s=post&q=index&json=1&",
      "postView": "/index.php?page=post&s=view&json=1&id="
    },
    "paginate": "pid",
    "random": false
  },
  "rule34.xxx": {
    "domain": "rule34.xxx",
    "aliases": [
      "r34",
      "rule34"
    ],
    "nsfw": true,
    "api": {
      "search": "/index.php?page=dapi&s=post&q=index&json=1&",
      "postView": "/index.php?page=post&s=view&json=1&id="
    },
    "paginate": "pid",
    "random": false
  },
  "safebooru.org": {
    "domain": "safebooru.org",
    "aliases": [
      "sb",
      "safe",
      "safebooru"
    ],
    "nsfw": false,
    "api": {
      "search": "/index.php?page=dapi&s=post&q=index&json=1&",
      "postView": "/index.php?page=post&s=view&json=1&id="
    },
    "paginate": "pid",
    "random": false
  },
  "tbib.org": {
    "domain": "tbib.org",
    "aliases": [
      "tb",
      "tbib",
      "big"
    ],
    "nsfw": false,
    "api": {
      "search": "/index.php?page=dapi&s=post&q=index&json=1&",
      "postView": "/index.php?page=post&s=view&json=1&id="
    },
    "paginate": "pid",
    "random": false
  },
  "xbooru.com": {
    "domain": "xbooru.com",
    "aliases": [
      "xb",
      "xbooru"
    ],
    "nsfw": true,
    "api": {
      "search": "/index.php?page=dapi&s=post&q=index&json=1&",
      "postView": "/index.php?page=post&s=view&json=1&id="
    },
    "paginate": "pid",
    "random": false
  },
  "rule34.paheal.net": {
    "domain": "rule34.paheal.net",
    "type": "xml",
    "aliases": [
      "pa",
      "paheal"
    ],
    "nsfw": true,
    "api": {
      "search": "/api/danbooru/find_posts/index.xml?",
      "postView": "/post/view/"
    },
    "random": false
  },
  "derpibooru.org": {
    "domain": "derpibooru.org",
    "type": "derpi",
    "aliases": [
      "dp",
      "derp",
      "derpi",
      "derpibooru"
    ],
    "nsfw": true,
    "api": {
      "search": "/api/v1/json/search/images?",
      "postView": "/images/"
    },
    "tagQuery": "q",
    "random": "sf=random"
  },
  "realbooru.com": {
    "domain": "realbooru.com",
    "aliases": [
      "rb",
      "realbooru"
    ],
    "nsfw": true,
    "api": {
      "search": "/index.php?page=dapi&s=post&q=index&json=1&",
      "postView": "/index.php?page=post&s=view&id="
    },
    "paginate": "pid",
    "random": false
  }
}
*/

/*
const booruRatings = {
	e: 'explicit',
	q: 'questionable',
	s: 'safe',
};

function parseImage1(raw, host){
	const extension = raw.file_ext || raw.file_url.split('.').pop();

	const data = {
		URL: raw.file_url,
		postURL: `https://${host}/index.php?page=post&s=view&id=${raw.id}`,
		height: Number(raw.height),
		width: Number(raw.width),
		isVideo: extension === 'mp4' || extension === 'webm',
		// jpeg jpg gif png
		rating: booruRatings[raw.rating],
		preview: {
			URL: raw.preview_url,
			height: Number(raw.preview_height),
			width: Number(raw.preview_width),
		},
		tags: raw.tags.trim().split(' '),
	};

	Object.defineProperty(data, 'raw', { enumerable: false, value: raw });

	if(raw.sample_height !== 0 && raw.sample_url !== raw.file_url){
		data.sample = {
			URL: raw.sample_url,
			height: Number(raw.sample_height),
			width: Number(raw.sample_width),
		};
	}

	return data;
}

function parseImage2(raw, host){
	const extension = raw.file_ext || raw.file_url.split('.').pop();

	const data = {
		URL: raw.file_url,
		postURL: `https://${host}/index.php?page=post&s=view&id=${raw.id}`,
		createdAt: new Date(raw.created_at),
		height: raw.image_height,
		width: raw.image_width,
		isVideo: extension === 'mp4' || extension === 'webm',
		rating: booruRatings[raw.rating],
		previewURL: raw.preview_file_url,
		resizedURL: raw.large_file_url,
		tags: {
			general: raw.tag_string_general.split(' '),
			character: raw.tag_string_character.split(' '),
			copyright: raw.tag_string_copyright.split(' '),
			artist: raw.tag_string_artist.split(' '),
			meta: raw.tag_string_meta.split(' '),
			all: raw.tag_string.split(' '),
		},
	};

	Object.defineProperty(data, 'raw', { enumerable: false, value: raw });

	return data;
}
*/