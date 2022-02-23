# Reddit

```js
const Images = require('@fabricio-191/images');

// Images.reddit.getFromSubreddit(subreddit, options, requestOptions);
Images.reddit.getFromSubreddit('memes')
  .then(results => {
     console.log(results[0]);
  })
  .catch(console.error);

// Images.reddit.search(searchString, options, requestOptions);
Images.reddit.search('red hot chili peppers')
  .then(results => {
     console.log(results[0]);
  })
  .catch(console.error);


Images.reddit.subredditExists('nsfw')
  .then(result => {
     console.log(result); // true
  })
  .catch(console.error);
```

## Options

```js
{
  limit: 100,
  before: 't3_abcdef',
  after: 't3_abcdef'
}
```

|  key   | optional | description |
|:------:|:--------:|:------------|
| limit  | ✔️ | the number of images to get, for default it's 100 (the maximun) |
| before | ✔️ | the id of the first image to get |
| after  | ✔️ | the id of the last image to get |
| subreddit | ✔️ | (only in search) will perform the search in the specified subreddit |

`requestOptions` are [https request options](https://nodejs.org/api/https.html#httpsrequestoptions-callback).

## Image example

```js
{
  "ID": "t3_szt8xy",
  "URL": "https://www.reddit.com/r/memes/comments/szt8xy/we_are_not_the_same/",
  "title": "we are not the same",
  "domain": "i.redd.it",
  "nsfw": false,
  "thumbnail": {
    "URL": "https://b.thumbs.redditmedia.com/WJwwmFD7M6A7cS_7DEV7azRWKYz0NgxeRPA2IdPBy_U.jpg",
    "height": 105,
    "width": 140
  },
  "type": "image",
  "fileURL": "https://i.redd.it/2b1vyoldnnj81.gif"
}
```

#### Video example

```js
{
  "ID": "t3_szt1m5",
  "URL": "https://www.reddit.com/r/memes/comments/szt1m5/screw_you_henry_fischel/",
  "title": "Screw you Henry Fischel",
  "domain": "v.redd.it",
  "nsfw": false,
  "thumbnail": {
    "URL": "https://b.thumbs.redditmedia.com/hpqBZCFuWqPCky5NDUO8EulZMyQHWBc4INAhBU3eVLw.jpg",
    "height": 78,
    "width": 140
  },
  "type": "video",
  "video": {
    "URL": "https://v.redd.it/ptmg3rzslnj81/DASH_480.mp4?source=fallback",
    "height": 478,
    "width": 854,
    "duration": 27
  }
}
```
