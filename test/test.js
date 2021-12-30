/* eslint-disable */
// @ts-nocheck
const Images = require("../");

Images('rule34.xxx')
	.then(images => {
		console.log(images.map(x => x.thumbnailURL).filter(url => {
			try{
				// eslint-disable-next-line no-new
				new URL(url);
				return false;
			}catch{
				return true;
			}
		}))
	})

/*
Images.reddit.getFromSubreddit('memes')
	.then(images => {
		console.log(images[0]);
	})
*/