import express from 'express';
import { ActiveConnections, IncomingMessage } from '../types';
import Chat from '../models/ChatMessage';

const chatRouter = express.Router();

const activeConnections: ActiveConnections = {};

export const mountChatRouter = () => {
  chatRouter.ws('/', async (ws, _req) => {
    const id = crypto.randomUUID();
    console.log('Client connected with id =', id);
    activeConnections[id] = ws;

    ws.send(
      JSON.stringify({
        type: 'WELCOME',
        payload: 'Successfully connected to chat!',
      })
    );
    const chatMessages = await Chat.find().sort({ datetime: 'desc' }).limit(30);
    ws.send(JSON.stringify({ type: 'SET_MESSAGES', payload: chatMessages }));

    ws.on('message', async (msg) => {
      const parsedMsg = JSON.parse(msg.toString()) as IncomingMessage;

      if (parsedMsg.type === 'SEND_MESSAGE') {
        const date = new Date();
        const chatMessage = new Chat({
          username: parsedMsg.payload.username,
          text: parsedMsg.payload.text,
          datetime: date.toISOString(),
        });
        await chatMessage.save();

        Object.values(activeConnections).forEach((connection) => {
          const outgoingMessage = {
            type: 'NEW_MESSAGE',
            payload: {
              username: parsedMsg.payload.username,
              text: parsedMsg.payload.text,
            },
          };
          connection.send(JSON.stringify(outgoingMessage));
        });
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected with id =', id);
      delete activeConnections[id];
    });
  });
};

export default chatRouter;
