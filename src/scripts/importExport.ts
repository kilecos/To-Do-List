// Gestion de la fonctionnalité d'import/export

// Récupération des types, variables et fonctions depuis les autres fichiers
import { afficherTaches, titre } from "./ui";
import { listeTaches, sauvegarderTaches } from "./storage";
import type { Tache } from "./types";

// Définition des constantes à partir des éléments HTML qui vont être utilisés
const importExportModal = document.querySelector("#modal-import-export") as HTMLDialogElement;   // La fenêtre modale qui s'affiche lors du clic sur le bouton correspondant
const firstModal = document.querySelector(".modal-first-content") as HTMLDivElement;             // Le contenu initial de la modale proposant l'import ou l'export
const exportModal = document.querySelector(".modal-export-content") as HTMLDivElement;           // Le contenu de la modale après sélection de l'export
const importModal = document.querySelector(".modal-import-content") as HTMLDivElement;           // Le contenu de la modale après sélection de l'import
const btnOpenModal = document.querySelector("#btn-import-export") as HTMLButtonElement;          // Le bouton servant à ouvrir la fenêtre modale
const btnExport = document.querySelector(".btn-export") as HTMLButtonElement;                    // Le bouton de sélection de l'option export
const btnImport = document.querySelector(".btn-import") as HTMLButtonElement;                    // Le bouton de sélection de l'option import
const btnCancel = document.querySelector(".btn-cancel") as HTMLButtonElement;                    // Le bouton fermant la modale
const btnBack = document.querySelectorAll(".btn-back") as NodeListOf<HTMLButtonElement>;         // Les boutons pour retourner au premier contenu de la modale
const btnJson = document.querySelector(".btn-json") as HTMLButtonElement;                        // Le bouton de sélection d'export d'un format JSON
const btnText = document.querySelector(".btn-texte") as HTMLButtonElement;                       // Le bouton de sélection d'export d'un format txt
const importInput = document.querySelector("#import-input") as HTMLInputElement;                 // L'input qui permet de sélectionner un fichier JSON à importer
const btnConfirmImport = document.querySelector(".btn-confirm") as HTMLButtonElement;            // Le bouton de lancement de l'import d'un fichier JSON

// Définition de la fonction pour afficher les différents état de la fenêtre modale pour l'import/export
// Le paramètre etat correspondra au contenu de la modale à afficher
function afficherEtat(etat : HTMLDivElement) {
    // On cible d'abord tous les contenu possible de la modale et on retire à chacun la classe visible pour masquer ce contenu
    document.querySelectorAll(".modal-ie-content").forEach((modal) => {
        modal.classList.remove("visible");
    });
    // On ajoute ensuite la classe visible à notre contenu passer en paramètre pour n'afficher que celui-ci
    etat.classList.add("visible");
}

// Définition de la fonction contenant tous les écouteurs d'évènement pour afficher la modale, dire quel contenu afficher et lancer les fonction d'import et d'export
// On exporte cette fonction dans main.ts pour quelle se lance et activer les écouteurs d'évènement dès le chargement de la page
export function initialiserImportExport() {
    // Affichage de la modale avec son état initial
    btnOpenModal.addEventListener("click", () => {
        importExportModal.showModal();
        afficherEtat(firstModal);
    });
    // Affichage du contenu proposant les options d'export
    btnExport.addEventListener("click", () => {
        afficherEtat(exportModal);
    });
    // Affichage du contenu de l'interface d'import
    btnImport.addEventListener("click", () => {
        afficherEtat(importModal);
    });
    // Fermeture de la modale par click sur le bouton "Annuler"
    btnCancel.addEventListener("click", () => {
        importExportModal.close();
    });
    // Retour à l'affichage du premier contenu de la modale par clic sur les boutons "Retour"
    btnBack.forEach((btn) => {
        btn.addEventListener("click", () => {
            afficherEtat(firstModal);
        });
    });
    // Fermeture de la modale par clic en dehors de celle-ci
    importExportModal.addEventListener("click", (e) => {
        if (e.target === importExportModal) {
            importExportModal.close();
        }
    });
    // Lancement de la fonction d'exportation d'un fichier JSON contenant notre liste de tâches + fermeture de la modale
    btnJson.addEventListener("click", () => {
        exporterJSON();
        importExportModal.close();
    });
    // Lancement de la fonction d'exportation d'un fichier texte contenant notre liste de tâches + fermeture de la modale
    btnText.addEventListener("click", () => {
        exporterTexte();
        importExportModal.close();
    });
    // Lancement de la fonction d'importation d'un fichier JSON contenant une liste de tâches une fois celui-ci sélectionné dans l'input
    btnConfirmImport.addEventListener("click", () => {
        importerListe();
    });
}

// Définition de la fonction d'exportation de la liste de tâches sous forme d'un fichier JSON
function exporterJSON() {
    // On défini on objet contenu prenant en paramètre le titre de la liste ainsi que le tableau liste de tâches
    const contenu = {
        titre : titre.textContent,
        liste : listeTaches
    };
    // On converti notre objet contenu en une unique chaine de caractères texte au format JSON
    // null, 2 formate avec des indentations
    const contenuExport = JSON.stringify(contenu, null, 2);
    // Un Blob est un objet qui représente des données binaires, c'est le format utilisé par le navigateur pour manipuler des fichiers en mémoire.
    // On lui donne le contenu et lui dit de quel type de fichier il s'agit
    const blob = new Blob([contenuExport], {type: "application/json"});
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

// Définition de la fonction d'exportation de la liste de tâches sous forme d'un fichier texte
function exporterTexte() {
    // On parcours chaque élément de notre tableau listeTaches et retourne un nouveau tableau constitué de chaines de caractères
    const contenu = listeTaches.map((tache) => {
        return `- ${tache.titre}${tache.priorite? ` | [Priorité : ${tache.priorite}]` : ""}${tache.estTerminee? " | ✔" : ""}`;
    });
    // On intègre également le titre qui va être exporté avec la liste
    // Avec .join("\n") on transforme le tableau contenu en une seule chaine de caractères avec des sauts de ligne entre chaque tâche
    const contenuExport = `${titre.textContent}\n\n` + contenu.join("\n");
    const blob = new Blob([contenuExport], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = "Liste.txt"
    lien.click()
    URL.revokeObjectURL(url);
}

// Définition de la fonction d'importation d'un fichier JSON contenant une liste de tâches
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
            const listeImportee : { titre : string, liste : Tache[]} = e.target ? JSON.parse(e.target.result as string) : [];
            // Sécurité : si le fichier importé n'est pas un tableau, on génère une erreur qui affichera l'alerte à l'utilisateur
            if (!Array.isArray(listeImportee.liste)) {
                throw new Error("Format invalide");
            }
            // Sécurité : on contrôle que chaque élément du tableau importé est correctement typé par rapport à ce que l'application demande
            const estValide = listeImportee.liste.every((item) =>
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
            // On modifie le titre actuel de la liste par le titre de la liste importée si ce dernier existe
            titre.textContent = listeImportee.titre ?? "✔ To-Do List";
            // On sauvegarde dans le localStorage le titre importé
            localStorage.setItem("mon-titre", titre.textContent ?? "✔ To-Do List");
            // On rempli la liste avec le tableau des données importées
            listeTaches.push(...listeImportee.liste);
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