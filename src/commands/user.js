const { Command, Argument } = require("discord-akairo");
const { MessageEmbed, GuildMember } = require("discord.js");

class UserInfoCommand extends Command {
	constructor() {
		/*super("user", {
			aliases: [
				"u",
				"user",
				"perms",
				"permissions",
				"user-permissions",
				"info",
				"member",
				"member-info",
				"member-permissions",
				"me",
				"i"
			],
			description: {
				usage: "[user]",
				about:
					"Displays information such as permissions about a specified user, or yourself."
			},
			category: "utilities",
			args: [
				{
					id: "user",
					type: Argument.union("member", "user"),
					default: null
				}
			],

			clientPermissions: ["SEND_MESSAGES"]
		});*/
		this.readblePermissions = require("../utils/readble-permissions.json");
	}

	exec(message, args) {
		const person = args.user
			? args.user
			: message.member
			? message.member
			: message.author;
		const member = person instanceof GuildMember;

		const embed = new MessageEmbed()
			.setFooter("⚠️ This is a joke lol")
			.setColor("RANDOM");

		if (member) {
			embed.setAuthor(person.user.tag, person.user.displayAvatarURL());

			const permissionsMatch = message.channel
				.permissionsFor(person)
				.equals(person.permissions);
			permissionsMatch
				? embed.addField(
						"Permissions",

						person.permissions
							.toArray()
							.map((perm) => this.readblePermissions[perm])
							.join("**, **")
				  )
				: embed
						.addField(
							"Global permissions",
							"**" +
								person.permissions
									.toArray()
									.map(
										(perm) => this.readblePermissions[perm]
									)
									.join("**, **") +
								"**"
						)
						.addField(
							"Extra permissions in this channel",
							"**" +
								message.channel
									.permissionsFor(person)
									.remove(person.permissions)
									.toArray()
									.map(
										(perm) => this.readblePermissions[perm]
									)
									.join("**, **") +
								"**"
						);
		} else {
			embed.setAuthor(person.tag, person.displayAvatarURL());
		}

		return message.util.send(embed);
	}
}

module.exports = UserInfoCommand;
