const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
class PingCommand extends Command {
	constructor() {
		super("ping", {
			aliases: ["ping", "hello"]
		});
	}

	async exec(message) {
		const embed = new MessageEmbed()
			.setFooter("⚠️ This is a joke lol")
			.setTitle("Pong!")
			.setColor("RANDOM");
		const sent = await message.util.send(embed);
		const timeDiff =
			(sent.editedAt || sent.createdAt) -
			(message.editedAt || message.createdAt);
		embed.setDescription(
			`**🏓 ${timeDiff}ms.\n💟 ${Math.round(this.client.ws.ping)}ms.**`
		);
		return sent.edit(embed);
	}
}

module.exports = PingCommand;
