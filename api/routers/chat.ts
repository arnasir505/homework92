import express from 'express';
import { ActiveConnections, IncomingMessage } from '../types';
import Chat from '../models/ChatMessage';
import User from '../models/User';

const chatRouter = express.Router();

const activeConnections: ActiveConnections = {};

export const mountChatRouter = () => {
  chatRouter.ws('/', async (ws, _req, next) => {
    try {
      const id = crypto.randomUUID();
      console.log('Client connected with id =', id);
      activeConnections[id] = ws;

      ws.send(
        JSON.stringify({
          type: 'WELCOME',
          payload: 'Successfully connected to chat!',
        })
      );

      const chatMessages = await Chat.find()
        .sort({ datetime: 'desc' })
        .limit(30);
      ws.send(JSON.stringify({ type: 'SET_MESSAGES', payload: chatMessages }));

      const onlineUsers = await User.find(
        {
          isOnline: true,
        },
        { email: 0, token: 0, role: 0 }
      );
      ws.send(
        JSON.stringify({ type: 'SET_ONLINEUSERS', payload: onlineUsers })
      );

      ws.on('message', async (msg) => {
        const parsedMsg = JSON.parse(msg.toString()) as IncomingMessage;

        if (parsedMsg.type === 'LOGIN') {
          const user = await User.findOneAndUpdate(
            { token: parsedMsg.payload.token },
            { isOnline: true }
          );
          await user?.save();

          Object.values(activeConnections).forEach((connection) => {
            const outgoingMessage = {
              type: 'NEW_ONLINEUSER',
              payload: {
                _id: user?.id,
                displayName: user?.displayName,
                avatar: user?.avatar,
              },
            };
            connection.send(JSON.stringify(outgoingMessage));
          });
        }

        if (parsedMsg.type === 'SEND_MESSAGE') {
          const date = new Date();
          const chatMessage = new Chat({
            username: parsedMsg.payload.username,
            text: parsedMsg.payload.text,
            datetime: date.toISOString(),
            avatar: parsedMsg.payload.avatar,
          });
          await chatMessage.save();

          Object.values(activeConnections).forEach((connection) => {
            const outgoingMessage = {
              type: 'NEW_MESSAGE',
              payload: {
                username: parsedMsg.payload.username,
                text: parsedMsg.payload.text,
                avatar: parsedMsg.payload.avatar,
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
    } catch (e) {
      next(e);
    }
  });
};

export default chatRouter;
