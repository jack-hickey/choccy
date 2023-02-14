export class RedditRoot {
    constructor(json) {
        this.UnderlyingJSON = json;
    }

    PopulateProperties() {
        const myProperties = Object.keys(this);

        Object.keys(this.UnderlyingJSON).forEach(jsonKey => {
            const attempt = myProperties.find(x => x.toLowerCase() === jsonKey.toLowerCase().replaceAll('_', ''));

            if (attempt) {
                this[attempt] = this.UnderlyingJSON[jsonKey];
            } else {
                console.log(`${this.constructor.name} is missing ${jsonKey}`);
            }
        });
    }
}