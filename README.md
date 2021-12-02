![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?color=white&style=for-the-badge)

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

```js
console.log(Images.hosts);

/*
[
  'gelbooru.com',       
  'safebooru.donmai.us',
  'safebooru.org',      
  'danbooru.donmai.us', 
  'rule34.paheal.net',  
  'rule34.xxx',
  'lolibooru.moe',      
  'e621.net',
  'e926.net',
  'xbooru.com',
  'derpibooru.org',     
  'tbib.org',
  'yande.re',
  'hypnohub.net',       
  'konachan.com',       
  'konachan.net',
  'mspabooru.com',
  'www.sakugabooru.com',
  'shimmie.shishnet.org',
  'booru.allthefallen.moe',
  'cascards.fluffyquack.com',
  'www.booru.realmofastra.ca'
]
*/
```

</br>
</details>
</br>

### Image example

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

### Reddit examples

```js
{
  URL: 'https://www.reddit.com/r/memes/comments/r6v3c0/please_dont/',
  title: 'Please dont',
  domain: 'i.redd.it',
  nsfw: false,
  thumbnail: {
    URL: 'https://b.thumbs.redditmedia.com/TLBQ-mWFCw8W5YTUYXFVMQmRlOLolq9E3f1j2G29xXw.jpg', 
    height: 140,
    width: 140
  },
  fileURL: 'https://i.redd.it/gru29iwt71381.jpg'
}
```

```js
{
  URL: 'https://www.reddit.com/r/vid/comments/r2788h/whats_more_thanksgiving_than_tossing_a_72lb/',
  title: 'What’s More Thanksgiving Than Tossing a 72lb Watermelon From the Silo?',
  domain: 'v.redd.it',
  nsfw: false,
  thumbnail: {
    URL: 'https://b.thumbs.redditmedia.com/eRPQcuiuuzGx27qyZvXrpfmm-jOSpqGplMoXXiPE57Y.jpg',   
    height: 140,
    width: 140
  },
  video: {
    URL: 'https://v.redd.it/ebh5mpqdat181/DASH_720.mp4?source=fallback',
    height: 720,
    width: 405,
    duration: 8
  }
}
```

> If you have any error you can contact me on [Discord](https://discord.gg/zrESMn6)

### To-Do

* Authentication for reddit ([OAuth2](https://github.com/reddit-archive/reddit/wiki/OAuth2))
* Authentication for booru's
