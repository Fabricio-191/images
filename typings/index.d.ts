declare module '@fabricio-191/images' {

	type flags = 'PINNED' | 'ARCHIVED' | 'EDITED' | 'DISTINGUISHED' |
		'NO_ADS' | 'NSFW' | 'ORIGINAL_CONTENT' | 'SPOILER' |
		'LOCKED' | 'STICKIED';

	interface postData{
		// name: data.name,
		id: string;
		title: string;
		url: string;
		thumbnail: {
			url: string;
			height: number;
			width: number;
		},
		authorId: string;
		authorName: string;
		createdAtUTC: Date | null;
		upvotes: number;
		downvotes: number;
		subreddit: {
			id: string;
			name: string;
			type: string;
			subscribersQuantity: number;
		},
		/*
		awards: {
			quantity: number;
			all: any;
			awarders: any;
		},
		*/
		commentsQty: number;
		flags: Set<flags>;
	}

	interface image{
		type: 'image';
		url: string;
		postData: postData;
	}

	interface video{
		type: 'video';
		url: string;
		postData: postData;
	}

	interface gif{
		type: 'gif';
		url: string;
		postData: postData;
	}

	interface externalImage{
		type: 'ext:image';
		url: string;
		postData: postData;
	}

	interface externalVideo{
		type: 'ext:video';
		url: string;
		postData: postData;
	}

	interface externalGif{
		type: 'ext:gif';
		url: string;
		postData: postData;
	}

	type post = image | video | gif | externalImage | externalVideo | externalGif | null;

	declare class Images{
		constructor();

		getFromSubreddit(): Promise<post>;
		getFromCategory(): Promise<post>;
		static search(): Promise<post[]>;
	}

	export = Images;
}