declare module '@fabricio-191/images' {
	namespace reddit{

	}

	interface Image {
		URLa: string;
		tags: string[];
		rating: string;
		isVideo: boolean;
		file: {
			URL: string;
			width: number;
			height: number;
		};
		resized: {
			URL: string;
			width: number;
			height: number;
		};
		thumbnailURL: string;
		raw: object;
	}
}