import { Client, IntentsBitField, REST, Routes, Events, Collection, EmbedBuilder } from 'discord.js';
import Enmap from 'enmap';
import * as Commands from './Commands/exports/index.js';
import { BotConfiguration } from './Constants/BotConfiguration.js';
import { Settings } from './Constants/Settings.js';
import { FreeGame } from './Reddit/FreeGame.js';
import { RedditEngine } from './Reddit/RedditEngine.js';

export class Choccy {
    constructor() {
        this.Commands = Object.values(Commands).map(command => new command());

        this.Token = this.IsProductionBot() ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_DEVELOPMENT;
        this.ClientID = !this.IsProductionBot() ? process.env.BOT_CLIENT_DEVELOPMENT : process.env.BOT_CLIENT;
        this.LastFreeGame = '';

        this.Client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent
            ]
        });

        this.RedditAPI = new RedditEngine();
    }

    Initialize() {
        // Register enmap storage
        this.Client.settings = new Enmap({
            name: 'settings',
            fetchAll: false,
            autoFetch: true,
            cloneLevel: 'deep'
        });

        this.Client.on(Events.InteractionCreate, async interaction => this.onInteractionCreate(interaction));
        this.Client.on(Events.GuildDelete, async guild => this.onGuildDelete(guild));

        this.Client.login(this.Token);

        setInterval(async () => this.PollFreeGame(), BotConfiguration.FreeGameSetup.Delay * 1000);

        this.RegisterSlashCommands();
    }

    IsProductionBot(){
        return (process.env.NODE_ENV || 'development').toLowerCase() !== 'development';
    }

    async PollFreeGame() {
        const availableGuilds = (await this.Client.guilds.fetch())
            .map(x => { return { guild: x, channel: this.Client.settings.getValue(x.id, Settings.FreeGamesChannel) } })
            .filter(info => info.channel !== Settings.DefaultValue);

        if (availableGuilds.length) {
            this.RedditAPI.GetPosts(BotConfiguration.FreeGameSetup.Subreddit, this.LastFreeGame).then(post => {
                const valid = post.map(x => new FreeGame(x)).find(x => x.IsValid());

                if (valid) {
                    this.LastFreeGame = valid.Post.Name;

                    availableGuilds.forEach(async info => await this.SendMessage(info.guild.id, info.channel,
                        { embeds: [await valid.GetEmbed()] }));
                }
            });
        }
    }

    async SendMessage(guildID, channelID, message) {
        const guild = await this.Client.guilds.fetch(guildID.toString());

        if (!guild) { return; }
        if (!channelID) { return; }

        guild.channels.fetch(channelID).then(x => x.send(message));
    }

    RegisterSlashCommands() {
        const rest = new REST().setToken(this.Token);

        (async () => {
            try {
                await rest.put(
                    Routes.applicationCommands(this.ClientID),
                    { body: this.Commands.map(command => command.GetBuilder().toJSON()) }
                );
            } catch (error) {
                console.error(error);
            }
        })();
    }

    // Event shit
    async onInteractionCreate(interaction) {
        const command = this.Commands.find(x => x.Name === interaction?.commandName);

        if (!interaction.isChatInputCommand()) { return; }
        if (!command) { return; }

        await command.Action(interaction, this.Client);
    }

    // Raised when the bot is kicked or leaves
    async onGuildDelete(guild) {
        this.Client.settings.delete(guild.id);
    }
}