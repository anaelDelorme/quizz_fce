import { Client, Account, Databases } from 'appwrite';
import { appwriteConfig } from './appwrite.config';

let client: Client | null = null;
let account: Account | null = null;
let databases: Databases | null = null;

export function getAppwriteClient() {
  if (!client) {
    if (!appwriteConfig.endpoint || !appwriteConfig.projectId) {
      throw new Error('Appwrite env variables are missing');
    }

    client = new Client()
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId);

    account = new Account(client);
    databases = new Databases(client);
  }
  return { client, account, databases };
}
