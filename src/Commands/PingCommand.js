import { EmbedBuilder } from "discord.js";
import { BotConfiguration } from "../Constants/BotConfiguration.js";
import { Command } from "./exports/command.js";

export class PingCommand extends Command {
    constructor() {
        super('ping', 'Replies with the latency of the command');
    }

    async Action(interaction, client) {
        const init = await interaction.reply({ embeds: [this.GetEmbed("Calculating...", client.ws.ping)], fetchReply:true });

        interaction.editReply({ embeds: [this.GetEmbed(`${init.createdTimestamp - interaction.createdTimestamp}ms`, client.ws.ping)] });
    }

    GetEmbed(latency, ws) {
        return new EmbedBuilder().
            setTitle("Pong!").
            setTimestamp().
            setColor(BotConfiguration.Theme).
            addFields(
                { name: "Choccy's Latency", value: latency, inline: true },
                { name: "Web Socket Latency", value: `${ws}ms`, inline: true }
            );
    }
}