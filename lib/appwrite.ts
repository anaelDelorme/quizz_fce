// lib/appwrite.ts
import { Client, Account, Databases } from 'appwrite';
import { appwriteConfig } from './appwrite.config';

export const getAppwriteClient = () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  // Si on est côté serveur (Node.js), ajouter la clé API
  if (typeof window === 'undefined' && process.env.APPWRITE_API_KEY) {
    client.headers = {
      'X-Appwrite-Key': process.env.APPWRITE_API_KEY
    };
  }

  const account = new Account(client);
  const databases = new Databases(client);

  return { client, account, databases };
};
