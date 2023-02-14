import { Client, IntentsBitField, REST, Routes, Events } from 'discord.js';
import * as Commands from './Commands/exports/index.js';

export class Choccy {
    constructor() {
        this.onInteractionCreate = this.onInteractionCreate.bind(this);

        this.Commands = Object.values(Commands).map(command => new command());
        this.ClientID = '1014536625423908996';
    }

    Initialize() {
        const client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent
            ]
        });

        client.on(Events.InteractionCreate, this.onInteractionCreate);
        client.login(process.env.BOT_TOKEN);

        // Register slash commands
        this.GetGuildID(client).then(guildID => {
            const rest = new REST().setToken(process.env.BOT_TOKEN);

            (async () => {
                try {
                    await rest.put(
                        Routes.applicationGuildCommands(this.ClientID, guildID),
                        { body: this.Commands.map(command => command.GetBuilder().toJSON()) }
                    );
                } catch (error) {
                    console.error(error);
                }
            })();
        });
    }

    async onInteractionCreate(interaction) {
        const command = this.Commands.find(x => x.Name === interaction?.commandName);

        if (!interaction.isChatInputCommand()) { return; }
        if (!command) { return; }

        command.Action(interaction);
    }

    GetGuildID(client) {
        return (process.env.NODE_ENV || 'development').toLowerCase() === 'production'
            ? client.guilds.fetch()
            : new Promise(resolve => resolve('822900454714376212'));
    }
}