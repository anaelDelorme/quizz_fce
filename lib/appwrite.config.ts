export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: '697e0c28003d5d3f4cfc',
  collections: {
    categories: 'categories',
    questions: 'questions',
    profiles: 'profiles',
    resultats: 'resultats',
    stats_par_categorie: 'stats_par_categorie'
  }
};
