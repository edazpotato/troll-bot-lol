const { Inhibitor } = require("discord-akairo");

class BlacklistInhibitor extends Inhibitor {
	constructor() {
		super("blacklist", {
			reason: "blacklist"
		});
	}

	exec(message) {
		// He's a meanie!
		const blacklist = ["uwu"];
		return blacklist.includes(message.author.id);
	}
}

module.exports = BlacklistInhibitor;
