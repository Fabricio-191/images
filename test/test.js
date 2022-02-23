/* eslint-disable */
// @ts-nocheck
const Images = require("../");

Images('xbooru.com')
	.then(images => {
		console.log(images);
	})
