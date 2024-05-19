import express from 'express';
import { ActiveConnections, IncomingMessage } from '../types';

const chatRouter = express.Router();

const activeConnections: ActiveConnections = {};

export const mountChatRouter = () => {
  chatRouter.ws('/', (ws, _req) => {
    const id = crypto.randomUUID();
    console.log('Client connected with id =', id);
    activeConnections[id] = ws;

    ws.send(
      JSON.stringify({
        type: 'WELCOME',
        payload: 'Successfully connected to chat!',
      })
    );

    ws.on('message', (msg) => {
      const parsedMsg = JSON.parse(msg.toString()) as IncomingMessage;

      if (parsedMsg.type === 'SEND_MESSAGE') {
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
