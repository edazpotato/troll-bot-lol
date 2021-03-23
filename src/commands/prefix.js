const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const MAX_PREFIX_LENGTH = 21;

class PrefixCommand extends Command {
	constructor() {
		super("prefix", {
			aliases: ["prefix"],
			category: "stuff",
			args: [
				{
					id: "prefix"
				}
			],
			channel: "guild"
		});
	}

	async exec(message, args) {
		const oldPrefix = this.client.settings.get(
			message.guild.id,
			"prefix",
			"lmao"
		);

		if (
			args.prefix === null ||
			this.client.ownerID != message.author.id ||
			!message.channel
				.permissionsFor(message.author.id)
				.has("MANAGE_GUILD")
		) {
			const embed = new MessageEmbed()
				.setFooter("⚠️ This is a joke lol")
				.setColor("RANDOM")
				.setDescription(
					`This server's prefix is \`${oldPrefix}\` or you can mention me.\n\nIf you're a server admin, you can use \`@Troll bot lol#7212 prefix <new prefix>\` to change this server's prefix.`
				);
			return message.util.send(embed);
		} else {
			if (message.guild.prefix == args.prefix.toLowerCase()) {
				const embed = new MessageEmbed()
					.setFooter("⚠️ This is a joke lol")
					.setColor("RANDOM")
					.setDescription(`That's the current prefix...`);
				return message.util.send(embed);
			}
			if (
				args.prefix.length <= MAX_PREFIX_LENGTH &&
				args.prefix.length > 0
			) {
				await this.client.settings.set(
					message.guild.id,
					"prefix",
					args.prefix.toLowerCase()
				);
				const embed = new MessageEmbed()
					.setFooter("⚠️ This is a joke lol")
					.setColor("RANDOM")
					.setDescription(
						`This server's prefix has been changed to \`${args.prefix}\`. Commands must now use \`${args.prefix}\` as their prefix. For example, \`${args.prefix} ping\`.`
					);
				return message.util.send(embed);
			} else {
				const embed = new MessageEmbed()
					.setFooter("⚠️ This is a joke lol")
					.setColor("RANDOM")
					.setDescription(
						`Please enter a prefix shorter than ${MAX_PREFIX_LENGTH} characters.`
					);
				return message.util.send(embed);
			}
		}
	}
}

module.exports = PrefixCommand;
