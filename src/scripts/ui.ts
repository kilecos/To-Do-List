// Gestion de l'interface utilisateur

// Récupération des types, constantes, variables et fonctions dans les autres fichiers
import { POIDS_PRIORITE, type FiltreTaches, type NiveauPriorite, type Tache } from "./types";
import { listeTaches, titreSauvegarde } from "./storage";
import { supprimerTache, terminerTache, editerTache } from "./taches";


// Récupération des éléments HTML et définition des constantes
// On utilise "as HTML..." pour bien dire à TypeScript la nature de l'élément
const listeTachesHtml = document.querySelector("#liste-taches-html") as HTMLUListElement;            // L'élément li qui contiendra la tache que l'on veut entrer
export const titre = document.querySelector("#list-titre") as HTMLElement;                           // Le titre de la liste
const compteurTaches = document.querySelector("#compteur-taches") as HTMLElement;                    // Le compteur qui s'affiche lorsqu'il y a des tâches en cours
let filtreActif : FiltreTaches = "Toutes";                                                    // La valeur du sélecteur pour filtrer les tâches de la liste, initialisé à "Toutes" pour afficher toutes les tâches au chargement de la page

// On remplace le texte du titre de la liste par le titre sauvegardé (s'il en existe un)
if (titreSauvegarde) {
  titre.textContent = titreSauvegarde;
}

// Définition de la fonction qui sera exécutée (dans main.ts) lors des changements sur le selecteur servant à filtre les tâches à afficher à l'écran
export function setFiltreActif(selectFiltre : FiltreTaches) {
  filtreActif = selectFiltre;
}

// Définition de la fonction d'affichage des tâches à l'écran
export function afficherTaches() : void {
  // On vide la liste avant de la redessiner
  listeTachesHtml.innerHTML = "";

  // On crée un nouveau tableau qui va trier les taches à afficher par rapport au leur priorité (la priorité la plus haute sera affiché en premier)
  // On affiche des listes de tâches différentes (filtrées) selon l'option choisi sur le selecteur
  // Si le sélecteur est sur "En Cours", on affiche uniquement les tâches non terminées
  const tachesTriees = filtreActif === "En Cours" 
  ? [...listeTaches].filter((tache) => tache.estTerminee === false)
  // Si le sélecteur est sur "Terminées", on affiche uniquement les tâches terminées
  : filtreActif === "Terminées" 
  ? [...listeTaches].filter((tache) => tache.estTerminee === true)
  // Si le sélecteur est sur "Toutes" on affiche toutes les tâches
  : [...listeTaches];

  // On trie les tâches en fonction de leur priorité
  tachesTriees.sort((a, b) => {
      // Le calcul de comparaison entre la priorité d'une tache a et la priorité d'une tache b
      return POIDS_PRIORITE[b.priorite] - POIDS_PRIORITE[a.priorite];
    });

  // On parcours la tableau TypeScript
  tachesTriees.forEach((tache) => {
    // Pour chaque tâche, on crée un élément <li>
    const li = document.createElement("li");
    // Ajoute data-id en tant qu'attribut HTML de l'élément
    li.dataset.id = String(tache.id);
    // Si la tâche est terminée, on lui ajoute la classe CSS .tache-barree qui barre le texte
    if (tache.estTerminee) {
      li.classList.add("tache-barree");
    }
    // On y met le texte dans une balise <span>
    const spanTexte = document.createElement("span");
    // On renseigne le titre de la tâche
    spanTexte.textContent = tache.titre;
    // Si une priorité est renseignée, on ajoute la classe CSS correspondante à l'élément li pour un affichage visuel de cette priorité
    if (tache.priorite) {
      li.classList.add(`priorite-${tache.priorite.toLowerCase()}`);
    }
    // On attache le span à l'élément li
    li.appendChild(spanTexte);

    // On crée un conteneur pour les boutons d'action sur les tâches
    const btnConteneur = document.createElement("div");
    btnConteneur.classList.add("btn-conteneur");
    li.appendChild(btnConteneur);

    // Création du bouton servant à éditer une tâche de la liste
    const btnEditer = document.createElement("button");
    btnEditer.textContent = "📝";
    btnEditer.title = "Editer la tâche";
    btnEditer.ariaLabel = "Editer la tâche";
    btnEditer.classList.add("btn-action");      // On lui ajoute une classe CSS pour la personnalisation
    // Au clic on ouvre le mode édition pour la tâche sélectionnée 
    btnEditer.addEventListener("click", (e) => {
      // On empêche la propagation des évènements pour éviter de fermer le menu d'édition immédiatement avec la fonction fermerEdition
      e.stopPropagation();
      // On vérifie s'il y a déjà une tâche en mode édition lors du clic
      if (document.querySelector(".en-edition")) {
        // Si oui, on recrée toute la liste ce qui va fermer d'autres modes éditions éventuellement ouvert
        afficherTaches();
        // On va chercher le li de la tâche que l'on veut modifier dans la nouvelle liste
        // On recupére précisément le li avec l'attribut data-id correspondant à la tâche que l'on souhaite modifier
        const selecteur = `[data-id="${tache.id}"]`;
        const nouveauLi = listeTachesHtml.querySelector(selecteur) as HTMLElement;
        // Si on le trouve, on ouvre son mode édition
        if (nouveauLi) {
          modeEdition(tache, nouveauLi);
        }
      } else {
        // S'il n'y a aucune tâche en mode édition, on l'ouvre directement sur le li sélectionné
        modeEdition(tache, li);
      }
    });  
    btnConteneur.appendChild(btnEditer);        // On attache ce bouton au conteneur attaché à l'élément li qui contient la tâche

    // On défini la logique des boutons conditionnels
    if (!tache.estTerminee) {
      // Si la tâche n'est pas terminée, on affiche un bouton afin de pouvoir la valider
      const btnValider = document.createElement("button");  // On crée l'élément button dans le HTML
      btnValider.textContent = "✔";
      btnValider.title = "Valider la tache";                // Pour avoir une infobulle au survol du bouton par la souris
      btnValider.ariaLabel = "Valider la tache";
      btnValider.classList.add("btn-action");               // On lui ajoute une classe CSS pour la personnalisation
      // Au clic, on appelle la fonction terminerTache avec l'ID de cette tâche
      btnValider.addEventListener("click", () => terminerTache(tache.id, afficherTaches));  // La fonction terminerTache (voir taches.ts) prends ici en paramètres l'id de la tâche sélectionnée ainsi que la fonction afficherTaches elle même qui sera exécutée à la fin de terminerTache
      btnConteneur.appendChild(btnValider);   // On attache ce bouton au conteneur attaché à l'élément li qui contient la tâche
    } else {
      // Si la tâche est déjà terminée, on affiche un bouton pour la supprimer
      const btnSupprimer = document.createElement("button") // On crée l'élément button dans le HTML
      btnSupprimer.textContent = "✘";
      btnSupprimer.title = "Supprimer la tache";            // Pour avoir une infobulle au survol du bouton par la souris
      btnSupprimer.ariaLabel = "Supprimer la tache";
      btnSupprimer.classList.add("btn-action");             // On lui ajoute une classe CSS pour la personnalisation
      // Au clic sur ce bouton, on appelle la fonction pour la retirer
      btnSupprimer.addEventListener("click", () => supprimerTache(tache.id, afficherTaches)); // La fonction supprimerTache (voir taches.ts) prends ici en paramètres l'id de la tâche sélectionnée ainsi que la fonction afficherTaches elle même qui sera exécutée à la fin de supprimerTache
      btnConteneur.appendChild(btnSupprimer);    // On attache ce bouton au conteneur attaché à l'élément li qui contient la tâche
    }

    // On ajoute cet élément <li> à notre élément <ul> du HTML
    listeTachesHtml.appendChild(li);
  });
  // On met à jour le compteur de tâches
  miseAJourCompteur();
}

