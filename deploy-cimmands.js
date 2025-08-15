// deploy-commands.js
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const commands = [
  // /ship command
  new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Ship yourself with someone ❤️')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user you want to be shipped with')
        .setRequired(false)
    ),

  // /hug command
  new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Give a warm hug 🤗')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user you want to hug')
        .setRequired(true)
    ),

  // /kiss command
  new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Give a sweet kiss 😘')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user you want to kiss')
        .setRequired(true)
    ),

  // /date command
  new SlashCommandBuilder()
    .setName('date')
    .setDescription('Ask someone out on a date 🍷')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user you want to date')
        .setRequired(true)
    ),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands },
  );

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
