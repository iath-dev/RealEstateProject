/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />


declare global {
  namespace Cypress {
    interface Chainable {
      setupPropertyMocks(): Chainable<void>;
      waitForPropertiesLoad(): Chainable<void>;
      applyPropertyFilters(filters: PropertyFilters): Chainable<void>;
      openPropertyDialog(index?: number): Chainable<void>;
      closePropertyDialog(): Chainable<void>;
      scrollToLoadMore(times?: number): Chainable<void>;
      checkResponsiveLayout(): Chainable<void>;
      simulateNetworkDelay(delay?: number): Chainable<void>;
      verifyPropertyCard(property: PropertyData): Chainable<void>;
      verifyPropertyDialog(property: PropertyDetailData): Chainable<void>;
      clearAllFilters(): Chainable<void>;
      checkAccessibility(): Chainable<void>;
    }
  }
}

interface PropertyFilters {
  name?: string;
  address?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface PropertyData {
  idProperty: number;
  name: string;
  address: string;
  price: number;
  year: number;
  ownerName: string;
}

interface PropertyDetailData extends PropertyData {
  codeInternal: string;
  owner: {
    name: string;
    address: string;
    photo: string;
  };
  images: Array<{ file: string }>;
  traces: Array<{
    name: string;
    value: number;
    dateSale: string;
  }>;
}

beforeEach(() => {
  // Limpiar estado
  cy.clearCookies();
  cy.clearLocalStorage();

  // Viewport por defecto
  cy.viewport(1280, 720);

  // Configurar API base URL
  Cypress.env('apiUrl', 'http://localhost:5000/api');
});

// Setup comprehensive property API mocks
Cypress.Commands.add('setupPropertyMocks', () => {
  
  cy.intercept('GET', '**/properties/[0-9]*', (req) => {
    const url = req.url;
    const propertyIdMatch = url.match(/\/properties\/(\d+)$/);

    if (propertyIdMatch) {
      const propertyId = propertyIdMatch[1];
      console.log(`🏠 Property detail request for ID: ${propertyId}`);

      req.reply({
        idProperty: parseInt(propertyId),
        name: `Detailed Property ${propertyId}`,
        address: `${propertyId} Detailed Street, Detailed City`,
        price: 450000 + parseInt(propertyId) * 10000,
        codeInternal: `DETAIL${propertyId}`,
        year: 2023,
        owner: {
          idOwner: parseInt(propertyId),
          name: `Property Owner ${propertyId}`,
          address: `${propertyId} Owner Avenue`,
          photo: `https://placehold.co/150x150?text=Owner+${propertyId}`,
          birthday: '1985-03-15T00:00:00Z',
        },
        images: [
          {
            idPropertyImage: 1,
            file: `https://placehold.co/800x600?text=Image+1+Property+${propertyId}`,
            enabled: true,
          },
          {
            idPropertyImage: 2,
            file: `https://placehold.co/800x600?text=Image+2+Property+${propertyId}`,
            enabled: true,
          },
          {
            idPropertyImage: 3,
            file: `https://placehold.co/800x600?text=Image+3+Property+${propertyId}`,
            enabled: true,
          },
        ],
        traces: [
          {
            idPropertyTrace: 1,
            dateSale: '2023-01-15T00:00:00Z',
            name: 'Initial Purchase',
            value: 400000,
            tax: 20000,
          },
          {
            idPropertyTrace: 2,
            dateSale: '2023-08-20T00:00:00Z',
            name: 'Market Revaluation',
            value: 450000,
            tax: 22500,
          },
        ],
      });
    } else {
      req.continue();
    }
  }).as('getPropertyDetail');

  cy.intercept('GET', '**/properties*', (req) => {
    console.log('📋 Properties request:', req.url, req.query);

    const { page, name, address, minPrice, maxPrice } = req.query;

    if (page === '2') {
      req.reply({ fixture: 'properties-page-2' });
      return;
    }

    if (name || address || minPrice || maxPrice) {
      req.reply({ fixture: 'filtered-properties' });
      return;
    }

    // Default
    req.reply({ fixture: 'properties' });
  }).as('getProperties');
});

// Wait for properties to load completely
Cypress.Commands.add('waitForPropertiesLoad', () => {
  cy.wait('@getProperties');
  cy.get('[data-testid="property-card"]').should('be.visible');
  cy.get('[role="alert"]').contains('Loading properties...').should('not.exist');
});

// Apply property filters with debounce handling
Cypress.Commands.add('applyPropertyFilters', (filters: PropertyFilters) => {
  if (filters.name) {
    cy.get('[placeholder="Name"]').clear().type(filters.name);
  }

  if (filters.address) {
    // Handle mobile popover if needed
    cy.get('body').then(($body) => {
      if ($body.find('[title="Show filters"]').is(':visible')) {
        cy.get('[title="Show filters"]').click();
        cy.get('[data-slot="popover-content"] [placeholder="Address"]').type(filters.address!);
        cy.get('body').click(0, 0); // Close popover
      } else {
        cy.get('[placeholder="Address"]').clear().type(filters.address!);
      }
    });
  }

  if (filters.minPrice) {
    cy.get('body').then(($body) => {
      if ($body.find('[title="Show filters"]').is(':visible')) {
        cy.get('[title="Show filters"]').click();
        cy.get('[data-slot="popover-content"] [placeholder="Min Price"]').type(filters.minPrice!);
        cy.get('body').click(0, 0);
      } else {
        cy.get('[placeholder="Min Price"]').clear().type(filters.minPrice!);
      }
    });
  }

  if (filters.maxPrice) {
    cy.get('body').then(($body) => {
      if ($body.find('[title="Show filters"]').is(':visible')) {
        cy.get('[title="Show filters"]').click();
        cy.get('[data-slot="popover-content"] [placeholder="Max Price"]').type(filters.maxPrice!);
        cy.get('body').click(0, 0);
      } else {
        cy.get('[placeholder="Max Price"]').clear().type(filters.maxPrice!);
      }
    });
  }

  // Wait for debounce
  cy.wait(800);
});

// Open property dialog
Cypress.Commands.add('openPropertyDialog', (index = 0) => {
  cy.get('[data-testid="property-card"]').eq(index).click();
  cy.wait('@getPropertyDetail');
  cy.get('[role="dialog"]').should('be.visible');
});

// Close property dialog
Cypress.Commands.add('closePropertyDialog', () => {
  cy.get('[data-testid="close-dialog"]').click();
  cy.get('[role="dialog"]').should('not.exist');
});

// Perform infinite scroll
Cypress.Commands.add('scrollToLoadMore', (times = 1) => {
  for (let i = 0; i < times; i++) {
    const currentCount = Cypress.$('[data-testid="property-card"]').length;

    cy.scrollTo('bottom');
    cy.wait('@getProperties');

    // Wait for new items to load
    cy.get('[data-testid="property-card"]').should('have.length.greaterThan', currentCount);
  }
});

// Check responsive layout
Cypress.Commands.add('checkResponsiveLayout', () => {
  // Desktop
  cy.viewport(1200, 800);
  cy.get('[placeholder="Address"]').should('be.visible');
  cy.get('[title="Show filters"]').should('not.be.visible');

  // Tablet
  cy.viewport(768, 1024);
  cy.get('[data-testid="property-card"]').should('be.visible');

  // Mobile
  cy.viewport(375, 667);
  cy.get('[title="Show filters"]').should('be.visible');
  cy.get('[placeholder="Address"]').should('not.be.visible');
});

// Simulate network delay
Cypress.Commands.add('simulateNetworkDelay', (delay = 1000) => {
  cy.intercept('GET', '**/properties**', {
    delay,
    fixture: 'properties.json',
  }).as('getPropertiesDelayed');
});

// Verify property card content
Cypress.Commands.add('verifyPropertyCard', (property: PropertyData) => {
  cy.get('[data-testid="property-card"]').within(() => {
    cy.contains(property.name).should('be.visible');
    cy.contains(property.address).should('be.visible');
    cy.contains(`$${property.price.toLocaleString()}`).should('be.visible');
  });
});

// Verify property dialog content
Cypress.Commands.add('verifyPropertyDialog', (property: PropertyDetailData) => {
  cy.get('[role="dialog"]').within(() => {
    cy.get('[data-testid="property-title"]').should('contain', property.name);
    cy.get('[data-testid="property-address"]').should('contain', property.address);
    cy.get('[data-testid="property-price"]').should(
      'contain',
      `$${property.price.toLocaleString()}`
    );
    cy.get('[data-testid="property-code"]').should('contain', property.codeInternal);
    cy.get('[data-testid="owner-name"]').should('contain', property.owner.name);

    if (property.images.length > 0) {
      cy.get('[data-testid="property-images"]').should('be.visible');
      cy.get('[data-testid="main-image"]').should('be.visible');
    }

    if (property.traces.length > 0) {
      cy.get('[data-testid="traces-trigger"]').click();
      property.traces.forEach((trace) => {
        cy.contains(trace.name).should('be.visible');
        cy.contains(`$${trace.value.toLocaleString()}`).should('be.visible');
      });
    }
  });
});

// Clear all active filters
Cypress.Commands.add('clearAllFilters', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[role="button"]:contains("Clear all")').length > 0) {
      cy.get('[role="button"]').contains('Clear all').click();
    }
  });

  // Verify all filters are cleared
  cy.get('[placeholder="Name"]').should('have.value', '');
  cy.get('[role="button"]').contains('Name:').should('not.exist');
});

