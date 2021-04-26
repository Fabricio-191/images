type Image = {
    title: string;
    url: string;
    author: string;
    createdAtUTC: Date | null;
    subreddit: string;
} | null;

interface SFWMethods {
    [method: string]: () => Promise<Image>;
    cat(): Promise<Image>;
    dog(): Promise<Image>;
    bird(): Promise<Image>;
    wallpapers(): Promise<Image>;
    food(): Promise<Image>;
    programming(): Promise<Image>;
    humor(): Promise<Image>;
    memes(): Promise<Image>;
    irl(): Promise<Image>;
}

interface NSFWMethods {
    [method: string]: () => Promise<Image>;
    general(): Promise<Image>;
    milf(): Promise<Image>;
    teen(): Promise<Image>;
    amateur(): Promise<Image>;
    hentai(): Promise<Image>;
    rule34(): Promise<Image>;
    ecchi(): Promise<Image>;
    furry(): Promise<Image>;
    yiff(): Promise<Image>;
    bdsm(): Promise<Image>;
    blowjob(): Promise<Image>;
    ass(): Promise<Image>;
    anal(): Promise<Image>;
    boobs(): Promise<Image>;
    feet(): Promise<Image>;
    thighs(): Promise<Image>;
    pussy(): Promise<Image>;
    curvy(): Promise<Image>;
    petite(): Promise<Image>;
    cum(): Promise<Image>;
    asian(): Promise<Image>;
    indian(): Promise<Image>;
    japanese(): Promise<Image>;
    korean(): Promise<Image>;
    ebony(): Promise<Image>;
    white(): Promise<Image>;
    gif(): Promise<Image>;
    hardcore(): Promise<Image>;
    hd(): Promise<Image>;
    lesbian(): Promise<Image>;
    masturbation(): Promise<Image>;
    men(): Promise<Image>;
    handholding(): Promise<Image>;
    outfit(): Promise<Image>;
    bikini(): Promise<Image>;
    costumes(): Promise<Image>;
    public(): Promise<Image>;
    trans(): Promise<Image>;
    other(): Promise<Image>;
    gore(): Promise<Image>;
    gay(): Promise<Image>;
    gaygifs(): Promise<Image>;
    bara(): Promise<Image>;
    yaoi(): Promise<Image>;
}

declare class Images{
	constructor(id?: string);

    sfw: SFWMethods;
    nsfw: NSFWMethods;
    getFromSubreddit(): Promise<Image>;
    search(): Promise<Image>;

    static randomID(): string;
    static init(): Images;
}

export = Images;
