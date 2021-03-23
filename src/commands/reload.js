const { Command } = require("discord-akairo");

class ReloadCommand extends Command {
	constructor() {
		super("reload", {
			ownerOnly: true,
			description: {
				usage: "[module ID or category ID or 'all'(defualt)]",
				about: "Reloads a command or category."
			},
			category: "owner",
			aliases: ["reload"],
			clientPermissions: ["SEND_MESSAGES"],
			args: [
				{
					id: "commandID",
					default: "all"
				}
			]
		});
	}

	exec(message, args) {
		// `this` refers to the command object.
		if (args.commandID == "all") {
			this.handler.reloadAll();
			return message.util.send(
				`Reloaded ${
					this.handler.modules.map((m) => m).length
				} command(s)!`
			);
		}
		try {
			this.handler.reload(args.commandID);
			return message.util.send(`Reloaded command ${args.commandID}!`);
		} catch {
			try {
				const category = this.handler.categories
					.map((c) => c)
					.filter((c) => c == args.commandID)[0];
				category.reloadAll();

				return message.util.send(
					`Reloaded category ${args.commandID}!\nReloaded ${
						category.map((m) => m).length
					} command(s)!`
				);
			} catch (e) {
				return message.util.send(
					`${args.commandID} is not a valid category/command ID!`
				);
			}
		}
	}
}

module.exports = ReloadCommand;
