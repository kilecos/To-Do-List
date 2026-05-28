// Fichier du test pour la fonction de sauvegarde d'une liste de tâches sur localStorage

import { listeTaches, sauvegarderTaches } from "../scripts/storage";

beforeEach(() => {
    localStorage.clear();
    listeTaches.length = 0;
});

describe("sauvegarderTaches", () => {
    it("localStorage contient bien les données", () => {
        listeTaches.push({
            id: "test-id",
            titre: "Faire les courses",
            estTerminee: false,
            priorite: "Haute"
        });
        sauvegarderTaches();
        expect(localStorage.getItem("mes-taches")).toBe(JSON.stringify(listeTaches));
    });
});
