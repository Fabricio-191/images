/* eslint-disable no-extra-parens */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// @ts-nocheck
const Images = require('../lib');

(async function(){
	const reddits = [
		'food',
		'wallpapers',
		'memes',
		'pics',
		'funny',
		'gaming',
		'anime',
		'art',
		'movies',
		'mealtimevideos',
		'videos',
		'dankvideos',
		'gifs',
		'gif',
		'reactiongifs',
	];
	const results = [].concat(
		...await Promise.all(
			reddits.map(r => Images.reddit.getFromSubreddit(r))
		)
	);
	require('fs').writeFileSync(
		require('path').join(__dirname, './temp.json'),
		JSON.stringify(classify(results.map(Image)), null, '  ')
	);
})();

const keys = [
	'link_flair_template_id',
	'link_flair_text',
	'approved_at_utc',
	'author_fullname',
	'saved',
	'gilded',
	'clicked',
	'link_flair_richtext',
	'subreddit_name_prefixed',
	'hidden',
	'pwls',
	'link_flair_css_class',
	'downs',
	'top_awarded_type',
	'hide_score',
	'link_flair_text_color',
	'upvote_ratio',
	'author_flair_background_color',
	'ups',
	'total_awards_received',
	'author_flair_template_id',
	'is_original_content',
	'user_reports',
	'can_mod_post',
	'score',
	'is_created_from_ads_ui',
	'author_premium',
	'edited',
	'author_flair_css_class',
	'author_flair_richtext',
	'gildings',
	'mod_note',
	'link_flair_type',
	'wls',
	'author_flair_type',
	'allow_live_comments',
	'likes',
	'suggested_sort',
	'banned_at_utc',
	'view_count',
	'archived',
	'no_follow',
	'is_crosspostable',
	'pinned',
	'all_awardings',
	'awarders',
	'can_gild',
	'spoiler',
	'locked',
	'author_flair_text',
	'visited',
	'num_reports',
	'distinguished',
	'subreddit_id',
	'author_is_blocked',
	'link_flair_background_color',
	'id',
	'is_robot_indexable',
	'report_reasons',
	'author',
	'discussion_type',
	'num_comments',
	'send_replies',
	'whitelist_status',
	'contest_mode',
	'author_patreon_flair',
	'author_flair_text_color',
	'parent_whitelist_status',
	'stickied',
	'num_crossposts',
	'quarantine',
	'approved_by',
	'created',
	'removed_by_category',
	'banned_by',
	'over_18',
	'subreddit_subscribers',
	'mod_reason_title',
	'removed_by',
	'mod_reason_by',
	'removal_reason',
	'mod_reports',
	'crosspost_parent',
	'crosspost_parent_list',
	'selftext_html',
	'subreddit_type',
	'gallery_data',
	'author_cakeday',
	// 'link_flair_text',
	// 'is_self',
	// 'url_overridden_by_dest',
	// 'treatment_tags',
	// 'subreddit',
	// 'selftext',
	// 'title',
	// 'name',
	// 'is_meta',
	// 'category',
	// 'post_hint',
	// 'content_categories',
	// 'domain',
	// 'preview',
	// 'permalink',
	// 'url',
	// 'created_utc',
	// 'media_only',
	// 'media_embed',
	// 'secure_media',
	// 'is_reddit_media_domain',
	// 'secure_media_embed',
	// 'media',
	// 'is_video',
	// 'thumbnail',
	// 'thumbnail_height',
	// 'thumbnail_width',
];
function Image(data){
	for(const key of keys){
		delete data[key];
	}
	const obj = {};
	const keys2 = Object.keys(data).sort();
	for(const key of keys2){
		obj[key] = data[key];
	}
	return obj;
}
function classify(images){
	const data = require('./temp.json');
	Object.values(data).forEach(data => {
		data.forEach(x => {
			x.keys = JSON.stringify(
				Object.keys(x.first).sort()
			);
		});
	});
	const d = images.reduce((acc, image) => {
		const hint = image.post_hint;
		if(!acc[hint]) acc[hint] = [];
		const keys = JSON.stringify(Object.keys(image).sort());
		const result = acc[hint].find(x => x.keys === keys);
		if(result){
			if(result.more.length < 100){
				result.more.push(image);
			}
		}else acc[hint].push({
			first: image,
			more: [],
			keys,
		});
		return acc;
	}, data);
	Object.values(d).forEach(data => {
		data.forEach(x => {
			delete x.keys;
		});
	});
	return d;
}
