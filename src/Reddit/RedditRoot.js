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

    GetPopulatedProperties() {
        const populated = {};

        Object.keys(this).forEach(key => {
            const value = this[key];

            if (value !== null && value !== undefined) {
                populated[key] = value;
            }
        });

        return populated;
    }
}