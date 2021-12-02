import { RequestOptions } from 'https';

declare module '@fabricio-191/images' {
	type obj = Record<string, unknown>; // object but better

	type rating = 'safe' | 'questionable' | 'explicit' | 'unknown';

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

	export default function main(host: string, options: Options): Promise<Image[]>;
	export const hosts: string[];
}