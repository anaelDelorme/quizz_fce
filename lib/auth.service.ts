import { ID } from 'appwrite';
import { getAppwriteClient } from './appwrite';
import { appwriteConfig } from './appwrite.config';

export const authService = {
  async register(email: string, password: string, pseudo: string) {
    try {
      const { account, databases } = getAppwriteClient(); // <-- ici
      if (!account) throw new Error('Appwrite account not initialized');

      const user = await account.create(ID.unique(), email, password, pseudo);

      // Créer le profil
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.profiles,
        ID.unique(),
        {
          user_id: user.$id,
          pseudo: pseudo,
          type_compte: 'abonne',
          total_quiz_joues: 0,
          meilleur_score: 0,
          total_bonnes_reponses: 0,
          total_reponses: 0,
          pourcentage_reussite: 0,
          derniere_activite: new Date().toISOString()
        }
      );

      // Se connecter automatiquement après l'inscription
      await account.createEmailPasswordSession(email, password);

      return user;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      const { account } = getAppwriteClient();
      if (!account) throw new Error('Appwrite account not initialized');

      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const { account } = getAppwriteClient();
      if (!account) throw new Error('Appwrite account not initialized');

      await account.deleteSession('current');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const { account } = getAppwriteClient();
      if (!account) return null;

      return await account.get();
    } catch (error) {
      return null;
    }
  },

  async getCurrentProfile() {
    try {
      const { databases } = getAppwriteClient();
      const user = await this.getCurrentUser();
      if (!user) return null;

      const profiles = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.profiles,
        []
      );

      return profiles.documents.find((p: any) => p.user_id === user.$id) || null;
    } catch (error) {
      console.error('Erreur récupération profil:', error);
      return null;
    }
  }
};
