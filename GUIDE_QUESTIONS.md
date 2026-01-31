# 📝 Guide : Ajouter des Questions Manuellement dans Appwrite

## 🎯 Prérequis
- Avoir créé au moins une catégorie
- Avoir accès à la console Appwrite

## 📋 Étapes

### 1. Créer une Catégorie (si pas déjà fait)

1. Allez dans **Appwrite Console**
2. Sélectionnez votre projet **FCE - Quizz**
3. Cliquez sur **Databases** → **quiz_app**
4. Cliquez sur la collection **categories**
5. Cliquez sur **Create Document**
6. Remplissez :
   - `nom` : ex. "Culture générale"
7. **Notez l'ID** de la catégorie créée (vous en aurez besoin)

### 2. Ajouter une Question

1. Dans la collection **questions**
2. Cliquez sur **Create Document**
3. Remplissez les champs :

#### Exemple de question complète :

**texte** :
\`\`\`
Quelle est la capitale de la France ?
\`\`\`

**categorie_id** :
\`\`\`
[Collez l'ID de votre catégorie ici]
Exemple : 6543a12b000c8d9f4e01
\`\`\`

**reponses** (⚠️ IMPORTANT : Format JSON) :
\`\`\`json
["Paris", "Londres", "Berlin", "Madrid"]
\`\`\`

**bonne_reponse** (index de la bonne réponse, commence à 0) :
\`\`\`
0
\`\`\`
(0 = Paris, 1 = Londres, 2 = Berlin, 3 = Madrid)

**difficulte** :
\`\`\`
facile
\`\`\`
(Choisir : facile, moyen, ou difficile)

4. Cliquez sur **Create**

## ⚠️ Points d'attention

### Format du champ "reponses"
Le champ `reponses` DOIT être un **tableau JSON valide** :

✅ **CORRECT** :
\`\`\`json
["Réponse A", "Réponse B", "Réponse C", "Réponse D"]
\`\`\`

❌ **INCORRECT** :
\`\`\`
Réponse A, Réponse B, Réponse C, Réponse D
\`\`\`

### Index de bonne_reponse
Les index commencent à **0** :
- 0 = première réponse
- 1 = deuxième réponse
- 2 = troisième réponse
- 3 = quatrième réponse

### Difficulté
Uniquement ces 3 valeurs :
- `facile`
- `moyen`
- `difficile`

## 📚 Templates de Questions

### Template Culture Générale
\`\`\`
texte: "Qui a peint la Joconde ?"
categorie_id: [ID de "Culture générale"]
reponses: ["Michel-Ange", "Léonard de Vinci", "Raphaël", "Donatello"]
bonne_reponse: 1
difficulte: facile
\`\`\`

### Template Sport
\`\`\`
texte: "Combien de joueurs composent une équipe de football ?"
categorie_id: [ID de "Sport"]
reponses: ["9", "10", "11", "12"]
bonne_reponse: 2
difficulte: facile
\`\`\`

### Template Sciences
\`\`\`
texte: "Quelle est la formule chimique de l'eau ?"
categorie_id: [ID de "Sciences"]
reponses: ["H2O", "CO2", "O2", "H2O2"]
bonne_reponse: 0
difficulte: facile
\`\`\`

### Template Histoire
\`\`\`
texte: "En quelle année a eu lieu la Révolution française ?"
categorie_id: [ID de "Histoire"]
reponses: ["1789", "1799", "1815", "1848"]
bonne_reponse: 0
difficulte: moyen
\`\`\`

### Template Géographie
\`\`\`
texte: "Quel est le plus grand océan du monde ?"
categorie_id: [ID de "Géographie"]
reponses: ["Océan Atlantique", "Océan Indien", "Océan Pacifique", "Océan Arctique"]
bonne_reponse: 2
difficulte: facile
\`\`\`

### Template Cinéma
\`\`\`
texte: "Qui a réalisé le film Titanic ?"
categorie_id: [ID de "Cinéma"]
reponses: ["Steven Spielberg", "James Cameron", "Martin Scorsese", "Christopher Nolan"]
bonne_reponse: 1
difficulte: facile
\`\`\`

### Template Musique
\`\`\`
texte: "Qui a chanté 'Thriller' ?"
categorie_id: [ID de "Musique"]
reponses: ["Prince", "Michael Jackson", "Elvis Presley", "Madonna"]
bonne_reponse: 1
difficulte: facile
\`\`\`

## 🔍 Vérification

Après avoir ajouté une question, vérifiez :
1. Le champ `reponses` est bien au format JSON
2. L'index `bonne_reponse` correspond bien à la bonne réponse
3. La `difficulte` est bien écrite (facile/moyen/difficile)
4. Le `categorie_id` existe bien dans la collection categories

## 💡 Astuce : Ajout en masse

Pour ajouter plusieurs questions rapidement :
1. Préparez-les dans un fichier texte avec le format ci-dessus
2. Copiez-collez chaque champ pour chaque question
3. Ou utilisez le script `seed-data.ts` pour automatiser

## 🚨 Erreurs Communes

### "Invalid JSON"
Vérifiez que :
- Les guillemets sont bien doubles `"` et non simples `'`
- Il n'y a pas de virgule après le dernier élément
- Les crochets `[]` sont bien présents

### Question n'apparaît pas dans l'app
Vérifiez que :
- La catégorie existe
- Le `categorie_id` est correct
- Les permissions de lecture sont configurées (Read: Any)

### Mauvaise réponse marquée comme correcte
Vérifiez que :
- L'index `bonne_reponse` correspond bien (commence à 0)
- L'ordre des réponses dans le JSON est correct

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les permissions Appwrite
3. Vérifiez le format exact des données
4. Essayez d'abord avec le script seed-data.ts pour voir le format

Bon ajout de questions ! 🎉
