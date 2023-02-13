import { Client, IntentsBitField, REST, Routes } from 'discord.js';
import * as Commands from './Commands/exports/index.js';

export class Choccy {
    constructor() {
        this.onInteractionCreate = this.onInteractionCreate.bind(this);

        this.Commands = Object.values(Commands).map(command => new command());

        this.Initialize();
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

        client.on('interactionCreate', this.onInteractionCreate);
        client.login(process.env.BOT_TOKEN);
    }

    async onInteractionCreate(interaction) {
        if (!interaction.isChatInputCommand()) { return; }

        interaction.reply('Command received');
    }
}