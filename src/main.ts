// Gestion de l'interactivité de l'application

// Récupération des types, constantes, variables et fonctions dans les autres fichiers
import { ajouterTache } from "./scripts/taches";
import { sauvegarderTaches, listeTaches } from "./scripts/storage";
import { afficherTaches, titre, setFiltreActif } from "./scripts/ui";
import type { NiveauPriorite, FiltreTaches } from "./scripts/types";
// Importation de la version depuis le package.json
import packageJson from '../package.json';

// Récupération des éléments HTML et définition des constantes
// On utilise "as HTML..." pour bien dire à TypeScript la nature de l'élément
const btnReset = document.querySelector("#btn-reset") as HTMLButtonElement;                          // Le bouton pour effacer toutes les taches dans la liste
const btnToggleForm = document.querySelector("#btn-toggle-form") as HTMLButtonElement;               // Le bouton pour afficher ou fermer le formulaire d'entré de taches
const conteneurFormulaire = document.querySelector("#conteneur-formulaire") as HTMLFormElement;      // Le formulaire d'entré de taches
const confirmModal = document.querySelector("#modal-confirm") as HTMLDialogElement;                  // La fenêtre de confirmation qui s'affichera lors de l'utilisation du bouton reset
const btnOui = document.querySelector(".btn-oui") as HTMLButtonElement;                              // Le bouton Oui de la fenêtre de confirmation
const btnNon = document.querySelector(".btn-non") as HTMLButtonElement;                              // Le bouton Non de la fenêtre de confirmation
const btnTitre = document.querySelector("#btn-titre") as HTMLButtonElement;                          // Le bouton pour modifier le titre de la liste
let inputTitre : HTMLInputElement | null = null;                                                     // L'input pour modifier le titre de la liste
const inputTache = document.querySelector("#input-tache") as HTMLInputElement;                       // L'input du formulaire d'entré de nouvelle taches
const selectPriorite = document.querySelector("#select-priorite") as HTMLSelectElement;              // Le sélecteur de priorité de la tache que l'on veut entrer
const erreur = document.querySelector("#erreur") as HTMLSpanElement;                                 // Un message d'erreur qui s'affichera si pas de titre de tâche
const selectTaches = document.querySelector("#select-taches") as HTMLSelectElement;                  // Le sélecteur qui sert à filtrer les tâches pour l'affichage

// On initialise le selecteur du filtre à Toutes
selectTaches.value = "Toutes";

// On lance l'affichage des tâches au chargement de la page
afficherTaches();

// Définition de la fonction pour retirer le message d'erreur sur l'input du titre de tâche
function retirerErreur () {
  erreur.classList.remove("msg-erreur");
}

// Définition de la fonction lors de la soumission (submit) du formulaire pour ajouter une nouvelle tâche
conteneurFormulaire.addEventListener("submit", (e) => {
  e.preventDefault();
  // On récupère le texte de l'input et on enlève les espaces vides avec .trim()
  const texte = inputTache.value.trim();
  // Si le champs est vide, il ne se passe rien pour ne pas créer une tâche vide
  if (texte === "") {
    // On affiche un message d'erreur indiquant de remplir le champ de texte
    erreur.classList.add("msg-erreur");
    // On sélectionne le champ de saisi pour que l'utilisateur n'ai pas à cliquer dessus
    inputTache.focus();
    // On retire d'abord l'écouteur d'évènement pour retirer le message d'erreur dans le cas ou le bouton de soumission du formulaire soit cliqué plusieurs fois sans texte dans l'input
    inputTache.removeEventListener("input", retirerErreur);
    // On ajoute un écouteur d'évènement pour retirer le message d'erreur dès lors que l'utilisateur écrit quelque chose dans l'input
    inputTache.addEventListener("input", retirerErreur);
    return;
  }

  // On appelle la fonction ajouterTache (définie dans taches.ts) qui va prendre en paramètre le texte écrit dans le champs input et la priorité choisie dans le champs select
  ajouterTache(inputTache.value.trim(), selectPriorite.value as NiveauPriorite);

  // On vide le champ de texte pour un nouvel ajout
  conteneurFormulaire.reset();

  // On lance l'affichage visuel pour la mise à jour de l'écran
  afficherTaches();
});

// Définition de la fonction d'affichage de la fenêtre modal de confirmation pour tout effacer
btnReset.addEventListener("click", () => {
  // On ouvre une fenêtre demandant la confirmation pour éviter tout effacement accidentel
  confirmModal.showModal();
});

