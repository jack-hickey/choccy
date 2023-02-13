import { Command } from "./exports/command.js";

export class PingCommand extends Command {
    constructor() {
        super('ping', 'Standard ping');
    }

    Action() {
        console.log('hello');
    }
}