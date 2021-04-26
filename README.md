![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?color=white&style=for-the-badge)

## These images are obtained from Reddit

> If you have any error you can contact me on [Discord](https://discord.gg/zrESMn6)

## Use example

```js
const Images = require('@fabricio-191/images');
const images = new Images({
	checkImages: true,
	addDefaultCategories: true,
});

Images.getFromCategory('cat')
	.then(console.log)
	.catch(console.error);

images.getFromSubreddit('nsfw')
	.then(console.log)
	.catch(console.error);

images.search('runescape')
	.then(console.log)
	.catch(console.error);
```


## Image example

