import { ChoccyReddit } from "./RedditRoot.js";

export class Thing extends ChoccyReddit {
    constructor(json) {
        super(json);

        this.ID = json.id;
        this.Name = json.name;
        this.Kind = json.kind;
        this.Data = json.data;
    }
}