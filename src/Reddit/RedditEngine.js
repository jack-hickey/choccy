import { Link } from "./Link.js";

export class RedditEngine {
    constructor() {
        this.FetchPrefix = "https://www.reddit.com/r";
    }

    async GetLatestPost(subreddit, before) {
        const data = (await (await fetch(`${this.FetchPrefix}/${subreddit}/new.json?limit=1&before=${before}&type=link`))
            .json())?.data?.children?.at(0)?.data;

        return data ? new Link(data) : null;
    }
}