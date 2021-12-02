![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?color=white&style=for-the-badge)

> If you have any error you can contact me on [Discord](https://discord.gg/zrESMn6)

A module to get images from some booru's and reddit

## Use example

```js
const Images = require('@fabricio-191/images');

Images('safebooru.org', { query: 'aiz_wallenstein' })
	.then(images => {
		console.log(images[0]);
	})
	.catch(console.error);
	
Images.reddit.getFromSubreddit('memes')
	.then(images => {
		console.log(images[0]);
	})
	.catch(console.error);
```

<details>
<summary>Valid hosts</summary>
</br>

* danbooru.donmai.us
* safebooru.donmai.us
* safebooru.org
* gelbooru.com
* e621.net
* e926.net
* rule34.xxx
* lolibooru.moe
* rule34.paheal.net
* hypnohub.net
* booru.allthefallen.moe
* tbib.org
* mspabooru.com
* konachan.com
* konachan.net
* yande.re
* www.sakugabooru.com
* img.genshiken-itb.org
* derpibooru.org
* shimmie.shishnet.org
* cascards.fluffyquack.com
* www.booru.realmofastra.ca

</br>
</details>
</br>

## Image example

```js
{
  URL: 'https://safebooru.org/index.php?page=post&s=view&id=3534899',
  rating: 'safe',
  isVideo: false,
  tags: [
    '1girl',
    'absurdres',
    'aiz_wallenstein',
    'blonde_hair',
    'blush',
    'bodysuit',
    'breasts',
    'covered_navel',
    'dungeon_ni_deai_wo_motomeru_no_wa_machigatteiru_darou_ka',  
    'eating',
    'eyebrows_visible_through_hair',
    'food',
    'from_side',
    'gloves',
    'hair_between_eyes',
    'hairband',
    'highres',
    'holding',
    'long_hair',
    'looking_afar',
    'looking_away',
    'medium_breasts',
    'mizuiro_sanshou',
    'open_mouth',
    'profile',
    'shiny',
    'shiny_clothes',
    'shiny_hair',
    'sidelocks',
    'simple_background',
    'solo',
    'upper_body',
    'white_background',
    'yellow_eyes'
  ],
  file: {
    URL: 'https://safebooru.org/images/3398/4a8ea78b192d93f16c5a184abd82e33a9d909219.jpg',
    width: 3200,
    height: 4500
  },
  resized: {
    URL: 'https://safebooru.org/samples/3398/sample_4a8ea78b192d93f16c5a184abd82e33a9d909219.jpg',
    width: 850,
    height: 1195
  },
  thumbnailURL: 'https://safebooru.org/thumbnails/3398/thumbnail_4a8ea78b192d93f16c5a184abd82e33a9d909219.jpg'
}
```

#### Reddit examples

```js
{
  URL: 'https://www.reddit.com/r/memes/comments/pu8z3e/well_its_a_little_over_4000_now/',
  title: 'Well it’s a little over 4000 now',
  fileURL: 'https://i.redd.it/zoh85wraocp71.jpg',
  domain: 'i.redd.it',
  thumbnail: {
    URL: 'https://b.thumbs.redditmedia.com/5IB2j9QQ049_meZS8cKYYRHoOj3JKwOA3hgk7E44dUM.jpg',
    height: 140,
    width: 140
  }
}
```

```js
{
  URL: 'https://www.reddit.com/r/memes/comments/pu8nlu/gonna_sniff_these_coke/',  
  title: 'gonna sniff these coke',
  fileURL: 'https://v.redd.it/hifa8frikcp71',
  domain: 'v.redd.it',
  thumbnail: {
    URL: 'https://b.thumbs.redditmedia.com/CvMcpslLvbCIJa_xsUPD_A-gbSCg6EsGnMUf5xmb91c.jpg',
    height: 78,
    width: 140
  },
  video: {
    URL: 'https://v.redd.it/hifa8frikcp71/DASH_360.mp4?source=fallback',
    height: 360,
    width: 640,
    duration: 18,
    isGif: true
  }
}
```