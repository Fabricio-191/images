/* eslint-disable */
// @ts-nocheck
const Images = require("../");

const get = async page => {
	return (await Images('rule34.paheal.net', { page, limit: 100 }))
		.map(x => x.URL.slice(36));
}

(async function(){
	const IDs1 = await get(0);
	const IDs2 = await get(1);


	console.log(IDs1);
	console.log(IDs2);
})();