// On ferme la fenêtre de dialog si l'utilisateur clique en dehors
confirmModal.addEventListener("click", (e) => {
  if (e.target === confirmModal) {
    confirmModal.close();
  }
});

// Quand l'utilisateur clique sur "Oui" dans la fenêtre de confirmation
btnOui.addEventListener("click", () => {
  listeTaches.length = 0;     // On vide le tableau des tâches
  titre.textContent = "✔ To-Do List";   // On remet le titre initial
  localStorage.setItem("mon-titre", titre.textContent);  // On sauvegarde le titre
  sauvegarderTaches();  // On sauvergarde ce tableau vidé
  afficherTaches();     // On met à jour l'écran
  confirmModal.close(); // On ferme la fenêtre de confirmation
});

// Quand l'utilisateur clique sur "Non" dans la fenêtre de confirmation
btnNon.addEventListener("click", () => {
  confirmModal.close();  // On ferme simplement la fenêtre
});

// On défini la variable du setTimeout pour l'effacement du formulaire à la fermeture de celui-ci
let delaiInput : ReturnType<typeof setTimeout> | null;

// On programme l'affichage du menu d'ajout de tâches lors du clic sur le bouton "Ajouter une tâche"
btnToggleForm.addEventListener("click", () => {
  // On vide le champs de texte dans l'éventualité ou l'utilisateur avait commencé à la remplir puis avait changé d'avis et refermé le le menu
  // On vérifie s'il n'y a pas déjà un setTimeout en attente d'exécution et si c'est le cas on le supprime
  if (delaiInput) {
    clearTimeout(delaiInput);
  }
  // On établi un setTimeout pour que le texte ne disparaisse pas instantanément lors du clic sur le bouton
  delaiInput = setTimeout ( () => {
    inputTache.value = "";           // On efface le texte dans l'input
    selectPriorite.value = "";       // On remet le select sur sa position initiale
    retirerErreur();                 // On enlève le message d'erreur s'il est présent
  }, 300);
  
  // On active ou désactive la classe "active" sur le formulaire lors du clic sur le bouton
  conteneurFormulaire.classList.toggle("active");

  // On vérifie si le formulaire est caché ou non pour adapter le texte du bouton
  if (conteneurFormulaire.classList.contains("active")) {
    btnToggleForm.textContent = "Annuler";
    inputTache.focus();
  } else {
    btnToggleForm.textContent = "+ Ajouter une nouvelle tâche";
  }
});

// Ajout d'une fonctionnalité permettant de changer le titre de la liste
btnTitre.addEventListener("click", () => {
  // On cherche si l'input pour entrer le titre est déjà présent
  if (!inputTitre) {
    // Si non, on crée cet input, lui met un placeholder, lui ajoute la fonction de pouvoir valider le texte en appuyant sur entrée  
    inputTitre = document.createElement("input");
    inputTitre.placeholder = "Titre de la liste";
    // On configure la validation de l'input avec la touche Entrée du clavier
    inputTitre.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        btnTitre.click();
      }
    });
    // On fait que l'input remplace le titre et soit directement sélectionné
    titre.replaceWith(inputTitre);
    // On sélectionne tout de suite l'input
    inputTitre.focus();
  } else {
    // Si oui, on récupère le texte entré dans l'input
    let nouveauTitre = inputTitre.value.trim();
    // On vérifie s'il le champs n'est pas vide
    if (nouveauTitre !== "") {
      // S'il n'est pas vide, on remplace le texte initial du titre de la liste par celui entré dans l'input
      titre.textContent = nouveauTitre;
    }
    // On remet le titre à la place de l'input 
    inputTitre.replaceWith(titre);
    // On réinitialise l'input
    inputTitre = null;
    // On sauvegarde le nouveau titre
    localStorage.setItem("mon-titre", titre.textContent);
  }
});

// Ajout de la fonctionnalité pour filtrer les tâches à afficher à l'écran
selectTaches.addEventListener("change", () => {
  // On exécute le fonction setFiltreActif définie dans ui.ts qui prends en paramètre la valeur de l'option choisie dans le sélecteur
  setFiltreActif(selectTaches.value as FiltreTaches);
  afficherTaches();
});

// Sélection de l'élément footer qui contient la version
const versionElement = document.querySelector("footer p:last-child");

// S'il existe, on modifie le texte de cet élément pour qu'il affiche la version depuis package.json
if (versionElement) {
  versionElement.textContent = `Version ${packageJson.version}`;
}