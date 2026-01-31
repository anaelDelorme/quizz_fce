/**
 * Script pour ajouter des données de test dans Appwrite
 * 
 * Usage:
 * 1. Assurez-vous que votre .env.local est configuré
 * 2. Installez ts-node: npm install -g ts-node
 * 3. Lancez: ts-node scripts/seed-data.ts
 */

import { Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);
const databaseId = '697e0c28003d5d3f4cfc';

// Catégories
const categories = [
  { nom: 'Culture générale' },
  { nom: 'Sport' },
  { nom: 'Sciences' },
  { nom: 'Histoire' },
  { nom: 'Géographie' },
  { nom: 'Cinéma' },
  { nom: 'Musique' },
];

// Questions par catégorie
const questions = [
  // Culture générale
  {
    texte: "Quelle est la capitale de la France ?",
    categorie: "Culture générale",
    reponses: ["Paris", "Londres", "Berlin", "Madrid"],
    bonne_reponse: 0,
    difficulte: "facile"
  },
  {
    texte: "Combien y a-t-il de continents sur Terre ?",
    categorie: "Culture générale",
    reponses: ["5", "6", "7", "8"],
    bonne_reponse: 2,
    difficulte: "facile"
  },
  {
    texte: "Qui a peint la Joconde ?",
    categorie: "Culture générale",
    reponses: ["Michel-Ange", "Léonard de Vinci", "Raphaël", "Donatello"],
    bonne_reponse: 1,
    difficulte: "facile"
  },
  
  // Sport
  {
    texte: "Combien de joueurs composent une équipe de football sur le terrain ?",
    categorie: "Sport",
    reponses: ["9", "10", "11", "12"],
    bonne_reponse: 2,
    difficulte: "facile"
  },
  {
    texte: "Dans quel sport utilise-t-on une raquette et un volant ?",
    categorie: "Sport",
    reponses: ["Tennis", "Badminton", "Squash", "Ping-pong"],
    bonne_reponse: 1,
    difficulte: "facile"
  },
  {
    texte: "Qui a remporté le plus de Ballons d'Or ?",
    categorie: "Sport",
    reponses: ["Cristiano Ronaldo", "Lionel Messi", "Pelé", "Maradona"],
    bonne_reponse: 1,
    difficulte: "moyen"
  },
  
  // Sciences
  {
    texte: "Quelle est la formule chimique de l'eau ?",
    categorie: "Sciences",
    reponses: ["H2O", "CO2", "O2", "H2O2"],
    bonne_reponse: 0,
    difficulte: "facile"
  },
  {
    texte: "Combien de planètes y a-t-il dans le système solaire ?",
    categorie: "Sciences",
    reponses: ["7", "8", "9", "10"],
    bonne_reponse: 1,
    difficulte: "facile"
  },
  {
    texte: "Quelle est la vitesse de la lumière dans le vide ?",
    categorie: "Sciences",
    reponses: ["300 000 km/s", "150 000 km/s", "500 000 km/s", "1 000 000 km/s"],
    bonne_reponse: 0,
    difficulte: "moyen"
  },
  
  // Histoire
  {
    texte: "En quelle année a eu lieu la Révolution française ?",
    categorie: "Histoire",
    reponses: ["1789", "1799", "1815", "1848"],
    bonne_reponse: 0,
    difficulte: "facile"
  },
  {
    texte: "Qui était le premier empereur de Rome ?",
    categorie: "Histoire",
    reponses: ["Jules César", "Auguste", "Néron", "Trajan"],
    bonne_reponse: 1,
    difficulte: "moyen"
  },
  {
    texte: "Quelle guerre mondiale a duré de 1939 à 1945 ?",
    categorie: "Histoire",
    reponses: ["Première Guerre mondiale", "Seconde Guerre mondiale", "Guerre froide", "Guerre de Cent Ans"],
    bonne_reponse: 1,
    difficulte: "facile"
  },
  
  // Géographie
  {
    texte: "Quel est le plus grand océan du monde ?",
    categorie: "Géographie",
    reponses: ["Océan Atlantique", "Océan Indien", "Océan Pacifique", "Océan Arctique"],
    bonne_reponse: 2,
    difficulte: "facile"
  },
  {
    texte: "Quelle est la plus haute montagne du monde ?",
    categorie: "Géographie",
    reponses: ["Mont Blanc", "K2", "Everest", "Kilimandjaro"],
    bonne_reponse: 2,
    difficulte: "facile"
  },
  {
    texte: "Combien de pays composent l'Union Européenne en 2024 ?",
    categorie: "Géographie",
    reponses: ["25", "27", "28", "30"],
    bonne_reponse: 1,
    difficulte: "moyen"
  },
  
  // Cinéma
  {
    texte: "Qui a réalisé le film 'Titanic' ?",
    categorie: "Cinéma",
    reponses: ["Steven Spielberg", "James Cameron", "Martin Scorsese", "Christopher Nolan"],
    bonne_reponse: 1,
    difficulte: "facile"
  },
  {
    texte: "Quel film a remporté le plus d'Oscars ?",
    categorie: "Cinéma",
    reponses: ["Le Seigneur des Anneaux", "Titanic", "Ben-Hur", "Tous les trois ex-aequo"],
    bonne_reponse: 3,
    difficulte: "difficile"
  },
  {
    texte: "Dans quel film retrouve-t-on la réplique 'May the Force be with you' ?",
    categorie: "Cinéma",
    reponses: ["Star Trek", "Star Wars", "Interstellar", "Avatar"],
    bonne_reponse: 1,
    difficulte: "facile"
  },
  
  // Musique
  {
    texte: "Qui a chanté 'Thriller' ?",
    categorie: "Musique",
    reponses: ["Prince", "Michael Jackson", "Elvis Presley", "Madonna"],
    bonne_reponse: 1,
    difficulte: "facile"
  },
  {
    texte: "Quel groupe britannique a chanté 'Bohemian Rhapsody' ?",
    categorie: "Musique",
    reponses: ["The Beatles", "The Rolling Stones", "Queen", "Led Zeppelin"],
    bonne_reponse: 2,
    difficulte: "facile"
  },
  {
    texte: "Combien de cordes possède une guitare standard ?",
    categorie: "Musique",
    reponses: ["4", "5", "6", "7"],
    bonne_reponse: 2,
    difficulte: "facile"
  },
];

