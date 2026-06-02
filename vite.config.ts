import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Remplace 'To-Do-List' par le nom exact de ton dépôt sur GitHub
  base: './', 
  test : {
    // Configuration de vitest
    environment: 'jsdom',       // Simule un environnement navigateur pour tester le code qui manipule le DOM
    globals: true,               // Permet d'utiliser describe, it, expect sans les importer dans les fichiers de test
    setupFiles: ['./src/__tests__/setup.ts']
  }
})