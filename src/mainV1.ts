// Déclaration des types et interfaces
type NiveauPriorite = "Basse" | "Moyenne" | "Haute";

interface Tache {
  readonly id : number;
  titre : string;
  estTerminee : boolean;
  priorite : NiveauPriorite;
  description? : string;
};

// Création de la constante afin de pouvoir trier les taches selon leur priorité
const POIDS_PRIORITE : Record<string, number> = {   // Record permet de dire à TypeScript que cette constante est un "dictionnaire" dont les clés sont des chaines de caractères et les valeurs des nombres
  "Haute" : 3,
  "Moyenne" : 2,
  "Basse" : 1,
  "" : 0,
};

// Déclaration de la base de données locale

// On regarde s'il y a déjà des choses sauvegardées sous le nom 'mes-taches"
const sauvegarde = localStorage.getItem("mes-taches");

// Si c'est le cas, on les transforme de JSON vers notre tableau TypeScript, sinon on crée un tableau vide
// Le "sauvegarde ?" correspond à la question "Est ce que la variable sauvegarde contient quelque chose ?"
// Si OUI, on utilise la méthode .parse() sur JSON qui va convertir les données sauvergardées en chaines de caractères en tableau
// Si NON, la partie ": []" indique que l'on démarre avec un tableau vide
let listeTaches : Tache[] = sauvegarde ? JSON.parse(sauvegarde) : [];

// Définition de la fonction de sauvegarde
function sauvegarderTaches() : void {
  // On transforme le tableau en texte JSON avec la méthode .stringify() et on le met dans le localStorage car localStorage n'accepte que les données simple et pas les complexes comme un tableau
  localStorage.setItem("mes-taches", JSON.stringify(listeTaches));
}

// Récupération des éléments HTML et définition des constantes
// On utilise "as HTML..." pour bien dire à TypeScript la nature de l'élément
const inputTache = document.querySelector("#input-tache") as HTMLInputElement;                       // L'input du formulaire d'entré de nouvelle taches
const selectPriorite = document.querySelector("#select-priorite") as HTMLSelectElement;              // Le sélecteur de priorité de la tache que l'on veut entrer
const listeTachesHtml = document.querySelector("#liste-taches-html") as HTMLUListElement;            // L'élément li qui contiendra la tache que l'on veut entrer
const btnReset = document.querySelector("#btn-reset") as HTMLButtonElement;                          // Le bouton pour effacer toutes les taches dans la liste
const btnToggleForm = document.querySelector("#btn-toggle-form") as HTMLButtonElement;               // Le bouton pour afficher ou fermer le formulaire d'entré de taches
const conteneurFormulaire = document.querySelector("#conteneur-formulaire") as HTMLFormElement;      // Le formulaire d'entré de taches
const confirmModal = document.querySelector("#modal-confirm") as HTMLDialogElement;                  // La fenêtre de confirmation qui s'affichera lors de l'utilisation du bouton reset
const btnOui = document.querySelector(".btn-oui") as HTMLButtonElement;                              // Le bouton Oui de la fenêtre de confirmation
const btnNon = document.querySelector(".btn-non") as HTMLButtonElement;                              // Le bouton Non de la fenêtre de confirmation
const titre = document.querySelector("#list-titre") as HTMLElement;                                  // Le titre de la liste
const compteurTaches = document.querySelector("#compteur-taches") as HTMLElement;                    // Le compteur qui s'affiche lorsqu'il y a des tâches en cours
const btnTitre = document.querySelector("#btn-titre") as HTMLButtonElement;                          // Le bouton pour modifier le titre de la liste
let inputTitre : HTMLInputElement | null = null;                                                     // L'input pour modifier le titre de la liste

// On va chercher s'il existe un titre sauvegardé précédemment
const titreSauvegarde = localStorage.getItem("mon-titre");
// S'il existe, on remplace le texte du titre de la liste par le titre sauvegardé
if (titreSauvegarde) {
  titre.textContent = titreSauvegarde;
}

