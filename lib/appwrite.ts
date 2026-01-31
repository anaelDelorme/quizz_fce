// lib/appwrite.ts
import { Client, Account, Databases } from 'appwrite';
import { appwriteConfig } from './appwrite.config';

const serverClient = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Clé API côté serveur
const apiKey = process.env.APPWRITE_API_KEY;
if (!apiKey) throw new Error('APPWRITE_API_KEY manquante');
serverClient.headers = { 'X-Appwrite-Key': apiKey };

export const account = new Account(serverClient);
export const databases = new Databases(serverClient);
export { serverClient as client };

export const getAppwriteClient = () => ({ client: serverClient, account, databases });
