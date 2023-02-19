import { EmbedBuilder } from "discord.js";
import { BotConfiguration } from "../Constants/BotConfiguration.js";
import { Scraper } from "../Scraper.js";

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

    async GetEmbed() {
        const parsedURL = new URL(this.Post.URL);

        const metadata = await Scraper.GetMetaData(parsedURL.toString());
        const domainMetadata = await Scraper.GetMetaData(parsedURL.toString().substring(0, parsedURL.toString().indexOf(parsedURL.hostname) + parsedURL.hostname.length));

        return new Promise(resolve => {
            const builder = new EmbedBuilder()
                .setColor(BotConfiguration.FreeGameSetup.Embed.Color)
                .setAuthor({ name: 'Free game!' })
                .setURL(this.Post.URL)
                .setTitle(this.Post.Title.substr(this.Post.Title.indexOf(')') + 1).trim())
                .setFooter({ text: 'Found for you by Choccy' })
                .addFields(
                    { name: 'Platform', value: this.GetPlatform() }
                );

            if (metadata['og:image']) {
                builder.setImage(metadata['og:image']);
            }

            if (domainMetadata['og:image']) {
                builder.setThumbnail(domainMetadata['og:image']);
            }

            resolve(builder);
        });
    }
}