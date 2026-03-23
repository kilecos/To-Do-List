// Gestion de la sauvegarde des données

// Récupération des types, constantes, variables et fonctions dans les autres fichiers
import type {Tache} from "./types";

// Déclaration de la base de données locale

// On regarde s'il y a déjà des choses sauvegardées sous le nom 'mes-taches"
const sauvegarde = localStorage.getItem("mes-taches");

// Si c'est le cas, on les transforme de JSON vers notre tableau TypeScript, sinon on crée un tableau vide
// Le "sauvegarde ?" correspond à la question "Est ce que la variable sauvegarde contient quelque chose ?"
// Si OUI, on utilise la méthode .parse() sur JSON qui va convertir les données sauvergardées en chaines de caractères en tableau
// Si NON, la partie ": []" indique que l'on démarre avec un tableau vide
export let listeTaches : Tache[] = sauvegarde ? JSON.parse(sauvegarde) : [];

// Définition de la fonction de sauvegarde
export function sauvegarderTaches() : void {
  // On transforme le tableau en texte JSON avec la méthode .stringify() et on le met dans le localStorage car localStorage n'accepte que les données simple et pas les complexes comme un tableau
  localStorage.setItem("mes-taches", JSON.stringify(listeTaches));
}

// On va chercher s'il existe un titre sauvegardé précédemment
export const titreSauvegarde = localStorage.getItem("mon-titre");