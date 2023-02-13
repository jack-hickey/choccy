import { SlashCommandBuilder } from "discord.js";

export class Command {
    constructor(name, description) {
        this.Name = name;
        this.Description = description;
    }

    GetBoilerplate() {
        return new SlashCommandBuilder()
            .setName(this.Name)
            .setDescription(this.Description).toJSON();
    }

    Action() { }
}