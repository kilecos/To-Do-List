// Fichier de tests pour les fonctions de gestion de tâches

import { ajouterTache, terminerTache, supprimerTache, editerTache } from "../scripts/taches";
import { listeTaches } from "../scripts/storage";
import type { NiveauPriorite } from "../scripts/types";

beforeEach(() => {
    listeTaches.length = 0;
});

describe("ajouterTache", () => {
    it("devrait ajouter une tache à la liste", () => {
        ajouterTache("Faire les courses", "Haute");
        expect(listeTaches.length).toBe(1);
    });
    it("devrait ajouter une tâche même sans priorité", () => {
        ajouterTache("Faire les courses", "" as NiveauPriorite);
        expect(listeTaches.length).toBe(1);
    });
});

describe("Propriété de la tâche", () => {
    it("tâche doit avoir les bonne propriétés", () => {
        ajouterTache("Faire les courses", "Haute");
        expect(listeTaches[0].titre).toBe("Faire les courses");
        expect(listeTaches[0].priorite).toBe("Haute");
        expect(listeTaches[0].estTerminee).toBe(false);
    });
});

describe("terminerTache", () => {
    it("la tâche doit être identifiée comme terminée", () => {
        ajouterTache("Faire les courses", "Haute");
        terminerTache(listeTaches[0].id);
        expect(listeTaches[0].estTerminee).toBe(true);
    });
    it("aucun changement si mauvais id de tâche", () => {
        ajouterTache("Faire les courses", "Haute");
        terminerTache("id-inexistant");
        expect(listeTaches[0].estTerminee).toBe(false);
    });
});

describe("supprimerTache", () => {
    it("la tâche doit être supprimée", () => {
        ajouterTache("Faire les courses", "Haute");
        supprimerTache(listeTaches[0].id);
        expect(listeTaches.length).toBe(0);
    });
    it("la bonne tâche doit être supprimée", () => {
        ajouterTache("Faire les courses", "Haute");
        ajouterTache("Sortir le chien", "Moyenne");
        supprimerTache(listeTaches[0].id);
        expect(listeTaches.length).toBe(1);
        expect(listeTaches[0].titre).toBe("Sortir le chien");
    });
    it("aucun changement si mauvais id de tâche", () => {
        ajouterTache("Faire les courses", "Haute");
        supprimerTache("id-inexistant");
        expect(listeTaches.length).toBe(1);
    });
});

describe("editerTache", () => {
    it("les proriété de la tâche ont été modifiées", () => {
        ajouterTache("Faire les courses", "Haute");
        editerTache(listeTaches[0].id, "Sortir le chien", "Moyenne", true);
        expect(listeTaches[0].titre).toBe("Sortir le chien");
        expect(listeTaches[0].priorite).toBe("Moyenne");
        expect(listeTaches[0].estTerminee).toBe(false);
    });
    it("aucune modification si mauvaise id", () => {
        ajouterTache("Faire les courses", "Haute");
        editerTache("id-inexistant", "Sortir le chien", "Moyenne", false);
        expect(listeTaches[0].titre).toBe("Faire les courses");
        expect(listeTaches[0].priorite).toBe("Haute");
        expect(listeTaches[0].estTerminee).toBe(false);
    });
    it("propriété estTerminee reste bien à false", () => {
        ajouterTache("Faire les courses", "Haute");
        editerTache(listeTaches[0].id, "Sortir le chien", "Moyenne", false);
        expect(listeTaches[0].titre).toBe("Sortir le chien");
        expect(listeTaches[0].priorite).toBe("Moyenne");
        expect(listeTaches[0].estTerminee).toBe(false);
    });
});