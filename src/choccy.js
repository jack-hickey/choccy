const { Client, IntentsBitField } = require('discord.js');
require('dotenv');

const client = new Client({
   intents:[
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
   ]
});

client.login(process.env.BOT_TOKEN);