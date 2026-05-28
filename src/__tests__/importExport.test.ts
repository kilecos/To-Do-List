// Fichier de tests pour la fonction de valider des données d'un fichier importé

import { validerDonneesImport } from "../scripts/importExport";
import type { NiveauPriorite } from "../scripts/types";

describe("validerDonneesImport", () => {
    it("la fonction retourne false si les donnees ne sont pas un objet", () => {
        expect(validerDonneesImport("une string")).toBe(false);
    });
    it("la fonction retourne false si les données sont null", () => {
        expect(validerDonneesImport(null)).toBe(false);
    });
    it("la fonction retourne false si les données importées ne sont pas un tableau", () => {
        expect(validerDonneesImport({liste: "pas un tableau"})).toBe(false);
    });
    it("retourne false si le titre n'est pas une string", () => {
        expect(validerDonneesImport({liste: [{id: "string", titre: 1234, estTerminee: false}]})).toBe(false);
    });
    it("retourne false si estTerminee n'est pas de type boolean", () => {
        expect(validerDonneesImport({liste: [{id: "string", titre: "string", estTerminee: "string"}]})).toBe(false);
    });
    it("retourne false si id n'est pas une string", () => {
        expect(validerDonneesImport({liste: [{id: 1234, titre: "string", estTerminee: true}]})).toBe(false);
    });
    it("retourne false si une des propriété est manquante", () => {
        expect(validerDonneesImport({liste: [{titre: "string", estTerminee: false}]})).toBe(false);
    });
    it("retourne true si les données importées passent les validations", () => {
        expect(validerDonneesImport({
            titre: "Ma liste test",
            liste: [{id: "string", titre: "string", estTerminee: false, priorite: "" as NiveauPriorite}]
        })).toBe(true);
    });
});