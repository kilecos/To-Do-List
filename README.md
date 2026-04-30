# Ma To-Do List

Une application afin de créer une liste de tâches.
L'utilisateur peut renseigner différentes tâches, leur donner des "niveaux" de priorité, les éditer, les valider et les supprimer.
Réalisée en HTML, CSS et TypeScript.

![Aperçu de l'appli](/public/preview.png)

## Fonctionnalités :

- ➕ Ajout de tâches avec un titre et un niveau de priorité (si besoin)
- 📝 Modification du titre de la liste
- 📝 Edition de tâches (changement de titre ou de niveau de priorité)
- ✅ Validation et suppresion de chaque tâche individuellement
- 🪧 Affichage des tâches terminées par rapport au nombre total de tâches
- ❌ Réinitialisation complète de la liste de tâche avec fenêtre modale de confirmation avant effacement complet
- 🗄️ Possibilité de filtrer l'affichage des tâches pour afficher uniquement les tâches en cours, les tâches terminées ou toutes les tâches
- 🗂️ Classement des tâches en fonction d'abord de leur priorité puis par ordre chronologique de leur ajout
- 🎨 Affichage d'un code couleur pour visualiser la priorité de chaque tâche
- 💾 Enregistrement de la liste sur le localStorage pour ne pas la perdre lors d'une actualisation ou fermeture de l'application

## Technologies :

- HTML5 / CSS3
- TypeScript
- Vite

## Démo en ligne :

👉 [Tester l'appli](https://kilecos.github.io/To-Do-List/)

## Lancer en local :

1. Cloner le dépôt
2. Ouvrir dans VS Code
3. Lancer avec les commandes suivantes :
   - npm install
   - npm run dev