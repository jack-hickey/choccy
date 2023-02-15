import { Post } from "./Post.js";

export class RedditEngine {
    constructor() {
        this.FetchPrefix = "https://www.reddit.com/r";
    }

    async GetPosts(subreddit, before) {
        before = '';
        const data = (await (await fetch(`${this.FetchPrefix}/${subreddit}/new.json?before=${before}&type=link`))
            .json())?.data?.children;

        return (data ??= []).map(post => new Post(post.data));
    }
}