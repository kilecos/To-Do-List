# CHANGELOG

## [v1.2.1] - 2026-05-19
### Modifié
- Modification de la fonctionnalité de fermeture de l'input titre pour la gestion de l'évènement de clic pour amélioration de performance

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