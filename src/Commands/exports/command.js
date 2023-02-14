import { SlashCommandBuilder } from "discord.js";

export class Command {
    constructor(name, description) {
        this.Name = name;
        this.Description = description;
    }

    GetBuilder() {
        const builder = new SlashCommandBuilder()
            .setName(this.Name)
            .setDescription(this.Description);

        return builder;
    }

    Action(interaction) { }
}