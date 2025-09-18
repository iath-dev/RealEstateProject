// cypress/support/e2e.ts
// Configuración específica para tu proyecto Real Estate

import './commands';

// 🏠 CONFIGURACIONES ESPECÍFICAS PARA REAL ESTATE
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();

  cy.viewport(1280, 720);

  Cypress.env('apiUrl', 'http://localhost:5000/api');
});

// 🚫 MANEJAR ERRORES COMUNES DE REACT/VITE
Cypress.on('uncaught:exception', (err) => {
  
  const ignorableErrors = [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection',
    'Loading chunk',
    'Failed to fetch dynamically imported module',
  ];

  return !ignorableErrors.some((error) => err.message.includes(error));
});

// 🔧 CONFIGURAR REACT QUERY PARA TESTING
Cypress.on('window:before:load', (win) => {
  
  win.__CYPRESS_TESTING__ = true;
});

// 📊 LOGGING ESPECÍFICO DEL PROYECTO
beforeEach(() => {
  const testName = Cypress.currentTest.title;
  cy.task('log', `🏠 Real Estate Test: ${testName}`);
});



// 📱 CONFIGURAR RESPONSIVE TESTING
const commonViewports = [
  { width: 1920, height: 1080, name: 'Desktop XL' },
  { width: 1280, height: 720, name: 'Desktop' },
  { width: 768, height: 1024, name: 'Tablet' },
  { width: 375, height: 667, name: 'Mobile' },
];


Cypress.env('commonViewports', commonViewports);
