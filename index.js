import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, Routes, REST } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] });
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Dating channel ID
const DATING_CHANNEL_ID = '1405561752778707058';

// Register commands
const commands = [
  // Invite command
  new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite a user to join the dating thread')
    .addUserOption(option => option.setName('user').setDescription('The user to invite').setRequired(true)),

  // Ship command
  new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Ship two people together')
    .addUserOption(option => option.setName('user').setDescription('User to ship with (optional)')),

  // Hug
  new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Hug someone in the dating channel')
    .addUserOption(option => option.setName('user').setDescription('The person you want to hug').setRequired(true)),

  // Kiss
  new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Kiss someone in the dating channel')
    .addUserOption(option => option.setName('user').setDescription('The person you want to kiss').setRequired(true)),

  // Compliment
  new SlashCommandBuilder()
    .setName('compliment')
    .setDescription('Send a romantic compliment to someone')
    .addUserOption(option => option.setName('user').setDescription('The person to compliment').setRequired(true)))
].map(command => command.toJSON());

// Deploy commands
(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Commands registered!');
  } catch (error) {
    console.error(error);
  }
})();

// Event listener
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, channel, guild } = interaction;

  // Restrict certain commands to dating channel only
  const datingOnlyCommands = ['ship', 'hug', 'kiss', 'compliment'];
  if (datingOnlyCommands.includes(commandName) && channel.id !== DATING_CHANNEL_ID) {
    return interaction.reply({ content: `❌ This command can only be used in <#${DATING_CHANNEL_ID}>`, ephemeral: true });
  }

  // --- /invite command ---
  if (commandName === 'invite') {
    const user = options.getUser('user');
    const embed = new EmbedBuilder()
      .setColor('Pink')
      .setTitle('💌 You have been invited!')
      .setDescription(`${interaction.user} has invited you to join a private dating thread!`)
      .setFooter({ text: 'Use /accept to join if you’re interested ❤️' })
      .setTimestamp();

    try {
      await user.send({ embeds: [embed] });
      interaction.reply({ content: `✅ Invite sent to ${user.tag}`, ephemeral: true });
    } catch {
      interaction.reply({ content: `❌ Could not DM ${user.tag}`, ephemeral: true });
    }
  }

  // --- /ship command ---
  if (commandName === 'ship') {
    let user1 = interaction.user;
    let user2 = options.getUser('user');

    if (!user2) {
      const members = await guild.members.fetch();
      const nonBots = members.filter(m => !m.user.bot && m.id !== user1.id);
      if (nonBots.size === 0) return interaction.reply('❌ No available users to ship with!');
      user2 = nonBots.random().user;
    }

    const lovePercentage = Math.floor(Math.random() * 101);
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('💘 Shipping Time!')
      .setDescription(`${user1} ❤️ ${user2}\n**Love Match:** ${lovePercentage}%`)
      .setFooter({ text: 'Love is in the air!' })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }

  // --- /hug command ---
  if (commandName === 'hug') {
    const user = options.getUser('user');
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('🤗 Hug Time!')
      .setDescription(`${interaction.user} gives a warm hug to ${user}! 💞`)
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  }

  // --- /kiss command ---
  if (commandName === 'kiss') {
    const user = options.getUser('user');
    const embed = new EmbedBuilder()
      .setColor('Pink')
      .setTitle('💋 Kiss Time!')
      .setDescription(`${interaction.user} kisses ${user} passionately! 💖`)
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  }

  // --- /compliment command ---
  if (commandName === 'compliment') {
    const user = options.getUser('user');
    const compliments = [
      'You light up every room you walk into ❤️',
      'You are the definition of beauty 💎',
      'Every moment with you feels magical ✨',
      'You have the kindest heart 💕'
    ];
    const embed = new EmbedBuilder()
      .setColor('Purple')
      .setTitle('🌹 Compliment Time!')
      .setDescription(`${interaction.user} tells ${user}: "${compliments[Math.floor(Math.random() * compliments.length)]}"`)
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
