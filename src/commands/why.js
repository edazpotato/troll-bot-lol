const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");

class WhyCommand extends Command {
	constructor() {
		super("why", {
			aliases: ["why"]
		});
	}

	async exec(message) {
		const embed = new MessageEmbed();
		embed.setDescription(
			"I was bored and saw [this](https://www.reddit.com/r/discordapp/comments/ma44h4/what_type_of_bot_are_you_looking_for/grqwyot?utm_source=share&utm_medium=web2x&context=3) on reddit."
		);
		embed.setFooter("⚠️ This is a joke lol");
		await message.channel.send(embed);
	}
}

module.exports = WhyCommand;
