import { Settings } from "../Constants/Settings.js";
import { Command } from "./exports/command.js";

export class FreeGameChannelCommand extends Command {
    static SubCommands = {
        Channel: 'channel',
        Config: 'config'
    };

    constructor() {
        super('freegames', 'Set the channel for free games to appear in');
    }

    GetBuilder() {
        const builder = super.GetBuilder();

        builder.addSubcommand(
            options => options
                .setName(FreeGameChannelCommand.SubCommands.Channel)
                .setDescription('The channel to post free games to')
                .addChannelOption(channel => channel
                    .setName(FreeGameChannelCommand.SubCommands.Channel)
                    .setDescription('Input channel'))
        );

        builder.addSubcommand(
            options => options
                .setName(FreeGameChannelCommand.SubCommands.Config)
                .setDescription("Get configuration settings for Choccy's freegames feature")
        );

        return builder;
    }

    async Action(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case FreeGameChannelCommand.SubCommands.Channel: return this.SetChannel(interaction, client);
            case FreeGameChannelCommand.SubCommands.Config: return this.DisplayConfig(interaction, client);
        }
    }

    SetChannel(interaction, client) {
        const channel = interaction.options.getChannel('channel') ?? Settings.DefaultValue;

        client.settings.set(interaction.guildId, channel.id, Settings.FreeGamesChannel);

        interaction.reply(
            channel !== Settings.DefaultValue
                ? `Free games channel set to ${channel}`
                : 'Free games channel removed'
        );
    }

    DisplayConfig(interaction, client) {
        const channel = client.settings.getValue(interaction.guildId, Settings.FreeGamesChannel);

        interaction.reply(channel === Settings.DefaultValue
            ? 'Choccy has not been configured to post free games. Please use **/freegames channel** to do this'
            : `Choccy is configured to send free games to <#${channel}>`);
    }
}