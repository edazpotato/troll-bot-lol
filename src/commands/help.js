const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");

function capitilize(name) {
	return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

class HelpCommand extends Command {
	constructor() {
		super("help", {
			description: {
				usage: "[command]",
				about:
					"Displays a list of commands or detailed infromation about a single command."
			},
			category: "core",
			aliases: ["help", "h"],
			clientPermissions: ["SEND_MESSAGES"],
			args: [{ id: "commandID", type: "commandAlias", default: null }]
		});
		this.readblePermissions = require("../utils/readble-permissions.json");
	}
	async sendHelp(message) {
		const usefulLinks = [
			{ name: "Website", url: "https://edaz.codes" },
			{ name: "Support server", url: "https://discord.gg/mzR7eeZ" }
		];

		let suitablePrefix = this.client.settings.get(
			message.guild.id,
			"prefix",
			"lmao"
		);

		const embed = new MessageEmbed()
			.setFooter("⚠️ This is a joke lol")
			.setColor("RANDOM")
			.setTimestamp()
			.setFooter(
				`${
					message.guild
						? `This server's prefix is "${suitablePrefix}" | `
						: ""
				}Use "${suitablePrefix} help <command>" for details about a command`
			)
			.addFields([
				...this.handler.categories
					.map((category, key) => {
						return {
							name: capitilize(key),
							value: category
								.filter((command) => {
									if (
										command.ownerOnly &&
										!this.client.isOwner(message.author.id)
									)
										return false;
									if (
										command.channel == "guild" &&
										!message.guild
									)
										return false;
									return true;
								})
								.map((command, key) => `\`${key}\``)
								.join(", ")
						};
					})
					.filter((category) => !(category.value.length < 1)),
				{
					name: "Useful links",
					value: usefulLinks
						.map((link) => `[${link.name}](${link.url})`)
						.join(" - ")
				}
			]);
		return message.util.send(embed);
	}
	async sendDeets(message, commandName) {
		const command = this.handler.modules
			.map((command) => command)
			.filter(
				(command) =>
					command.aliases.includes(command) ||
					command.id == commandName
			)[0];
		const embed = new MessageEmbed()
			.setFooter("⚠️ This is a joke lol")
			.setColor("RANDOM")
			.setTimestamp()
			.setTitle(capitilize(command.id));
		if (command.description.usage) {
			embed.setFooter(
				`⚠️ This is a joke lol | <> = required, [] = optional, || = choose one`
			);
		}

		if (command.description.usage !== undefined) {
			embed.addField(
				"Usage",
				`\`${message.util.parsed.prefix} ${command.id}${
					command.description.usage
						? ` ${command.description.usage}`
						: ""
				}\``
			);
		}
		if (command.userPermissions) {
			embed.addField(
				"User permissions",
				command.userPermissions
					.map((permission) => this.readblePermissions[permission])
					.join(", ")
			);
		}
		if (command.clientPermissions) {
			embed.addField(
				"Bot permissions",
				command.clientPermissions
					.map((permission) => this.readblePermissions[permission])
					.join(", ")
			);
		}
		embed.setDescription(command.description.about);
		return message.util.send(embed);
	}
	async exec(message, args) {
		if (args.commandID === null) {
			return this.sendHelp(message);
		}
		return this.sendDeets(message, args.commandID);
	}
}
module.exports = HelpCommand;
