"use strict";
const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
function capitilize(name) {
	return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
const readblePermissions = {
	// If possible, use the translations from the Discord client here
	CREATE_INSTANT_INVITE: "Create Invite",
	KICK_MEMBERS: "Kick Members",
	BAN_MEMBERS: "Ban Members",
	ADMINISTRATOR: "Administrator",
	MANAGE_CHANNELS: "Manage Channels",
	MANAGE_GUILD: "Manage Server",
	ADD_REACTIONS: "Add Reactions",
	VIEW_AUDIT_LOG: "View Audit Log",
	PRIORITY_SPEAKER: "Priority Speaker",
	STREAM: "Video",
	VIEW_CHANNEL: "Read Messages",
	SEND_MESSAGES: "Send Messages",
	SEND_TTS_MESSAGES: "Send TTS Messages",
	MANAGE_MESSAGES: "Manage Messages",
	EMBED_LINKS: "Embed Links",
	ATTACH_FILES: "Attach Files",
	READ_MESSAGE_HISTORY: "Read Message History",
	MENTION_EVERYONE: "Mention @\u200beveryone, @\u200bhere and All Roles",
	USE_EXTERNAL_EMOJIS: "Use External Emojis",
	VIEW_GUILD_INSIGHTS: "View Server Insights",
	CONNECT: "Connect",
	SPEAK: "Speak",
	MUTE_MEMBERS: "Mute Members (voice)",
	DEAFEN_MEMBERS: "Deafen Members",
	MOVE_MEMBERS: "Move Members",
	USE_VAD: "Use Voice Activity",
	CHANGE_NICKNAME: "Change Nickname",
	MANAGE_NICKNAMES: "Manage Nicknames",
	MANAGE_ROLES: "Manage Roles",
	MANAGE_WEBHOOKS: "Manage Webhooks",
	MANAGE_EMOJIS: "Manage Emojis"
};
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
					.map((permission) => readblePermissions[permission])
					.join(", ")
			);
		}
		if (command.clientPermissions) {
			embed.addField(
				"Bot permissions",
				command.clientPermissions
					.map((permission) => readblePermissions[permission])
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
