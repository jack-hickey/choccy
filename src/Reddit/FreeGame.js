import { EmbedBuilder } from "discord.js";
import { BotConfiguration } from "../Constants/BotConfiguration.js";

export class FreeGame {
    constructor(post) {
        this.Post = post;
    }

    IsValid() {
        if (this.Post.IsSelf) { return false; }
        if (BotConfiguration.FreeGameSetup.InvalidTitleMatches.find(x => this.Post.Title.toUpperCase().includes(x))) { return false; }

        return true;
    }

    GetPlatform() {
        let platform = this.Post.Title.substring(this.Post.Title.indexOf('[') + 1, this.Post.Title.indexOf(']'));

        const conversionAttempt = BotConfiguration.FreeGameSetup.RecognizedPlatforms.find(x => x.name === platform.toUpperCase());

        if (conversionAttempt) {
            platform = conversionAttempt.conversion;
        }

        return platform;
    }

    async GetImageURL() {
        const data = await (await fetch(this.Post.URL, { headers: { 'User-Agent': 'request' } })).text();

        return new Promise(resolve => {
            const element = data.match(/(<meta([^>]+)>)/ig).find(x => x.includes('og:image'));

            resolve(element
                ? element.substring(element.indexOf('content=') + 9).slice(0, -2)
                : '');
        });
    }

    async GetEmbed() {
        const imageURL = await this.GetImageURL();

        return new Promise(resolve => {
            resolve(new EmbedBuilder()
                .setColor(BotConfiguration.FreeGameSetup.Embed.Color)
                .setAuthor({ name: 'Free game!' })
                .setURL(this.Post.URL)
                .setTitle(this.Post.Title.substr(this.Post.Title.indexOf(')') + 1).trim())
                .addFields(
                    { name: 'Platform', value: this.GetPlatform() }
                )
                .setImage(imageURL));
        });
    }
}