![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?color=white&style=for-the-badge)
<a href="https://www.buymeacoffee.com/Fabricio191" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="28" width="135"></a>
[![Discord](https://img.shields.io/discord/555535212461948936?style=for-the-badge&color=7289da)](https://discord.gg/zrESMn6)

# Booru's

```js
const Images = require('@fabricio-191/images');

// Images(host, options, requestOptions)
Images('safebooru.org')
  .then(images => {
    console.log(images[0]);
  })
  .catch(console.error);
```

## Image example

```js
{
  URL: 'https://safebooru.org/index.php?page=post&s=view&id=3534899',
  rating: 'safe',
  type: 'image',
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

Notes:

* Posible ratings are: `['safe', 'questionable', 'explicit', 'unknown']`
* Posible types are: `['image', 'video', 'gif']`
* Every image has the hidden property `raw` that contains the raw data of the image.

## Options

```js
{
  query: 'tag1 tag2',
  limit: 100,
  page: 1,
}
```

|  key  | optional | description |
|:-----:|:--------:|:------------|
| query | ✔️ | the string containing the tags to search for. ([cheatsheet](https://gelbooru.com/index.php?page=wiki&s=view&id=26263), aplies for most of hosts) |
| limit | ✔️ | the number of images to get, the maximum changes depending on the host, for default is the max amount in each host |
| page  | ✔️ | the page to get (starts at 1) |
<!--
  user: '',
  pass: '',
| user | ✔️ | username for authentication on the host |
| pass | ✔️ | password/api key for authentication on the host |
-->

Note:
The amount of images may not coincide with the "limit" parameter because it indicates to the page how many images to return, but the module filters the deleted or pending images.

`requestOptions` are [https request options](https://nodejs.org/api/https.html#httpsrequestoptions-callback).

## Valid hosts

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

## Images properties by host

✔️ always  
❌ never  
⚪️ maybe

| hostname | limit | URL | tags | rating | file | file.URL | file.width | file.height | resized | resized.URL | resized.width | resized.height | thumbnailURL |
|----------------------------------------------------------------|:----:|:--:|:---:|:--:|:---:|:--:|:---:|:--:|:---:|:--:|:---:|:--:|:---:|
| [gelbooru.com](https://gelbooru.com)                           | 1000 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ⚪️ | ⚪️ | ✔️ |
| [safebooru.donmai.us](https://safebooru.donmai.us)             | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ❌ | ❌ | ✔️ |
| [safebooru.org](https://safebooru.org)                         | 1000 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ⚪️ | ⚪️ | ✔️ |
| [danbooru.donmai.us](https://danbooru.donmai.us)               | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ❌ | ❌ | ✔️ |
| [rule34.paheal.net](https://rule34.paheal.net)                 | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ❌ | ❌ | ✔️ |
| [rule34.xxx](https://rule34.xxx)                               | 1000 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ⚪️ | ⚪️ | ✔️ |
| [lolibooru.moe](https://lolibooru.moe)                         | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ❌ | ❌ | ✔️ |
| [e621.net](https://e621.net)                                   | 320  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ⚪️ | ⚪️ | ✔️ |
| [e926.net](https://e926.net)                                   | 320  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ⚪️ | ⚪️ | ✔️ |
| [xbooru.com](https://xbooru.com)                               | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ⚪️ | ⚪️ | ✔️ |
| [derpibooru.org](https://derpibooru.org)                       | 50   | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ✔️ |
| [tbib.org](https://tbib.org)                                   | 1000 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ⚪️ | ⚪️ | ✔️ |
| [yande.re](https://yande.re)                                   | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ❌ | ❌ | ✔️ |
| [hypnohub.net](https://hypnohub.net)                           | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ❌ | ❌ | ✔️ |
| [konachan.com](https://konachan.com)                           | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ❌ | ❌ | ✔️ |
| [konachan.net](https://konachan.net)                           | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ❌ | ❌ | ✔️ |
| [mspabooru.com](https://mspabooru.com)                         | 1000 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ⚪️ | ⚪️ | ✔️ |
| [www.sakugabooru.com](https://www.sakugabooru.com)             | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ❌ | ❌ | ✔️ |
| [shimmie.shishnet.org](https://shimmie.shishnet.org)           | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ❌ | ❌ | ✔️ |
| [booru.allthefallen.moe](https://booru.allthefallen.moe)       | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ⚪️ | ⚪️ | ❌ | ❌ | ✔️ |
| [cascards.fluffyquack.com](https://cascards.fluffyquack.com)   | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ❌ | ❌ | ✔️ |
| [www.booru.realmofastra.ca](https://www.booru.realmofastra.ca) | 100  | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ | ❌ | ❌ | ✔️ |
