import { listeTaches } from "../scripts/storage";
import { type NiveauPriorite } from "../scripts/types";
import { afficherTaches } from "../scripts/ui";

const listeTachesHtml = document.querySelector("#liste-taches-html") as HTMLUListElement;

beforeEach(() => {
    listeTaches.length = 0;
    listeTachesHtml.innerHTML = "";
});

describe("afficherTaches", () => {
    it("si pas de liste enregistrée, il n'y a pas de liste affichée", () => {
        afficherTaches();
        expect(listeTachesHtml.innerHTML).toBe("");
    });
    it("le bon nombre de tâches est affiché", () => {
        listeTaches.push({
            id: "1",
            titre: "Faire les courses",
            estTerminee: false,
            priorite: "Haute"
        },{
            id: "2",
            titre: "Sortir le chien",
            estTerminee: true,
            priorite: "" as NiveauPriorite
        },{
            id: "3",
            titre: "Accrocher le linge",
            estTerminee: false,
            priorite: "Haute"
        });
        afficherTaches();
        expect(listeTachesHtml.querySelectorAll("li").length).toBe(3);
    });
    it("la bonne classe est appliquée à la tâche selon sa priorité", () => {
        listeTaches.push({
            id: "1",
            titre: "Faire les courses",
            estTerminee: false,
            priorite: "Haute"
        },{
            id: "2",
            titre: "Sortir le chien",
            estTerminee: true,
            priorite: "Moyenne"
        },{
            id: "3",
            titre: "Accrocher le linge",
            estTerminee: false,
            priorite: "Basse"
        });
        afficherTaches();
        const premierLi = listeTachesHtml.querySelectorAll("li")[0];
        const deuxiemeLi = listeTachesHtml.querySelectorAll("li")[1];
        const troisiemeLi = listeTachesHtml.querySelectorAll("li")[2];
        expect(premierLi.classList.contains("priorite-haute")).toBe(true);
        expect(deuxiemeLi.classList.contains("priorite-moyenne")).toBe(true);
        expect(troisiemeLi.classList.contains("priorite-haute")).toBe(false);
        expect(troisiemeLi.classList.contains("priorite-basse")).toBe(true);
    });
    it("une tâche terminéee contient bien la classe tache-barree", () => {
        listeTaches.push({
            id: "1",
            titre: "Faire les courses",
            estTerminee: false,
            priorite: "Haute"
        },{
            id: "2",
            titre: "Sortir le chien",
            estTerminee: true,
            priorite: "Moyenne"
        });
        afficherTaches();
        const premierLi = listeTachesHtml.querySelectorAll("li")[0];
        const deuxiemeLi = listeTachesHtml.querySelectorAll("li")[1];
        expect(premierLi.classList.contains("tache-barree")).toBe(false);
        expect(deuxiemeLi.classList.contains("tache-barree")).toBe(true);
    });
    it("le titre de la tâche est bien affiché dans un <span>", () => {
        listeTaches.push({
            id: "1",
            titre: "Faire les courses",
            estTerminee: false,
            priorite: "Haute"
        });
        afficherTaches();
        const li = listeTachesHtml.querySelector("li") as HTMLLIElement;
        const span = li.querySelector("span") as HTMLSpanElement;
        expect(span.textContent).toBe("Faire les courses");
    });
    it("les boutons valider, supprimer et éditer s'affiche correctement", () => {
        listeTaches.push({
            id: "1",
            titre: "Faire les courses",
            estTerminee: false,
            priorite: "Haute"
        },{
            id: "2",
            titre: "Sortir le chien",
            estTerminee: true,
            priorite: "Moyenne"
        });
        afficherTaches();
        const premierLi = listeTachesHtml.querySelectorAll("li")[0];
        const deuxiemeLi = listeTachesHtml.querySelectorAll("li")[1];
        expect(premierLi.querySelector(".btn-valider")).not.toBeNull();
        expect(premierLi.querySelector(".btn-supprimer")).toBeNull();
        expect(deuxiemeLi.querySelector(".btn-valider")).toBeNull();
        expect(deuxiemeLi.querySelector(".btn-supprimer")).not.toBeNull();
        expect(premierLi.querySelector(".btn-editer")).not.toBeNull();
        expect(deuxiemeLi.querySelector(".btn-editer")).not.toBeNull();
    });
});