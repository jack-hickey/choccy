import { SlashCommandChannelOption, SlashCommandSubcommandBuilder } from "discord.js";
import { Command } from "./exports/command.js";

export class FreeGameChannelCommand extends Command {
    constructor() {
        super('freegames', 'Set the channel for free games to appear in');
    }

    GetBuilder() {
        const builder = super.GetBuilder();

        builder.addSubcommand(
            options => options
                .setName('channel')
                .setDescription('The channel to post free games to')
                .addChannelOption(channel => channel
                    .setName('channel')
                    .setDescription('Input channel'))
        );

        return builder;
    }

    Action(interaction) {
        const channel = interaction.options.getChannel('channel');

        interaction.reply(
            channel
                ? `Free games channel set to ${channel}`
                : "Free games channel removed"
        );
    }
}