// Ajout d'une fonctionnalité pour avoir un compteur des taches terminées
export function miseAJourCompteur () {
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

// Ajout de la fonctionnalité d'édition d'une tâche
function modeEdition (tache : Tache, li : HTMLElement) {
  // On vide l'élément li de la tâche sélectionnée
  li.innerHTML = "";
  // On ajoute une classe à l'élément li que l'on veut éditer afin de pouvoir le sélectionner exclusivement
  li.classList.add("en-edition");
  // On configure la fermture du menu édition si clic en dehors de celui ci
  function fermerEdition(e : MouseEvent) {
    // On cible l'élément du document ayant la classe en-edition
    const liEdition = document.querySelector(".en-edition");
    // S'il existe et qu'il n'est pas la cible du clic
    if (liEdition && e.target && !liEdition.contains(e.target as Node)) {
      // On rafraichit la page et donc ferme le menu d'édition
      afficherTaches();
    }
  }
  // On ajoute au document la fonctionnalité de fermer le menu d'édition au clic en dehors de celui-ci
  // On la place dans un setTimeout à 0 pour ne pas le fermer immédiatement car le bouton pour l'ouvrir ne fait pas parti de ce menu édition
  document.addEventListener("click", fermerEdition);
  // On crée un input pour modification du titre de la tâche
  const inputEdit = document.createElement("input");
  // Il prend comme valeur initiale le titre existant de la tâche
  inputEdit.value = tache.titre;
  // On attache l'input à l'élément li
  li.appendChild(inputEdit);
  // On sélectionne d'office l'input
  inputEdit.focus();
  inputEdit.select();
  // On crée un select auquel on va associer les options de sélection de priorité
  const selectEdit = document.createElement("select");
  selectEdit.add(new Option("--Priorité--", ""));
  selectEdit.add(new Option("Basse", "Basse"));
  selectEdit.add(new Option("Moyenne", "Moyenne"));
  selectEdit.add(new Option("Haute", "Haute"));
  // Il prend comme valeur initiale la priorité qu'avait initialement la tâche
  selectEdit.value = tache.priorite;
  // On attache le select à l'élément li
  li.appendChild(selectEdit);
  // On crée le bouton qui aura la fonction de valider les changements réalisés sur la tâche
  const validEdit = document.createElement("button");
  validEdit.textContent = "Editer";
  // On lui ajoute la fonctionnalité de validation des modifications
  validEdit.addEventListener("click", () => editerTache(tache.id, inputEdit.value.trim() || tache.titre, selectEdit.value as NiveauPriorite, tache.estTerminee, afficherTaches));
  // Ajout de la fonctionnalité de pouvoir valider l'édition de la tâche si on appuie sur le touche "Entrée" du clavier quand on est dans l'input
  inputEdit.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      validEdit.click();
    }
  });
  // On attache le bouton à l'élément li
  li.appendChild(validEdit);
}