import { Link } from "./Link.js";

export class RedditEngine {
    constructor() {
        this.FetchPrefix = "https://www.reddit.com/r";
    }

    async GetLatestPost(subreddit) {
        const data = await (await fetch(`${this.FetchPrefix}/${subreddit}/new.json?limit=1`)).json();

        return new Link(data.data.children[0].data);
    }
}