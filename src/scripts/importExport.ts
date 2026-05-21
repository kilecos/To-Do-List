import { afficherTaches } from "./ui";
import { listeTaches, sauvegarderTaches } from "./storage";
import type { Tache } from "./types";

const importExportModal = document.querySelector("#modal-import-export") as HTMLDialogElement;
const firstModal = document.querySelector(".modal-first-content") as HTMLDivElement;
const exportModal = document.querySelector(".modal-export-content") as HTMLDivElement;
const importModal = document.querySelector(".modal-import-content") as HTMLDivElement;
const btnOpenModal = document.querySelector("#btn-import-export") as HTMLButtonElement;
const btnExport = document.querySelector(".btn-export") as HTMLButtonElement;
const btnImport = document.querySelector(".btn-import") as HTMLButtonElement;
const btnCancel = document.querySelector(".btn-cancel") as HTMLButtonElement;
const btnBack = document.querySelectorAll(".btn-back") as NodeListOf<HTMLButtonElement>;
const btnJson = document.querySelector(".btn-json") as HTMLButtonElement;
const btnText = document.querySelector(".btn-texte") as HTMLButtonElement;
const importInput = document.querySelector("#import-input") as HTMLInputElement;
const btnConfirmImport = document.querySelector(".btn-confirm") as HTMLButtonElement;

function afficherEtat(etat : HTMLDivElement) {
    document.querySelectorAll(".modal-ie-content").forEach((modal) => {
        modal.classList.remove("visible");
    });
    etat.classList.add("visible");
}

export function initialiserImportExport() {
    btnOpenModal.addEventListener("click", () => {
        importExportModal.showModal();
        afficherEtat(firstModal);
    });

    btnExport.addEventListener("click", () => {
        afficherEtat(exportModal);
    });

    btnImport.addEventListener("click", () => {
        afficherEtat(importModal);
    });

    btnCancel.addEventListener("click", () => {
        importExportModal.close();
    });

    btnBack.forEach((btn) => {
        btn.addEventListener("click", () => {
            afficherEtat(firstModal);
        });
    });

    importExportModal.addEventListener("click", (e) => {
        if (e.target === importExportModal) {
            importExportModal.close();
        }
    });

    btnJson.addEventListener("click", () => {
        exporterJSON();
        importExportModal.close();
    });

    btnText.addEventListener("click", () => {
        exporterTexte();
        importExportModal.close();
    });

    btnConfirmImport.addEventListener("click", () => {
        importerListe();
    });
}

function exporterJSON() {
    // On converti notre tableau listeTaches en chaine de caractères texte au format JSON
    // null, 2 formate avec des indentations
    const contenu = JSON.stringify(listeTaches, null, 2);
    // Un Blob est un objet qui représente des données binaires, c'est le format utilisé par le navigateur pour manipuler des fichiers en mémoire.
    // On lui donne le contenu et lui dit de quel type de fichier il s'agit
    const blob = new Blob([contenu], {type: "application/json"});
    // On crée une URL temporaire qui pointe vers le Blob en mémoire, c'est une adresse fictive que seul le navigateur comprend.
    const url = URL.createObjectURL(blob);
    // On crée un lien invisible pointant vers l'URL temporaire, avec l'attribut download qui dit au navigateur "télécharge ce fichier sous ce nom"
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = "Liste.json";
    // On simulte un clic sur ce lien invisible pour déclencher le téléchargement
    lien.click()
    // On libère la mémoire en supprimant l'URL temporaire
    URL.revokeObjectURL(url);
}

function exporterTexte() {
    // On parcours chaque élément de notre tableau listeTaches et retourne un nouveau tableau constitué de chaines de caractères
    // Avec .join("\n") on transforme ce tableau en une seule chaine de caractères avec des sauts de ligne entre chaque tâche
    const contenu = listeTaches.map((tache) => {
        return `- ${tache.titre}${tache.priorite? ` | [Priorité : ${tache.priorite}]` : ""}${tache.estTerminee? " | ✔" : ""}`;
    }).join("\n");
    const blob = new Blob([contenu], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = "Liste.txt"
    lien.click()
    URL.revokeObjectURL(url);
}

function importerListe() {
    // On récupère le fichier sélectionné par l'utilisateur via l'input
    const fichier = importInput.files?.[0];
    // Si aucun fichier sélectionné on s'arrête
    if (!fichier) return;
    // On crée un lecteur de fichier
    const reader = new FileReader();
    // on défini ce qu'il se passe quand la lecture est terminée
    reader.onload = (e) => {
        try {
            // On transforme le JSON en tableau TypeScript
            const listeImportee : Tache[] = e.target ? JSON.parse(e.target.result as string) : [];
            // Sécurité : si le fichier importé n'est pas un tableau, on génère une erreur qui affichera l'alerte à l'utilisateur
            if (!Array.isArray(listeImportee)) {
                throw new Error("Format invalide");
            }
            // Sécurité : on contrôle que chaque élément du tableau importé est correctement typé par rapport à ce que l'application demande
            const estValide = listeImportee.every((item) =>
                typeof item.titre === "string" &&
                typeof item.estTerminee === "boolean" &&
                typeof item.id === "string"
            );
            // Si ce n'est pas le cas, on génère une erreur qui affichera l'alerte à l'utilisateur
            if (!estValide) {
                throw new Error ("Format invalide");
            }
            // On vide la liste de tâches actuelle sur l'application
            listeTaches.length = 0;
            // On rempli la liste avec le tableau des données importées
            listeTaches.push(...listeImportee);
            // On sauvegarde cette nouvelle liste
            sauvegarderTaches();
            // On l'affiche sur l'application
            afficherTaches();
            // On ferme la fenêtre modale
            importExportModal.close();
            // On réinitilise l'input après l'import
            importInput.value = "";
        } catch (erreur) {
            alert("Fichier non valide");
        }
    };
    // On lance la lecture du fichier en mode texte
    reader.readAsText(fichier);

}