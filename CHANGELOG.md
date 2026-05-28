# CHANGELOG

## [v1.4.4] - 2026-05-28
### Modifié
- Extraction de la vérification et validation des données d'un fichier importé dans une fonction séparée de la fonction d'import

## [v1.4.3] - 2026-05-27
### Modifié
- Modifications visuelles sur les contenus de la fenêtre modale d'import/export de liste

### Tests
- Ajout des tests unitaires pour les fonctions de taches.ts
- Ajout de test unitaire pour storage.ts

## [v1.4.2] - 2026-05-22
### Modifié
- Modifications sur la fonctionnalité d'import/export :
  - Inclusion du titre dans l'export JSON et texte
  - Restauration du titre à l'import
  - Fallback sur le titre par défaut si absent

## [v1.4.1] - 2026-05-21
### Modifié
- Ajustement rendu visuel des tâches dans le fichier .txt issue de la fonction export

## [v1.4.0] - 2026-05-21
### Ajouté
- Ajout de la fonctionnalité d'importer et d'exporter les listes de tâches sur ordinateur :
  - Ajout d'un bouton sur l'application pour ouvrir une fenêtre modale porposant d'importer ou d'exporter une liste
  - Possibilité d'importer un fichier .json depuis l'ordinateur contenant une liste de tâches précédemment exportée
  - Sécurité sur l'import de fichier contrôlant le format du fichier ainsi que si son contenu correspond à ce qui est demandé dans l'application
  - Possibilité d'exporter une liste de tâches en format .json pour pouvoir l'importer par la suite
  - Possibilité d'exporter une liste de tâches en format .txt pour pouvoir la consulté directement sur l'ordinateur avec un lecteur de texte

## [v1.3.0] - 2026-05-20
### Ajouté
- Ajout de fonctionnalité pour l'accessibilité :
  - Ajout de l'attribut aria-label sur l'input de saisie du titre de tâche, le sélecteur de priorité du formulaire et le sélecteur filtre des tâches à afficher
  - Ajout de l'attribut ariaLabel sur l'input de saisie du titre de la liste
  - Ajout de aria-live = "polite" sur le compteur de tâches qui se met à jour dynamiquement

## [v1.2.2] - 2026-05-19
### Modifié
- Modification de la génération d'ID de tâches :
  - Changement de Date.now() à crypto.randomUUID() afin d'éviter des ID identiques si des tâches sont entrées en même temps
  - Ajustement du type de l'ID de number à string et de son utilisation dans les fonctionnalité

## [v1.2.1] - 2026-05-19
### Modifié
- Modification de la fonctionnalité de fermeture de l'input titre pour la gestion de l'évènement de clic pour amélioration de performance
- Modifications de l'écouteur d'évènement global pour les actions de tâche et des fonctions de tâches :
  - Déplacement de l'écouteur d'évènement de ui.ts à main.ts
  - Déplacement des imports des fonctions de tâches dans main.ts
  - Suppression des fonctions callbacks dans les fonctions d'action de tâches

## [v1.2.0] - 2026-05-19
### Ajouté
- Ajout de la fonctionnalité de fermeture de l'input de changement de titre si clic en dehors de celui-ci

## [v1.1.3] - 2026-05-18
### Modifié
- Modification du placeholder de l'input s'affichant lors de la demande de modification du titre de la liste pour que celui-ci soit le titre actuel de la liste

## [v1.1.2] - 2026-05-18
### Modifié
- Implémentation d'une délégation d'évènement concernant les boutons propres à chaque tâche :
  - Centralisation des évènements de clics pour les actions de tâche (valider, supprimer, éditer) sur le conteneur de la liste
  - Suppression des écouteurs d'évènement individuels de la boucle de création de tâche pour améliorer les performances

## [v1.1.1] - 2026-05-18
### Corrigé
- Correction fuite de mémoire sur les fonctionnalités concernant la fermeture du mode édition des tâches par clic en dehors ou validation de l'édition

## [v1.1.0] - 2026-05-18
### Ajouté
- Ajout de la fonctionnalité de fermeture du formulaire d'ajout de tâche lors du clic en dehors de celui-ci

## [v1.0.5] - 2026-05-18
### Modifié
- Modifications et ajustement visuels du menu d'édition de tâche sur mobile

## [v1.0.4] - 2026-05-13
### Modifié
- Ajustement padding sur le body pour descendre le footer

## [v1.0.3] - 2026-05-13
### Modifié
- Ajout d'une bordure au haut de la liste de tâches pour marquer une délimitation visuelle

## [v1.0.2] - 2026-05-13
### Modifié
- Ajustements visuels sur mobile :
  - Remise en ligne du titre de la liste et du bouton pour le modifier
  - Retrait du centrage du texte et du padding sur le bouton pour ouvrir le formulaire d'ajout de tâche

## [v1.0.1] - 2026-05-13
### Corrigé
- Correction du rendu visuel du Footer sur mobile

## [v1.0.0] - 2026-04-30
### Ajouté
- **Gestion des tâches** : Création, édition, validation (check) et suppression individuelle.
- **Système de priorité** : Attribution d'un niveau (Haute, Moyenne, Basse) avec code couleur dédié.
- **Tri intelligent** : Classement automatique par priorité, puis par ordre chronologique.
- **Persistance des données** : Sauvegarde automatique de la liste dans le `localStorage`.
- **Interface utilisateur** :
  - Modification dynamique du titre de la liste.
  - Fenêtre de confirmation avant réinitialisation complète.
  - Compteur de progression (tâches terminées vs total).
  - Système de filtrage des tâches.