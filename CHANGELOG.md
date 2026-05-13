# CHANGELOG

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