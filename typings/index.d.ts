declare module '@fabricio-191/images' {
	namespace reddit{
		type flags = 'PINNED' | 'EDITED' | 'LOCKED' | 'ARCHIVED' | 'NO_ADS' |
		'DISTINGUISHED' | 'ORIGINAL_CONTENT' | 'NSFW' | 'SPOILER' | 'STICKIED';

		interface Image {
			title: string;
			ID: string;
			URL: string;
			domain: string;
			isVideo: boolean;
			postURL: string;
			thumbnail: {
				URL: string;
				height: raw.thumbnail_height,
				width: raw.thumbnail_width,
			},
			authorID: string | null,
			authorName: string;
			createdAtUTC: string | null;
			upvotes: raw.ups,
			downvotes: raw.downs,
			subreddit: {
				ID: string;
				name: string;
				type: string;
				subscribers: number;
			}
			flags: Array<flags>;
			// eslint-disable-next-line @typescript-eslint/ban-types
			raw: object;
		}

		interface Video extends Image{
			video: {
				URL: string | null;
				height: number;
				width: number;
				duration: number | null;
				isGif: boolean;
			}
		}

		interface Options {
			after?: string;
			before?: string;
			limit?: string;
		}

		export function getFromSubreddit(subreddit: string, options?: Options): Promise<Array<Image | Video>>;
		export function SubredditCache(subreddit: string): (video?: boolean) => Promise<Image | Video>;
	}
}