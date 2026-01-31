# 🚀 Guide de Démarrage Rapide - Quiz Master

## ✅ Prérequis

Vous devez avoir :
- ✅ Node.js 18+ installé
- ✅ Un compte Appwrite configuré
- ✅ Les collections Appwrite créées (voir ci-dessous)

## 📋 Checklist Appwrite

### 1. Database créée
- Nom: `quiz_app`
- ID: `697e0c28003d5d3f4cfc`

### 2. Collections créées avec les bons attributs

#### Collection `categories` (ID: categories)
- [x] `nom` - String, required, size: 100

#### Collection `questions` (ID: questions)
- [x] `texte` - String, required, size: 500
- [x] `categorie_id` - String, size: 50
- [x] `reponses` - String, size: 1000
- [x] `bonne_reponse` - Integer
- [x] `difficulte` - String, enum: facile/moyen/difficile

#### Collection `profiles` (ID: profiles)
- [x] `user_id` - String, required, size: 50
- [x] `pseudo` - String, size: 50
- [x] `type_compte` - String, enum: invite/abonne
- [x] `total_quiz_joues` - Integer, default: 0
- [x] `meilleur_score` - Integer, default: 0
- [x] `total_bonnes_reponses` - Integer, default: 0
- [x] `total_reponses` - Integer, default: 0
- [x] `pourcentage_reussite` - Float, default: 0
- [x] `derniere_activite` - DateTime

#### Collection `resultats` (ID: resultats)
- [x] `user_id` - String, required, size: 50
- [x] `score` - Integer
- [x] `total_questions` - Integer
- [x] `questions_ratees` - String, size: 2000
- [x] `categorie_id` - String, size: 50
- [x] `duree_secondes` - Integer

#### Collection `stats_par_categorie` (ID: stats_par_categorie)
- [x] `user_id` - String, required, size: 50
- [x] `categorie_id` - String, required, size: 50
- [x] `quiz_joues` - Integer, default: 0
- [x] `bonnes_reponses` - Integer, default: 0
- [x] `total_reponses` - Integer, default: 0
- [x] `pourcentage_reussite` - Float, default: 0
- [x] `meilleur_score` - Integer, default: 0

### 3. Permissions configurées

Pour TOUTES les collections, configurez les permissions :
- **Create** : Users (utilisateurs connectés)
- **Read** : Any (tout le monde)
- **Update** : Users (utilisateurs connectés)
- **Delete** : Users (utilisateurs connectés)

Exception pour `profiles` et `resultats` :
- **Update/Delete** : Uniquement le propriétaire (owner)

## 🎯 Démarrage

### Étape 1 : Installation
\`\`\`bash
cd quiz-app
npm install
\`\`\`

### Étape 2 : Vérifier .env.local
Le fichier `.env.local` existe déjà avec vos identifiants Appwrite.

### Étape 3 : Ajouter des données de test (optionnel)
\`\`\`bash
npx ts-node scripts/seed-data.ts
\`\`\`

Ce script va créer :
- 7 catégories (Culture générale, Sport, Sciences, Histoire, Géographie, Cinéma, Musique)
- 20 questions de test

### Étape 4 : Lancer l'application
\`\`\`bash
npm run dev
\`\`\`

Ouvrez http://localhost:3000

## 🎮 Première utilisation

1. **Sans compte (invité)** :
   - Cliquez sur "Jouer" depuis la page d'accueil
   - Choisissez votre mode de jeu
   - Jouez ! (Les résultats ne seront pas sauvegardés)

2. **Avec compte** :
   - Cliquez sur "Inscription"
   - Créez votre compte
   - Profitez de toutes les fonctionnalités !

## 🏆 Fonctionnalités disponibles

### Mode Invité
- ✅ Jouer aux quiz
- ✅ Voir les résultats immédiats
- ✅ Consulter les classements
- ❌ Pas d'historique sauvegardé
- ❌ Pas de statistiques

### Mode Abonné
- ✅ Tout ce que fait l'invité +
- ✅ Historique des quiz
- ✅ Statistiques détaillées
- ✅ Graphiques de progression
- ✅ Liste des questions ratées
- ✅ Position dans les classements

## 🐛 Problèmes courants

### L'application ne charge pas
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que Appwrite est accessible
- Regardez la console du navigateur (F12)

### Impossible de créer un compte
- Vérifiez les permissions Appwrite
- Vérifiez que l'authentification est activée dans Appwrite

### Pas de questions affichées
- Vérifiez que les collections ont des données
- Lancez le script seed-data.ts
- Ou ajoutez manuellement des questions dans Appwrite

### Erreur "Collection not found"
- Vérifiez que tous les IDs de collections correspondent
- Les IDs doivent être : categories, questions, profiles, resultats, stats_par_categorie

## 📱 Pour aller plus loin

### Ajouter vos propres questions
1. Allez dans Appwrite Console
2. Database → quiz_app → questions
3. Create Document
4. Remplissez les champs (n'oubliez pas de formater `reponses` en JSON)

### Déployer sur Vercel
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

N'oubliez pas d'ajouter vos variables d'environnement dans Vercel !

## 📞 Support

En cas de problème, vérifiez :
1. Les logs du terminal (npm run dev)
2. La console du navigateur (F12)
3. Les permissions Appwrite
4. La structure des collections

Bon quiz ! 🎉
