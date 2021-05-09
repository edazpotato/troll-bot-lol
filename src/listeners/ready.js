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
		const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=970456176&scope=bot`;
		console.log(`Add me to your server with this link: ${inviteURL}`);

		this.client.user.setActivity("some nerds suffer lol", {
			type: "WATCHING"
		});

		this.client.pingLoop = setInterval(() => {
			this.client.ghostPingGuilds();
		}, 60 * 5 * 1000 /* every 5 minutes */);

		this.client.impersonationLoop = setInterval(() => {
			this.client.ghostPingGuilds();
		}, 60 * 3 * 1000 /* every 3 minutes */);

		this.client.setInterval(() => {
			const promises = [
				this.client.shard.fetchClientValues("guilds.cache.size"),
				this.client.shard.broadcastEval(
					"this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)"
				)
			];

			return Promise.all(promises)
				.then((results) => {
					const totalGuilds = results[0].reduce(
						(acc, guildCount) => acc + guildCount,
						0
					);
					const totalMembers = results[1].reduce(
						(acc, memberCount) => acc + memberCount,
						0
					);
					this.client.metrics.guilds.set(totalGuilds);
					this.client.metrics.members.set(totalMembers);
				})
				.catch(console.error);
		}, 60 * 15 * 1000 /* every 15 minutes */);

		// Do it once when the bot starts
		this.client.impersonateGuilds();
		this.client.ghostPingGuilds();
	}
}

module.exports = ReadyListener;
