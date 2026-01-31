import { ID, Query } from 'appwrite';
import { appwriteConfig } from './appwrite.config';
import { Question, QuizConfig } from '@/types';
import { getAppwriteClient } from './appwrite';

export const quizService = {
  async getCategories(): Promise<{ $id: string; nom: string }[]> {
    try {
      const { databases } = getAppwriteClient();
      if (!databases) throw new Error('Appwrite databases not initialized');

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.categories,
        []
      );
      // Mapper les documents pour avoir exactement $id et nom
      console.log('Docs récupérées:', response.documents);
      return response.documents.map(doc => ({
        $id: doc.$id,
        nom: doc.nom // ⚠ ici doc.nom doit exister dans Appwrite
      }));
    } catch (error) {
      console.error('Erreur récupération catégories:', error);
      return [];
    }
  },

  async getRandomQuestions(config: QuizConfig): Promise<Question[]> {
    try {
      const { databases } = getAppwriteClient();
      if (!databases) throw new Error('Appwrite databases not initialized');

      const queries: any[] = [];
      if (config.mode === 'categorie' && config.categorieId) {
        queries.push(Query.equal('categorie_id', config.categorieId));
      }

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.questions,
        queries
      );

      const shuffled = response.documents.sort(() => Math.random() - 0.5);

      return shuffled.slice(0, config.nombreQuestions).map(doc => ({
        $id: doc.$id,
        texte: doc.texte,
        categorie_id: doc.categorie_id,
        reponses: doc.reponses,
        bonne_reponse: doc.bonne_reponse,
        difficulte: doc.difficulte
      }));
    } catch (error) {
      console.error('Erreur récupération questions:', error);
      return [];
    }
  },

  async saveResult(
    userId: string,
    score: number,
    totalQuestions: number,
    wrongQuestions: string[],
    categorieId?: string,
    durationSeconds?: number
  ) {
    try {
      const { databases } = getAppwriteClient();
      if (!databases) throw new Error('Appwrite databases not initialized');

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.resultats,
        ID.unique(),
        {
          user_id: userId,
          score,
          total_questions: totalQuestions,
          questions_ratees: JSON.stringify(wrongQuestions),
          categorie_id: categorieId || null,
          duree_secondes: durationSeconds || 0
        }
      );

      await this.updateProfileStats(userId, score, totalQuestions, categorieId);
    } catch (error) {
      console.error('Erreur sauvegarde résultat:', error);
    }
  },

  async updateProfileStats(userId: string, score: number, totalQuestions: number, categorieId?: string) {
    try {
      const { databases } = getAppwriteClient();
      if (!databases) throw new Error('Appwrite databases not initialized');

      const profiles = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.profiles,
        [Query.equal('user_id', userId)]
      );

      if (!profiles.documents.length) return;

      const profile = profiles.documents[0];
      const nouvellesBonnesReponses = profile.total_bonnes_reponses + score;
      const nouvellesReponses = profile.total_reponses + totalQuestions;
      const nouveauPourcentage = (nouvellesBonnesReponses / nouvellesReponses) * 100;

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.profiles,
        profile.$id,
        {
          total_quiz_joues: profile.total_quiz_joues + 1,
          meilleur_score: Math.max(profile.meilleur_score, score),
          total_bonnes_reponses: nouvellesBonnesReponses,
          total_reponses: nouvellesReponses,
          pourcentage_reussite: nouveauPourcentage,
          derniere_activite: new Date().toISOString()
        }
      );

      if (categorieId) {
        await this.updateCategoryStats(userId, categorieId, score, totalQuestions);
      }
    } catch (error) {
      console.error('Erreur mise à jour stats:', error);
    }
  },

  async updateCategoryStats(userId: string, categorieId: string, score: number, totalQuestions: number) {
    try {
      const { databases } = getAppwriteClient();
      if (!databases) throw new Error('Appwrite databases not initialized');

      const stats = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.stats_par_categorie,
        [
          Query.equal('user_id', userId),
          Query.equal('categorie_id', categorieId)
        ]
      );

      const bonnesReponses = score;

      if (!stats.documents.length) {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.stats_par_categorie,
          ID.unique(),
          {
            user_id: userId,
            categorie_id: categorieId,
            quiz_joues: 1,
            bonnes_reponses: bonnesReponses,
            total_reponses: totalQuestions,
            pourcentage_reussite: (bonnesReponses / totalQuestions) * 100,
            meilleur_score: score
          }
        );
      } else {
        const stat = stats.documents[0];
        const nouvellesBonnesReponses = stat.bonnes_reponses + bonnesReponses;
        const nouvellesReponses = stat.total_reponses + totalQuestions;

        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.stats_par_categorie,
          stat.$id,
          {
            quiz_joues: stat.quiz_joues + 1,
            bonnes_reponses: nouvellesBonnesReponses,
            total_reponses: nouvellesReponses,
            pourcentage_reussite: (nouvellesBonnesReponses / nouvellesReponses) * 100,
            meilleur_score: Math.max(stat.meilleur_score, score)
          }
        );
      }
    } catch (error) {
      console.error('Erreur mise à jour stats catégorie:', error);
    }
  },

  async getUserResults(userId: string) {
    try {
      const { databases } = getAppwriteClient();
      if (!databases) throw new Error('Appwrite databases not initialized');

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.resultats,
        [
          Query.equal('user_id', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Erreur récupération résultats:', error);
      return [];
    }
  },

  async getWrongQuestions(userId: string) {
    try {
      const { databases } = getAppwriteClient();
      if (!databases) throw new Error('Appwrite databases not initialized');

      const results = await this.getUserResults(userId);
      const wrongQuestionIds = new Set<string>();

      results.forEach((result: any) => {
        const questions = JSON.parse(result.questions_ratees || '[]');
        questions.forEach((id: string) => wrongQuestionIds.add(id));
      });

      if (!wrongQuestionIds.size) return [];

      const questions = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.questions,
        [Query.limit(100)]
      );

      return questions.documents.filter((q: any) => wrongQuestionIds.has(q.$id));
    } catch (error) {
      console.error('Erreur récupération questions ratées:', error);
      return [];
    }
  }
};
