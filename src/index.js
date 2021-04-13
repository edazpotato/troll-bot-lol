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

const dodgyMessages = require(path.join(
	__dirname,
	"..",
	"data",
	"dodgyMessages.json"
)).messages;
//console.log(dodgyMessages);

class TrollBot extends AkairoClient {
	constructor() {
		super(
			{
				ownerID: "569414372959584256"
			},
			{
				ws: {
					intents: new Intents(Intents.ALL).remove("GUILD_PRESENCES")
				}
			}
		);
		this.commandHandler = new CommandHandler(this, {
			directory: path.join(__dirname, "commands"),
			allowMention: true,
			commandUtil: true,
			handleEdits: true,
			aliasReplacement: /-/g,
			prefix: (message) => {
				if (message.guild) {
					// The third param is the default.
					return this.settings.get(message.guild.id, "prefix", [
						"lmao",
						"lmoa",
						"loma"
					]);
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
						await guild.members.fetch({ limit: 10 });
						const userToPing =
							guild.members.cache
								.filter((m) => !m.user.bot)
								.random() || guild.members.cache.random();
						//console.log(guild.members.cache.size);
						const channel = guild.channels.cache
							.filter((c) => c.isText)
							.random();
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

	async impersonateGuilds() {
		this.guilds.cache.map(async (guild) => {
			console.log(guild.members.cache.size);
			if (this.settings.get(guild.id, "userImpersonation", false)) {
				try {
					await guild.members.fetch({ limit: 10 });
					const userToImpersonate =
						guild.members.cache
							.filter((m) => !m.user.bot)
							.random() || guild.members.cache.random();
					const channel = guild.channels.cache
						.filter((c) => c.type == "text")
						.random();

					if (!guild.me.permissions.has("MANAGE_WEBHOOKS")) {
						try {
							const embed = new MessageEmbed()
								.setFooter("⚠️ This is a joke lol")
								.setColor("RANDOM")
								.setDescription(
									`I need the \`MANAGE_WEBHOOKS\` permission in order to impersonate people. Give it to me the try again lol.`
								);
							await channel.send(embed);
						} catch {}
					} else {
						const webhooks = await channel.fetchWebhooks();
						let webhook = webhooks.first();
						if (!webhook) {
							webhook = await channel.createWebhook(
								"trollbot-webhook-lmao",
								{
									avatar: this.user.avatarURL
								}
							);
						}

						const messageToSend =
							dodgyMessages[
								Math.floor(Math.random() * dodgyMessages.length)
							];

						console.log(userToImpersonate.user);
						await webhook.send(messageToSend, {
							username: userToImpersonate.displayName, // Nickname if they have one, otherwise their normal name
							avatarURL: userToImpersonate.user.avatarURL()
						});
						//console.log(userToPing.id);
					}
				} catch (e) {
					console.log("Webook err", e);
				}
			}
			//console.log(channel);
		});
	}
}

const client = new TrollBot();
client.login(process.env.TOKEN);
