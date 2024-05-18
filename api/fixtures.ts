import mongoose from 'mongoose';
import config from './config';
import User from './models/User';

const dropCollection = async (
  db: mongoose.Connection,
  collectionName: string
) => {
  try {
    await db.dropCollection(collectionName);
  } catch (error) {
    console.log(`Collection ${collectionName} is missing. Skipping drop...`);
  }
};

const collections: string[] = ['users'];

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  for (const collection of collections) {
    await dropCollection(db, collection);
  }

  await User.create(
    {
      email: 'mod505@gmail.com',
      password: 'iLoveBishkek1234%',
      token: crypto.randomUUID(),
      role: 'moderator',
      displayName: 'Moderator',
      avatar: 'fixtures/modAvatar.png',
    },
    {
      email: 'usermaster@gmail.com',
      password: 'iLoveBishkek4321%',
      token: crypto.randomUUID(),
      role: 'user',
      displayName: 'User',
    }
  );

  await db.close();
};

void run().catch(console.error);
