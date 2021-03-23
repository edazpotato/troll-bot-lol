const { Listener } = require("discord-akairo");

class ReadyListener extends Listener {
	constructor() {
		super("ready", {
			emitter: "client",
			event: "ready"
		});
	}
	impersonateGuilds;
	exec() {
		console.log("I'm ready!");
		this.client.pingLoop = setInterval(() => {
			this.client.ghostPingGuilds();
		}, 60 * 5 * 1000 /* every 5 minutes */);

		this.client.impersonationLoop = setInterval(() => {
			this.client.ghostPingGuilds();
		}, /*60 * 1 **/ 1000 * 10 /* every minute */);

		// Do it once when the bot starts
		this.client.impersonateGuilds();
		this.client.ghostPingGuilds();
	}
}

module.exports = ReadyListener;
