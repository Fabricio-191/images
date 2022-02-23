/* eslint-disable */
// @ts-nocheck
const Images = require("../");

Images('rule34.paheal.net', { query: 'aiz_wallenstein' })
	.then(images => {
		console.log(images[0]);
	})

