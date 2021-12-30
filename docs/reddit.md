# Reddit

```js
// Images.reddit.getFromSubreddit(subreddit, options, requestOptions);
Images.reddit.getFromSubreddit('memes')
  .then(images => {
     console.log(images[0]);
  })
  .catch(console.error);

// Images.reddit.search(searchString, options, requestOptions);
Images.reddit.search('red hot chili peppers')
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

|  key   | optional | description |
|:------:|:--------:|:------------|
| query  | ✔️ | the query to search for |
| limit  | ✔️ | the number of images to get, for default it's 100 (the maximun) |
| before | ✔️ | the id of the first image to get |
| after  | ✔️ | the id of the last image to get |
| user   | ✔️ | the username to authenticate |
| pass   | ✔️ | the password to authenticate |

`requestOptions` are https request options, see [this](https://nodejs.org/api/https.html#httpsrequestoptions-callback).

## Image example

```js

```

```js

```
