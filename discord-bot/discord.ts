import { Client, Events, GatewayIntentBits } from 'discord.js';
import { getDiscordCredentials } from '~/utils/env';

type User = {
  id: string;
  name: string;
};

type Message = {
  id: string;
  channelId: string;
  author: User;
  text: string;
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

export const getMe = async () => {
  await client.login(getDiscordCredentials().token);

  if (!client.user) {
    throw new Error('Failed to login to Discord');
  }

  const user: User = {
    id: client.user.id,
    name: client.user.username
  };

  return user;
};

export const listen = async (callback: (message: Message) => Promise<void> | void) => {
  await client.login(getDiscordCredentials().token);

  client.on(Events.MessageCreate, (message) => {
    callback({
      id: message.id,
      channelId: message.channelId,
      author: {
        id: message.author.id,
        name: message.author.username
      },
      text: message.content
    });
  });
};

export const reply = async (message: Message, text: string) => {
  await client.login(getDiscordCredentials().token);

  const channel = client.channels.resolve(message.channelId);
  if (!channel || !channel.isTextBased()) {
    throw new Error('Failed to resolve channel');
  }

  const replyMessage = await channel.send({
    reply: {
      messageReference: message.id
    },
    content: text
  });

  const result: Message = {
    id: replyMessage.id,
    channelId: replyMessage.channelId,
    author: {
      id: replyMessage.author.id,
      name: replyMessage.author.username
    },
    text: replyMessage.content
  };

  return result;
};
