const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");

class UserImpersonationCommand extends Command {
	constructor() {
		super("user-impersonation", {
			aliases: [
				"users",
				"user",
				"impersonation",
				"impersonate",
				"impersonate-user",
				"user-impersonation",
				"imersonate",
				"imersonate-user",
				"user-imersonation"
			]
		});
	}

	async exec(message, args) {
		const oldSetting = this.client.settings.get(
			message.guild.id,
			"userImpersonation",
			false
		);

		if (
			!this.client.isOwner(message.author.id) ||
			!message.channel
				.permissionsFor(message.author.id)
				.has("MANAGE_GUILD")
		) {
			const embed = new MessageEmbed()
				.setFooter("⚠️ This is a joke lol")
				.setColor("RANDOM")
				.setDescription(
					`This server currently has **User Impersonation** \`${
						oldSetting ? "Enabled" : "Disabled"
					}\`.`
				);
			return message.util.send(embed);
		} else {
			// console.log(oldSetting);
			await this.client.settings.set(
				message.guild.id,
				"userImpersonation",
				!oldSetting
			);

			const embed = new MessageEmbed()
				.setFooter("⚠️ This is a joke lol")
				.setColor("RANDOM")
				.setDescription(
					`This server's setting for **User Impersonation** has been changed to \`${
						!oldSetting ? "Enabled" : "Disabled"
					}\`. A random member will ${
						!oldSetting ? "now" : "no longer"
					} be **Impersonated** every 3 minutes.`
				);
			return message.util.send(embed);
		}
	}
}

module.exports = UserImpersonationCommand;
