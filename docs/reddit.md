# Reddit

```js
Images.reddit.getFromSubreddit('memes', options)
  .then(images => {
     console.log(images[0]);
  })
  .catch(console.error);

Images.reddit.search('red hot chili peppers', options)
  .then(images => {
     console.log(images[0]);
  })
  .catch(console.error);
```

## Options

```js
{
  query: '',
  limit: 100,
  page: 1,
  user: '',
  pass: '',
}
```

(everything is optional)

* `query`: the query to search for
* `limit`: the number of images to get, the maximum changes depending on the host, for default is the max amount in each host
* `after`:
* `before`:
* `user`: username for authentication on the host
* `pass`: password/api key for authentication on the host

## Image example

```js
{
  URL: 'https://www.reddit.com/r/memes/comments/r6v3c0/please_dont/',
  title: 'Please dont',
  domain: 'i.redd.it',
  nsfw: false,
  thumbnail: { // ~
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
  thumbnail: { // ~
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