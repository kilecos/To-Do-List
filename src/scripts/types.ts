// Déclaration des types et interfaces

// Déclaration du type spécifiant les différents niveaux de priorité possible pour une tâche
export type NiveauPriorite = "Basse" | "Moyenne" | "Haute";

// Déclaration du type qui va permettre de pouvoir filtrer les tâches à afficher à l'écran
export type FiltreTaches = "Toutes" | "En Cours" | "Terminées";

// Création de l'interface qui servira à créer les objets tâche
export interface Tache {
  readonly id : number;
  titre : string;
  estTerminee : boolean;
  priorite : NiveauPriorite;
  description? : string;
};

// Création de la constante afin de pouvoir trier les taches selon leur priorité
export const POIDS_PRIORITE : Record<string, number> = {   // Record permet de dire à TypeScript que cette constante est un "dictionnaire" dont les clés sont des chaines de caractères et les valeurs des nombres
  "Haute" : 3,
  "Moyenne" : 2,
  "Basse" : 1,
  "" : 0,
};