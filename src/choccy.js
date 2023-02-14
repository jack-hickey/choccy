import { Client, IntentsBitField, REST, Routes, Events } from 'discord.js';
import Enmap from 'enmap';
import * as Commands from './Commands/exports/index.js';

export class Choccy {
    constructor() {
        this.onInteractionCreate = this.onInteractionCreate.bind(this);
        this.onGuildDelete = this.onGuildDelete.bind(this);

        this.Commands = Object.values(Commands).map(command => new command());
        this.ClientID = '1014536625423908996';

        this.Client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent
            ]
        });
    }

    Initialize() {
        // Register enmap storage
        this.Client.settings = new Enmap({
            name: 'settings',
            fetchAll: false,
            autoFetch: true,
            cloneLevel: 'deep'
        });

        this.Client.on(Events.InteractionCreate, this.onInteractionCreate);
        this.Client.on(Events.GuildDelete, this.onGuildDelete);

        this.Client.login(process.env.BOT_TOKEN);

        // Register slash commands
        this.GetGuildID(this.Client).then(guildID => {
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

    GetGuildID(client) {
        return (process.env.NODE_ENV || 'development').toLowerCase() === 'production'
            ? client.guilds.fetch()
            : new Promise(resolve => resolve('822900454714376212'));
    }

    // Event shit
    async onInteractionCreate(interaction) {
        const command = this.Commands.find(x => x.Name === interaction?.commandName);

        if (!interaction.isChatInputCommand()) { return; }
        if (!command) { return; }

        command.Action(interaction, this.Client);
    }

    // Raised when the bot is kicked or leaves
    async onGuildDelete(guild) {
        this.Client.settings.delete(guild.id);
    }
}