async function seedData() {
  console.log('🌱 Début de l\'ajout des données de test...');

  try {
    // Créer les catégories
    console.log('\n📁 Création des catégories...');
    const categoryMap = new Map<string, string>();

    for (const cat of categories) {
      try {
        const result = await databases.createDocument(
          databaseId,
          'categories',
          ID.unique(),
          cat
        );
        categoryMap.set(cat.nom, result.$id);
        console.log(`✅ Catégorie créée: ${cat.nom}`);
      } catch (error: any) {
        console.log(`⚠️  Catégorie déjà existante ou erreur: ${cat.nom}`);
      }
    }

    // Créer les questions
    console.log('\n❓ Création des questions...');
    let successCount = 0;

    for (const question of questions) {
      try {
        const categorieId = categoryMap.get(question.categorie);
        if (!categorieId) {
          console.log(`⚠️  Catégorie non trouvée pour: ${question.categorie}`);
          continue;
        }

        await databases.createDocument(
          databaseId,
          'questions',
          ID.unique(),
          {
            texte: question.texte,
            categorie_id: categorieId,
            reponses: JSON.stringify(question.reponses),
            bonne_reponse: question.bonne_reponse,
            difficulte: question.difficulte
          }
        );
        successCount++;
        console.log(`✅ Question créée: ${question.texte.substring(0, 50)}...`);
      } catch (error: any) {
        console.log(`❌ Erreur pour la question: ${question.texte.substring(0, 50)}...`);
      }
    }

    console.log(`\n🎉 Terminé ! ${successCount} questions ajoutées sur ${questions.length}`);
    console.log('\n💡 Vous pouvez maintenant lancer l\'application avec: npm run dev');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

seedData();
