# 📁 Structure du Projet Quiz Master

## 📂 Organisation des dossiers

\`\`\`
quiz-app/
├── app/                      # Pages Next.js (App Router)
│   ├── page.tsx             # 🏠 Page d'accueil
│   ├── layout.tsx           # Layout principal
│   ├── globals.css          # Styles globaux
│   ├── play/
│   │   └── page.tsx         # 🎮 Sélection du mode de quiz
│   ├── quiz/
│   │   └── page.tsx         # ❓ Interface de quiz (questions/réponses)
│   ├── leaderboard/
│   │   └── page.tsx         # 🏆 Classements
│   ├── dashboard/
│   │   └── page.tsx         # 📊 Tableau de bord utilisateur
│   ├── login/
│   │   └── page.tsx         # 🔐 Connexion
│   └── register/
│       └── page.tsx         # ✍️ Inscription
│
├── lib/                      # Services & logique métier
│   ├── appwrite.ts          # 🔧 Client Appwrite
│   ├── appwrite.config.ts   # ⚙️ Configuration Appwrite (IDs)
│   ├── auth.service.ts      # 🔒 Service d'authentification
│   ├── quiz.service.ts      # 🎯 Service de gestion des quiz
│   └── leaderboard.service.ts # 🏅 Service des classements
│
├── types/
│   └── index.ts             # 📝 Types TypeScript
│
├── scripts/
│   └── seed-data.ts         # 🌱 Script pour ajouter données de test
│
├── .env.local               # 🔑 Variables d'environnement
├── package.json             # 📦 Dépendances
├── tsconfig.json            # ⚙️ Configuration TypeScript
├── tailwind.config.ts       # 🎨 Configuration Tailwind
├── next.config.mjs          # ⚙️ Configuration Next.js
└── README.md                # 📖 Documentation

\`\`\`

## 🎯 Flux de l'application

### 1️⃣ Page d'accueil (/)
- Affiche menu principal
- Vérifie si utilisateur connecté
- Options : Jouer, Classements, Connexion/Inscription

### 2️⃣ Sélection du quiz (/play)
- Choix du mode : Rapide / Catégorie / Global
- Sélection du nombre de questions (5 ou 10)
- Sélection de la catégorie (si mode catégorie)

### 3️⃣ Quiz (/quiz)
- Affiche questions une par une
- Animations sur sélection
- Feedback immédiat (correct/incorrect)
- Confettis pour bonnes réponses
- Calcul du score et du temps

### 4️⃣ Résultats
- Affichage du score final
- Pourcentage de réussite
- Options : Rejouer ou Retour accueil
- Sauvegarde en BDD si connecté

### 5️⃣ Dashboard (/dashboard)
- Statistiques personnelles
- Historique des quiz
- Questions ratées à réviser
- Position dans les classements

### 6️⃣ Classements (/leaderboard)
- 4 types de classements
- Filtrage par catégorie
- Podium animé pour le top 3
- Liste complète

## 🔧 Services

### authService
- `register()` - Inscription
- `login()` - Connexion
- `logout()` - Déconnexion
- `getCurrentUser()` - Utilisateur actuel
- `getCurrentProfile()` - Profil actuel

### quizService
- `getCategories()` - Liste des catégories
- `getRandomQuestions()` - Questions aléatoires
- `saveResult()` - Sauvegarder résultat
- `updateProfileStats()` - MAJ statistiques
- `getUserResults()` - Historique utilisateur
- `getWrongQuestions()` - Questions ratées

### leaderboardService
- `getTopPlayers()` - Plus actifs
- `getTopByCorrectAnswers()` - Champions
- `getTopByWinRate()` - Élite (%)
- `getTopByBestScore()` - Hall of Fame
- `getTopByCategory()` - Classement par catégorie
- `getUserRank()` - Position utilisateur

## 🎨 Design System

### Couleurs principales
- **Purple/Blue gradient** : Arrière-plans
- **Green/Blue** : Actions principales
- **Yellow/Orange** : Podiums, succès
- **Red** : Erreurs, mauvaises réponses
- **Pink/Purple** : Accents, boutons secondaires

### Composants réutilisables
- **StatCard** : Cartes de statistiques
- **MenuCard** : Cartes de menu
- **ModeCard** : Cartes de sélection de mode
- **PodiumPlace** : Composant podium
- **TypeButton** : Boutons de type de classement
- **ResultScreen** : Écran de résultats

### Animations (Framer Motion)
- Transitions de page
- Cartes qui se retournent
- Confettis
- Particules en arrière-plan
- Hover effects
- Scale animations

## 🔐 Authentification & Permissions

### Modes utilisateur
1. **Invité** : Peut jouer, voir classements
2. **Abonné** : Tout + historique + stats + dashboard

### Permissions Appwrite
- **Read** : Any (tout le monde)
- **Create/Update/Delete** : Users (connectés uniquement)
- **Résultats/Profiles** : Owner only

## 📊 Base de données

### Relations
- `questions.categorie_id` → `categories.$id`
- `profiles.user_id` → `auth.users.$id`
- `resultats.user_id` → `auth.users.$id`
- `stats_par_categorie.user_id` → `auth.users.$id`
- `stats_par_categorie.categorie_id` → `categories.$id`

### Indexes recommandés
- `resultats.user_id`
- `questions.categorie_id`
- `stats_par_categorie` : compound (user_id + categorie_id)

## 🚀 Déploiement

### Variables d'environnement requises
\`\`\`
NEXT_PUBLIC_APPWRITE_PROJECT_ID
NEXT_PUBLIC_APPWRITE_PROJECT_NAME
NEXT_PUBLIC_APPWRITE_ENDPOINT
\`\`\`

### Étapes Vercel
1. Push code sur GitHub
2. Importer projet sur Vercel
3. Ajouter variables d'environnement
4. Deploy !

## 📱 Responsive Design

- **Mobile** : Layout vertical, menus empilés
- **Tablet** : Grid 2 colonnes
- **Desktop** : Grid 3-4 colonnes, pleine largeur

## 🎯 Prochaines fonctionnalités possibles

- [ ] Timer par question
- [ ] Mode multijoueur
- [ ] Badges et achievements
- [ ] Partage de scores sur réseaux sociaux
- [ ] Quiz personnalisés par utilisateur
- [ ] Défis entre amis
- [ ] Mode survie (jusqu'à la première erreur)
- [ ] Thèmes de couleur personnalisables
- [ ] Support multilingue
- [ ] Version Android native avec React Native

## 🐛 Debugging

### Console du navigateur (F12)
- Network : Vérifier les appels API
- Console : Voir les erreurs JavaScript
- Application : Vérifier localStorage

### Logs Appwrite
- Aller dans Console Appwrite
- Logs de la Database
- Vérifier permissions et queries

### Erreurs communes
- **401 Unauthorized** : Problème d'authentification
- **404 Not Found** : Collection ID incorrect
- **403 Forbidden** : Problème de permissions
- **500 Server Error** : Vérifier structure données

## 💡 Best Practices

1. **Toujours valider les données** avant envoi à Appwrite
2. **Gérer les erreurs** avec try/catch
3. **Afficher des loaders** pendant les requêtes
4. **Optimiser les images** pour performances
5. **Tester sur mobile** régulièrement
6. **Commenter le code** pour futures modifications
