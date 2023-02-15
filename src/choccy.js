import { Client, IntentsBitField, REST, Routes, Events, Collection, EmbedBuilder } from 'discord.js';
import Enmap from 'enmap';
import * as Commands from './Commands/exports/index.js';
import { BotConfiguration } from './Constants/BotConfiguration.js';
import { Settings } from './Constants/Settings.js';
import { RedditEngine } from './Reddit/RedditEngine.js';

export class Choccy {
    constructor() {
        this.Commands = Object.values(Commands).map(command => new command());


        this.ClientID = '1014536625423908996';
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

        this.Client.login(process.env.BOT_TOKEN);

        setInterval(async () => this.PollFreeGame(), BotConfiguration.FreeGameSetup.Delay * 1000);

        this.RegisterSlashCommands();
    }

    async PollFreeGame() {
        const availableGuilds = (await this.Client.guilds.fetch())
            .map(x => { return { guild: x, channel: this.Client.settings.getValue(x.id, Settings.FreeGamesChannel) } })
            .filter(info => info.channel !== Settings.DefaultValue);

        if (availableGuilds.length) {
            this.RedditAPI.GetPosts(BotConfiguration.FreeGameSetup.Subreddit, this.LastFreeGame).then(post => {
                const valid = post.find(x => !x.IsSelf);

                if (valid) {
                    this.LastFreeGame = valid.Name;

                    availableGuilds.forEach(
                        async info => await this.SendMessage(info.guild.id, info.channel, { embeds: [this.GetFreeGameEmbed(valid)] }));
                }
            });
        }
    }

    async SendMessage(guildID, channelID, message) {
        const guild = await this.Client.guilds.fetch(guildID.toString());

        if (!guild) { return; }
        if (!channelID) { return; }

        guild.channels.fetch(channelID).then(x => x.send(message));
        console.log('message sent');
    }

    GetFreeGameEmbed(redditPost) {
        return new EmbedBuilder()
            .setColor(11176191)
            .setTitle(redditPost.Title);
    }

    RegisterSlashCommands() {
        const rest = new REST().setToken(process.env.BOT_TOKEN);

        (async () => {
            try {
                await rest.put(
                    (process.env.NODE_ENV || 'development').toLowerCase() === 'production'
                        ? Routes.applicationCommands()
                        : Routes.applicationGuildCommands(this.ClientID, '822900454714376212'),
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

        command.Action(interaction, this.Client);
    }

    // Raised when the bot is kicked or leaves
    async onGuildDelete(guild) {
        this.Client.settings.delete(guild.id);
    }
}