const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const { inspect } = require("util");

class ReloadCommand extends Command {
	constructor() {
		super("eval", {
			ownerOnly: true,
			description: {
				usage: "[module ID or category ID or 'all'(defualt)]",
				about: "Reloads a command or category."
			},
			category: "owner",
			aliases: ["eval", "e"],
			clientPermissions: ["SEND_MESSAGES"],
			args: [
				{
					id: "code",
					match: "content",
					type: "string",
					prompt: {
						start: (message) =>
							`${message.author}, what would you like to evaluate?`
					}
				}
			]
		});
	}

	async exec(message, { code }) {
		let evaled = "";
		let evalStartTime;
		let evalEndTime;
		try {
			evalStartTime = Date.now();
			evaled = eval(code);
			evalEndTime = Date.now();

			if (typeof evaled !== "string") {
				evaled = inspect(evaled);
			}
		} catch (error) {
			return message.util.send(`Error while evaluating: \`${error}\``);
		}
		const embed = new MessageEmbed()
			.setFooter("⚠️ This is a joke lol")
			.setColor("RANDOM")
			.setTitle(
				`Evaluation completed! Took ${Math.abs(
					evalEndTime - evalStartTime
				)}ms`
			)
			.setDescription(
				`📤 Output: \`\`\`js\n${
					evaled.length > 0 ? evaled : "No output!"
				}\`\`\``
			);
		return message.util.send(embed);
	}
}

module.exports = ReloadCommand;
