// lib/appwrite.ts
import { Client, Account, Databases } from 'appwrite';
import { appwriteConfig } from './appwrite.config';

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Si on est côté serveur (Node), ajouter la clé API
if (typeof window === 'undefined') {
  client.headers = {
    'X-Appwrite-Key': process.env.APPWRITE_API_KEY!
  };
}

export const account = new Account(client);
export const databases = new Databases(client);

export { client };
