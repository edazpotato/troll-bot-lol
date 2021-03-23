const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");

class InviteCommand extends Command {
	constructor() {
		super("invite", {
			aliases: ["invite", "add", "inv"]
		});
	}

	async exec(message) {
		const inviteURL =
			"https://discord.com/api/oauth2/authorize?client_id=654104074530062346&permissions=970456176&scope=bot";
		const embed = new MessageEmbed()
			.setFooter("⚠️ This is a joke lol")
			.setDescription(`[${inviteURL}](${inviteURL})`);

		await message.channel.send(embed);
	}
}

module.exports = InviteCommand;