// Basic accessibility checks
Cypress.Commands.add('checkAccessibility', () => {
  // Check for proper heading structure
  cy.get('h1').should('exist');

  // Check for ARIA labels
  cy.get('[role="alert"]').should('exist');
  cy.get('[role="button"]').should('exist');

  // Check keyboard navigation
  cy.get('body').type('{tab}');
  cy.focused().should('be.visible');

  // Check image alt texts
  cy.get('img').each(($img) => {
    cy.wrap($img).should('have.attr', 'alt');
  });
});

// 🚫 MANEJAR ERRORES COMUNES DE REACT/VITE
Cypress.on('uncaught:exception', (err) => {
  // Errores que puedes ignorar en tu app
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
  // Exponer QueryClient globalmente para debugging
  win.__CYPRESS_TESTING__ = true;
});

// 📊 LOGGING ESPECÍFICO DEL PROYECTO
beforeEach(() => {
  const testName = Cypress.currentTest.title;
  cy.task('log', `🏠 Real Estate Test: ${testName}`);
});

// 🎯 COMANDOS DISPONIBLES EN TODAS LAS PRUEBAS
// Ahora puedes usar en cualquier prueba:
// - cy.setupPropertyMocks()
// - cy.waitForPropertiesLoad()
// - cy.applyPropertyFilters({...})
// - cy.openPropertyDialog()
// - etc.

// 📱 CONFIGURAR RESPONSIVE TESTING
const commonViewports = [
  { width: 1920, height: 1080, name: 'Desktop XL' },
  { width: 1280, height: 720, name: 'Desktop' },
  { width: 768, height: 1024, name: 'Tablet' },
  { width: 375, height: 667, name: 'Mobile' },
];

// Hacer viewports disponibles globalmente
Cypress.env('commonViewports', commonViewports);

export {};
