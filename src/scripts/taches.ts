// Gestion des tâches de la liste

// Récupération des types, constantes, variables et fonctions dans les autres fichiers
import { listeTaches, sauvegarderTaches } from "./storage";
import type { Tache, NiveauPriorite } from "./types";


// Définition de la fonction d'ajout d'une tâche à la liste
export function ajouterTache(titre : string, priorite : NiveauPriorite) {
  // On crée la tâche entrée en respectant l'interface établie
  const nouvelleTache : Tache = {
    id : Date.now(), // donne un nombre unique basé sur l'heure
    titre,           // Le titre renseigné dans l'input
    estTerminee : false,
    priorite,        // L'option choisi dans le select du formulaire.
  };

   // On ajoute notre nouvelle tâche à notre base de données locale
  listeTaches.push(nouvelleTache);

  // On sauvegarde la nouvelle liste de tâche dans le navigateur
  sauvegarderTaches();
}

// Définition de la fonction pour valider et barrer une tache
// Elle prend en paramètre l'id de la tache sélectionné par l'utilisateur ainsi qu'une fonction de rappel qui sera exécutée après mise à jour et sauvegarde.
export function terminerTache(id : number, callbackTaches : () => void) : void {
  const tacheTrouvee = listeTaches.find(tache => tache.id === id);
  if (tacheTrouvee) {
    tacheTrouvee.estTerminee = true;  // Passage du paramètre estTerminee à true
    sauvegarderTaches();              // On sauvegarde dans le navigateur
    callbackTaches();                 // La fonction en paramètre qui sera exécutée une fois le travail terminé, ici cette fonction sera afficherTaches (voir ui.ts)
  }
}

// Définition de la fonction pour enlever une tâche de la liste
// Elle prend en paramètre l'id de la tache sélectionné par l'utilisateur ainsi qu'une fonction de rappel qui sera exécutée après mise à jour et sauvegarde.
export function supprimerTache(id : number, callbackTaches : () => void) : void {
  // On utilise filter pour garder toutes les tâches sauf celle qui a cet ID
  const tacheASupprimer = listeTaches.findIndex(tache => tache.id === id);    // On cherche dans notre liste la tâche dont l'id correspond à celui de la tâche selectionnée
  if (tacheASupprimer !== -1) {                 // Si cette tâche existe
    listeTaches.splice(tacheASupprimer, 1);     // On la retire du tableau avec la méthode .splice() qui prends en paramètre l'indice de l'élément à supprimer et le nombre d'élément à supprimer
    sauvegarderTaches();                        // On sauvegarde dans le navigateur
    callbackTaches();                           // La fonction en paramètre qui sera exécutée une fois le travail terminé, ici cette fonction sera afficherTaches (voir ui.ts)
  }
}

// Définition de la fonction de modification d'une tâche existante
// Elle va prendre en paramètre les modifications faites dans le menu d'édition de tâche (voir ui.ts)
export function editerTache(id : number, titre : string, priorite : NiveauPriorite, estTerminee : boolean, callbackTaches : () => void) : void {
  // On va chercher dans la liste de tâche celle correspondant à l'id en paramètre de la fonction
  const tacheAEditer = listeTaches.find(tache => tache.id === id);
  // Si elle existe on applique les modifications
  if (tacheAEditer) {
    // On remplace le titre et la priorité de la tâche par ceux entrés en paramètre de la fonction qui sont ceux sélectionnés dans le menu d'édition
    tacheAEditer.titre = titre;
    tacheAEditer.priorite = priorite;
    // Si la tâche était terminée avant modification, on lui retire ce statut pour la réactiver
    if (estTerminee) {
      tacheAEditer.estTerminee = false;
    }
    // On sauvegarde le tableau de tâches avec la tâche modifiée
    sauvegarderTaches();
    // On appelle notre fonction callback qui est la fonction "afficherTaches", voir ui.ts
    callbackTaches();
  }
}