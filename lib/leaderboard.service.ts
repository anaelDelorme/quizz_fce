import { Query } from 'appwrite';
import { databases } from './appwrite';
import { appwriteConfig } from './appwrite.config';
import { LeaderboardEntry } from '@/types';

export const leaderboardService = {
  async getTopPlayers(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.profiles,
        [
          Query.orderDesc('total_quiz_joues'),
          Query.limit(limit)
        ]
      );

      return response.documents.map((doc: any, index) => ({
        userId: doc.user_id,
        pseudo: doc.pseudo,
        value: doc.total_quiz_joues,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Erreur classement joueurs actifs:', error);
      return [];
    }
  },

  async getTopByCorrectAnswers(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.profiles,
        [
          Query.orderDesc('total_bonnes_reponses'),
          Query.limit(limit)
        ]
      );

      return response.documents.map((doc: any, index) => ({
        userId: doc.user_id,
        pseudo: doc.pseudo,
        value: doc.total_bonnes_reponses,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Erreur classement bonnes réponses:', error);
      return [];
    }
  },

  async getTopByWinRate(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.profiles,
        [
          Query.greaterThan('total_reponses', 20), // Minimum 20 réponses
          Query.orderDesc('pourcentage_reussite'),
          Query.limit(limit)
        ]
      );

      return response.documents.map((doc: any, index) => ({
        userId: doc.user_id,
        pseudo: doc.pseudo,
        value: Math.round(doc.pourcentage_reussite),
        pourcentage: doc.pourcentage_reussite,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Erreur classement taux de réussite:', error);
      return [];
    }
  },

  async getTopByBestScore(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.profiles,
        [
          Query.orderDesc('meilleur_score'),
          Query.limit(limit)
        ]
      );

      return response.documents.map((doc: any, index) => ({
        userId: doc.user_id,
        pseudo: doc.pseudo,
        value: doc.meilleur_score,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Erreur classement meilleur score:', error);
      return [];
    }
  },

  async getTopByCategory(
    categorieId: string,
    metric: 'quiz_joues' | 'bonnes_reponses' | 'pourcentage_reussite' | 'meilleur_score',
    limit: number = 10
  ): Promise<LeaderboardEntry[]> {
    try {
      const queries = [
        Query.equal('categorie_id', categorieId),
        Query.orderDesc(metric),
        Query.limit(limit)
      ];

      if (metric === 'pourcentage_reussite') {
        queries.unshift(Query.greaterThan('total_reponses', 10));
      }

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.stats_par_categorie,
        queries
      );

      // Récupérer les pseudos
      const userIds = response.documents.map((doc: any) => doc.user_id);
      const profiles = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.profiles,
        [Query.limit(100)]
      );

      const profileMap = new Map(
        profiles.documents.map((p: any) => [p.user_id, p.pseudo])
      );

      return response.documents.map((doc: any, index) => ({
        userId: doc.user_id,
        pseudo: profileMap.get(doc.user_id) || 'Anonyme',
        value: metric === 'pourcentage_reussite' 
          ? Math.round(doc[metric])
          : doc[metric],
        pourcentage: metric === 'pourcentage_reussite' ? doc[metric] : undefined,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Erreur classement par catégorie:', error);
      return [];
    }
  },

  async getUserRank(userId: string): Promise<{
    globalRank: number;
    totalPlayers: number;
  }> {
    try {
      const allProfiles = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.profiles,
        [Query.orderDesc('total_quiz_joues'), Query.limit(1000)]
      );

      const rank = allProfiles.documents.findIndex((p: any) => p.user_id === userId) + 1;

      return {
        globalRank: rank || 0,
        totalPlayers: allProfiles.total
      };
    } catch (error) {
      console.error('Erreur récupération rang:', error);
      return { globalRank: 0, totalPlayers: 0 };
    }
  }
};
