const { Listener } = require("discord-akairo");

class ReadyListener extends Listener {
	constructor() {
		super("ready", {
			emitter: "client",
			event: "ready"
		});
	}

	exec() {
		console.log("I'm ready!");
		this.client.pingLoop = setInterval(() => {
			this.client.ghostPingGuilds();
		}, 60 * 5 * 1000 /* every 5 minutes */);
		this.client.ghostPingGuilds(); // Loop one when the bot starts
	}
}

module.exports = ReadyListener;
