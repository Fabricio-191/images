![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?color=white&style=for-the-badge)
<a href="https://www.buymeacoffee.com/Fabricio191" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="28" width="135"></a>
[![Discord](https://img.shields.io/discord/555535212461948936?style=for-the-badge&color=7289da)](https://discord.gg/zrESMn6)

# Docs

* [Booru's](https://github.com/Fabricio-191/images/docs/booru's.md)
* [Reddit](https://github.com/Fabricio-191/images/reddit.md)

## Quick usage example

```js
const Images = require('@fabricio-191/images');

Images('safebooru.org', {
  query: 'aiz_wallenstein'
})
  .then(results => {
    console.log(results[0]);
  })
  .catch(console.error);
```

```js
const Images = require('@fabricio-191/images');

Images.reddit.getFromSubreddit('memes')
  .then(results => {
     console.log(results[0]);
  })
  .catch(console.error);

Images.reddit.search('red hot chili peppers')
  .then(results => {
     console.log(results[0]);
  })
  .catch(console.error);
```