// On défini la fonction d'affichage à l'écran
function afficherTaches() : void {
  // On vide la liste avant de la redessiner
  listeTachesHtml.innerHTML = "";

  // On crée un nouveau tableau qui va trier les taches à afficher par rapport au leur priorité (la priorité la plus haute sera affiché en premier)
  const tachesTriees = [...listeTaches];
  tachesTriees.sort((a, b) => {
    // Le calcul de comparaison entre la priorité d'une tache a et la priorité d'une tache b
    return POIDS_PRIORITE[b.priorite] - POIDS_PRIORITE[a.priorite];
  });

  // On parcours la tableau TypeScript
  tachesTriees.forEach((tache) => {
    // Pour chaque tâche, on crée un élément <li>
    const li = document.createElement("li");
    // Si la tâche est terminée, on lui ajoute la classe CSS .tache-barree qui barre le texte
    if (tache.estTerminee) {
      li.classList.add("tache-barree");
    }
    // On y met le texte dnas une balise <span>
    const spanTexte = document.createElement("span");
    // Si une priorité est renseignée, on la note à côte du titre de la tache
    if (tache.priorite) {
      spanTexte.textContent = `${tache.titre} - Priorité : ${tache.priorite}`;
    // Si pas de priorité renseignée, on affiche juste le titre de la tache
    } else {
      spanTexte.textContent = tache.titre;
    }
    li.appendChild(spanTexte);
    // On défini la logique des boutons conditionnels
    if (!tache.estTerminee) {
      const btnValider = document.createElement("button");
      btnValider.textContent = "✔";
      btnValider.title = "Valider la tache";
      btnValider.ariaLabel = "Valider la tache";
      btnValider.classList.add("btn-action");
      // Au clic, on appelle la fonction terminerTache avec l'ID de cette tâche
      btnValider.addEventListener("click", () => terminerTache(tache.id));
      li.appendChild(btnValider);
    } else {
      // Si la tâche est déjà terminée, on affiche un bouton pour la supprimer
      const btnSupprimer = document.createElement("button")
      btnSupprimer.textContent = "✘";
      btnSupprimer.title = "Supprimer la tache";
      btnSupprimer.ariaLabel = "Supprimer la tache";
      btnSupprimer.classList.add("btn-action");
      // Au clic sur ce bouton, on appelle la fonction pour la retirer
      btnSupprimer.addEventListener("click", () => supprimerTache(tache.id));
      li.appendChild(btnSupprimer);
    }
    // On ajoute cet élément <li> à notre élément <ul> du HTML
    listeTachesHtml.appendChild(li);
  });

  miseAJourCompteur();

}

conteneurFormulaire.addEventListener("submit", (e) => {
  e.preventDefault();
  // On récupère le texte de l'input et on enlève les espaces vides avec .trim()
  const texte = inputTache.value.trim();
  // Si le champs est vide, il ne se passe rien pour ne pas créer une tâche vide
  if (texte === "") return;

  // On crée la tâche entrée en respectant l'interface établie
  const nouvelleTache : Tache = {
    id : Date.now(), // donne un nombre unique basé sur l'heure
    titre : texte,       // Le titre renseigné dans l'input
    estTerminee : false,
    priorite : selectPriorite.value as NiveauPriorite, // L'option choisi dans le select du formulaire. On force le type avec le "as NiveauPriorite" car TypeScript voit une chaine de caratères classique venant du select
  };

  // On ajoute notre nouvelle tâche à notre base de données locale
  listeTaches.push(nouvelleTache);

  // On vide le champ de texte pour un éventuel prochain ajout
  conteneurFormulaire.reset();

  // On lance l'affichage visuel
  afficherTaches();

  // On sauvegarde la nouvelle liste de tâche dans le navigateur
  sauvegarderTaches();

});

// Définition de la fonction pour valider et barrer une tache
function terminerTache(id : number) : void {
  const tacheTrouvee = listeTaches.find(tache => tache.id === id);
  if (tacheTrouvee) {
    tacheTrouvee.estTerminee = true;  // Passage du paramètre estTerminee à true
    sauvegarderTaches();              // On sauvegarde dans le navigateur
    afficherTaches();                 // On met l'écran à jour
  }
}

// Définition de la fonction pour enlever une tâche de la liste
function supprimerTache(id : number) : void {
  // On utilise filter pour garder toutes les tâches sauf celle qui a cet ID
  listeTaches = listeTaches.filter(tache => tache.id !== id);
  sauvegarderTaches();
  afficherTaches();
}

// Définition de la fonction pour tout effacer
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

// Quand l'utilisateur clique sur "Oui"
btnOui.addEventListener("click", () => {
  listeTaches = [];     // On vide le tableau TypeScript
  titre.textContent = "✔ To-Do List";   // On remet le titre initial
  localStorage.setItem("mon-titre", titre.textContent);  // On sauvegarde le titre
  sauvegarderTaches();  // On sauvergarde ce tableau vidé
  afficherTaches();     // On met à jour l'écran
  confirmModal.close(); // On ferme la fenêtre de confirmation
});

// Quand l'utilisateur clique sur "Non"
btnNon.addEventListener("click", () => {
  confirmModal.close();  // On ferme simplement la fenêtre
});

// On lance l'affichage des tâches au chargement de la page
afficherTaches();

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
    inputTache.value = "";
  }, 300);
  
  // On active ou désactive la classe "active" sur le formulaire
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
    inputTitre.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        btnTitre.click();
      }
    });
    // On fait que l'input remplace le titre et soit directement sélectionné
    titre.replaceWith(inputTitre);
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

// Ajout d'une fonctionnalité pour avoir un compteur des taches terminées
function miseAJourCompteur () {
  // On sélectionne le nombre total de taches de la liste
  let totalTaches = listeTaches.length;
  // On sélectionne le nombre de taches dont le paramètre "estTerminee" est "true"
  let tachesTerminees = listeTaches.filter((tache) => tache.estTerminee);
  // On modifie le texte de la balise <p> du compteur
  // Si on a une liste de taches on affiche le nombre de taches terminées par rapport au nombre de taches total
  if(totalTaches) {
    compteurTaches.textContent = `Tâches terminées : ${tachesTerminees.length} / ${totalTaches}`;
  // S'il n'y a pas de liste de taches, le compteur ne s'affiche pas  
  } else {
    compteurTaches.textContent = "";
  }
}