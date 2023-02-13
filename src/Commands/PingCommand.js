import { Command } from "./exports/command.js";

export class PingCommand extends Command {
    constructor() {
        super('ping', 'Replies with the latency of the command');
    }

    Action(interaction) {
        interaction.reply(`Pong!\n(That took ${Math.abs(Date.now() - interaction.createdTimestamp)}ms)`);
    }
}