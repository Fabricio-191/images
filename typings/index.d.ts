import { RequestOptions } from 'https';

declare module '@fabricio-191/images' {
	type obj = Record<string, unknown>; // object but better

	namespace reddit{
		interface Image{
			URL: string;
			title: string;
			domain: string;
			nsfw: boolean;
			raw: obj;
			thumbnail?: {
				URL: string;
				width: number;
				height: number;
			}
			fileURL: string;
		}
		interface Video{
			URL: string;
			title: string;
			domain: string;
			nsfw: boolean;
			raw: obj;
			thumbnail?: {
				URL: string;
				width: number;
				height: number;
			}
			video: {
				URL: string;
				width: number;
				height: number;
				duration: number;
			}
		}

		interface Options{
			limit?: number;
			after?: string;
			before?: string;
			pass?: string;
			user?: string;
		}

		export function search(
			searchString: string,
			options?: Options
		): Promise<Array<Image | Video>>;

		export function getFromSubreddit(
			subreddit: string,
			options?: Options,
			requestOptions?: RequestOptions
		): Promise<Array<Image | Video>>;

		export function subredditExists(subreddit: string): Promise<boolean>;
	}

	type rating = 'safe' |
		'unknown' |
		'explicit' |
		'questionable';

	type validHost = 'e621.net' |
		'e926.net' |
		'tbib.org' |
		'yande.re' |
		'rule34.xxx' |
		'xbooru.com' |
		'gelbooru.com' |
		'hypnohub.net' |
		'konachan.com' |
		'konachan.net' |
		'safebooru.org' |
		'lolibooru.moe' |
		'mspabooru.com' |
		'derpibooru.org' |
		'rule34.paheal.net' |
		'danbooru.donmai.us' |
		'safebooru.donmai.us' |
		'www.sakugabooru.com' |
		'shimmie.shishnet.org' |
		'booru.allthefallen.moe' |
		'cascards.fluffyquack.com' |
		'www.booru.realmofastra.ca';

	interface Image {
		URL?: string;
		tags: string[];
		rating?: rating;
		file: {
			URL: string;
			width: number;
			height: number;
		};
		resized?: {
			URL: string;
			width?: number;
			height?: number;
		};
		thumbnailURL: string;
		raw: obj;
	}

	export default function main(host: validHost, options: Options): Promise<Image[]>;
	export const hosts: validHost[];
}