require("dotenv").config();
const path = require("path");

const {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
	InhibitorHandler,
	SQLiteProvider
} = require("discord-akairo");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const { Intents } = require("discord.js");

const trollBotIntents = new Intents(Intents.ALL);
trollBotIntents.remove("GUILD_PRESENCES");

class TrollBot extends AkairoClient {
	constructor() {
		super(
			{
				ownerID: "569414372959584256"
			},
			{ ws: { intents: trollBotIntents } }
		);
		this.commandHandler = new CommandHandler(this, {
			directory: path.join(__dirname, "commands"),
			allowMention: true,
			commandUtil: true,
			aliasReplacement: /-/g,
			prefix: (message) => {
				if (message.guild) {
					// The third param is the default.
					return this.settings.get(
						message.guild.id,
						"prefix",
						"lmao"
					);
				}

				return ["lmao", "lmoa", "loma"];
			}
		});
		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: path.join(__dirname, "inhibitors")
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: path.join(__dirname, "listeners")
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();

		this.settings = new SQLiteProvider(
			sqlite.open({
				filename: "./data/database.db",
				driver: sqlite3.Database
			}),
			"guildSettings",
			{
				idColumn: "guild_id",
				dataColumn: "settings"
			}
		);
	}

	async login(token) {
		await this.settings.init();
		return super.login(token);
	}

	async ghostPingGuilds() {
		this.guilds.cache.map(async (guild) => {
			if (this.settings.get(guild.id, "ghostPings", false)) {
				let i = 0;
				//console.log(guild.channels.cache.size);
				while (i < Math.floor(guild.channels.cache.size / 1.5)) {
					try {
						const userToPing = guild.members.cache.random();
						//console.log(guild.members.cache.size);
						const channel = guild.channels.cache.random();
						const message = await channel.send(
							`<@${userToPing.id}>`
						);
						await message.delete();
						//console.log(userToPing.id);
					} catch {}
					i++;
				}
			}
			//console.log(channel);
		});
	}
}

const client = new TrollBot();
client.login(process.env.TOKEN);
