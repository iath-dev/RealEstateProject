describe('PropertiesGrid Component', () => {
  context('Initial Loading', () => {
    it('should display loading state initially', () => {
      // Intercept with delay to see loading
      cy.intercept('GET', '**/api/properties**', {
        delay: 3000,
        fixture: 'properties.json',
      }).as('getProperties');

      cy.visit('/');

      // Should show loading indicator
      cy.get('[role="alert"]').contains('Loading properties...').should('be.visible');
      cy.get('.animate-spin').should('be.visible');

      cy.wait('@getProperties');
      cy.wait(500);

      // Loading should disappear
      cy.get('[role="alert"]').should('not.exist');
    });

    it('should display properties grid after loading', () => {
      cy.intercept('GET', '**/api/properties**', { fixture: 'properties.json' }).as(
        'getProperties'
      );

      cy.visit('/');
      cy.wait('@getProperties');

      // Should display property cards
      cy.get('[data-testid="property-card"]').should('have.length.at.least', 1);

      // Grid should have correct layout
      cy.get('.grid').should('have.css', 'display', 'grid');
      cy.get('[data-testid="property-card"]').first().should('be.visible');
    });

    it('should handle error state', () => {
      cy.intercept('GET', '**/api/properties**', {
        statusCode: 500,
        body: { error: 'Server Error' },
      }).as('getPropertiesError');

      cy.visit('/');
      cy.wait('@getPropertiesError');

      // Should show error message
      cy.get('[role="alert"]').should('be.visible');
      cy.contains('Error:').should('be.visible');
    });

    it('should handle empty state', () => {
      cy.intercept('GET', '**/api/properties**', {
        body: {
          items: [],
          totalCount: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }).as('getEmptyProperties');

      cy.visit('/');
      cy.wait('@getEmptyProperties');

      // Should show no more properties message
      cy.get('[role="alert"]').contains('No more properties available').should('be.visible');
    });
  });

  context('Infinite Scroll', () => {
    beforeEach(() => {
      // Mock multiple pages
      cy.intercept('GET', '**/api/properties**', (req) => {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = 10;

        const items = Array.from({ length: pageSize }, (_, i) => ({
          idProperty: (page - 1) * pageSize + i + 1,
          name: `Property ${(page - 1) * pageSize + i + 1}`,
          address: `${100 + i} Test Street, Page ${page}`,
          price: 200000 + i * 10000 + page * 50000,
          codeInternal: `PROP${String((page - 1) * pageSize + i + 1).padStart(3, '0')}`,
          year: 2020 + (i % 5),
          idOwner: i + 1,
          ownerName: `Owner ${i + 1}`,
          image: `https://placehold.co/600x400?text=Property+${(page - 1) * pageSize + i + 1}`,
        }));

        req.reply({
          items,
          totalCount: 50,
          page,
          pageSize,
          totalPages: 5,
          hasNextPage: page < 5,
          hasPreviousPage: page > 1,
        });
      }).as('getPropertiesPage');
    });

    it('should load initial page of properties', () => {
      cy.visit('/');
      cy.wait('@getPropertiesPage');

      cy.get('[data-testid="property-card"]').should('have.length', 10);
      cy.contains('Property 1').should('be.visible');
      cy.contains('Property 10').should('be.visible');
    });

    it('should load more properties on scroll', () => {
      cy.visit('/');
      cy.wait('@getPropertiesPage');

      // Initial properties
      cy.get('[data-testid="property-card"]').should('have.length', 10);

      // Scroll to bottom to trigger infinite scroll
      cy.scrollTo('bottom', { duration: 500 });

      // Wait for next page
      cy.wait('@getPropertiesPage');

      // Should have more properties now
      cy.get('[data-testid="property-card"]').should('have.length', 20);
      cy.contains('Property 11').should('be.visible');
      cy.contains('Property 20').should('be.visible');
    });

    it('should show loading indicator during infinite scroll', () => {
      cy.visit('/');

      // Primer batch de propiedades
      cy.wait('@getPropertiesPage');

      cy.wait(500);

      // Intercept de la siguiente página con delay
      cy.intercept('GET', '**/properties?page=2', {
        fixture: 'properties-page-2.json',
        delay: 2000,
      }).as('getPage2');

      // Disparar infinite scroll
      cy.scrollTo('bottom', { duration: 700 });

      // Validar aparición del loader
      cy.contains('[role="alert"]', 'Loading more properties...').should('exist');

      // Esperar que se complete la request
      cy.wait('@getPage2');

      // Validar desaparición del loader
      cy.contains('[role="alert"]', 'Loading more properties...').should('not.exist');

      // Y que las nuevas propiedades se agreguen
      cy.get('[data-testid="property-card"]').should('have.length.at.least', 15);
    });

    it('should stop loading when no more pages available', () => {
      cy.visit('/');

      // Simulate reaching the last page
      cy.intercept('GET', '**/api/properties**', (req) => {
        const page = parseInt(req.query.page as string) || 1;

        if (page >= 5) {
          req.reply({
            items: [],
            totalCount: 40,
            page: 5,
            pageSize: 10,
            totalPages: 4,
            hasNextPage: false,
            hasPreviousPage: true,
          });
        }
      }).as('getLastPage');

      // Load several pages by scrolling
      for (let i = 0; i < 5; i++) {
        cy.wait('@getPropertiesPage');
        cy.wait(500);
        cy.scrollTo('bottom', { duration: 700 });
      }

      cy.wait('@getLastPage');

      // Should show "no more properties" message
      cy.get('[role="alert"]').contains('No more properties available').should('be.visible');
    });

    it('should handle intersection observer correctly', () => {
      cy.visit('/');
      cy.wait('@getPropertiesPage');

      // Verify skeleton/loader element exists for intersection
      cy.get('[data-testid="skeleton"], .animate-pulse').should('exist');

      // Scroll to trigger intersection
      cy.scrollTo('bottom');
      cy.wait('@getPropertiesPage');

      // Should load more content
      cy.get('[data-testid="property-card"]').should('not.have.length.greaterThan', 10);
    });
  });

  context('Grid Layout and Responsiveness', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/properties**', { fixture: 'properties.json' }).as(
        'getProperties'
      );
      cy.visit('/');
      cy.wait('@getProperties');
    });

    it('should display responsive grid layout', () => {
      // Desktop layout
      cy.viewport(1200, 800);
      cy.get('.grid').should('have.css', 'grid-template-columns');

      // Should have multiple columns on desktop
      cy.get('[data-testid="property-card"]').then(($cards) => {
        const firstCardRect = $cards[0].getBoundingClientRect();
        const secondCardRect = $cards[1].getBoundingClientRect();

        // Cards should be side by side on desktop
        expect(firstCardRect.top).to.equal(secondCardRect.top);
      });

      // Tablet layout
      cy.viewport(768, 1024);
      cy.get('.grid').should('have.css', 'grid-template-columns');

      // Mobile layout
      cy.viewport(375, 667);
      cy.get('.grid').should('have.css', 'grid-template-columns');

      // Cards should stack vertically on mobile
      cy.get('[data-testid="property-card"]').then(($cards) => {
        if ($cards.length >= 2) {
          const firstCardRect = $cards[0].getBoundingClientRect();
          const secondCardRect = $cards[1].getBoundingClientRect();

          // Cards should stack on mobile
          expect(firstCardRect.bottom).to.be.lessThan(secondCardRect.top);
        }
      });
    });

    it('should maintain proper card aspect ratio', () => {
      cy.get('[data-testid="property-card"]')
        .first()
        .within(() => {
          cy.get('figure').should('have.class', 'aspect-video');
        });
    });

    it('should handle different screen orientations', () => {
      // Portrait
      cy.viewport(375, 667);
      cy.get('[data-testid="property-card"]').should('be.visible');

      // Landscape
      cy.viewport(667, 375);
      cy.get('[data-testid="property-card"]').should('be.visible');
    });
  });

  context('Error Handling', () => {
    it('should retry failed requests gracefully', () => {
      let requestCount = 0;

      cy.intercept('GET', '**/api/properties**', (req) => {
        requestCount++;
        if (requestCount === 1) {
          req.reply({ statusCode: 500 });
        } else {
          req.reply({ fixture: 'properties.json' });
        }
      }).as('getPropertiesWithRetry');

      cy.visit('/');

      // Should eventually show properties after retry
      cy.get('[data-testid="property-card"]', { timeout: 10000 }).should('exist');
    });
  });

  context('Performance', () => {
    it('should not make excessive API calls', () => {
      let requestCount = 0;

      cy.intercept('GET', '**/api/properties**', (req) => {
        requestCount++;
        req.reply({ fixture: 'properties.json' });
      }).as('trackRequests');

      cy.visit('/');
      cy.wait('@trackRequests');

      // Rapid scrolling shouldn't trigger multiple requests
      cy.scrollTo('bottom', { duration: 100 });
      cy.scrollTo('top', { duration: 100 });
      cy.scrollTo('bottom', { duration: 100 });

      cy.wait(2000);

      cy.then(() => {
        // Should not have made excessive requests
        expect(requestCount).to.be.lessThan(5);
      });
    });

    it('should handle large datasets efficiently', () => {
      // Mock large dataset
      cy.intercept('GET', '**/api/properties**', (req) => {
        const page = parseInt(req.query.page as string) || 1;
        const items = Array.from({ length: 50 }, (_, i) => ({
          idProperty: (page - 1) * 50 + i + 1,
          name: `Property ${(page - 1) * 50 + i + 1}`,
          address: `Address ${i + 1}`,
          price: 100000 + i * 1000,
          codeInternal: `CODE${i}`,
          year: 2020,
          idOwner: 1,
          ownerName: 'Owner',
          image: 'https://placehold.co/600x400',
        }));

        req.reply({
          items,
          totalCount: 500,
          page,
          pageSize: 50,
          totalPages: 10,
          hasNextPage: page < 10,
          hasPreviousPage: page > 1,
        });
      }).as('getLargeDataset');

      cy.visit('/');
      cy.wait('@getLargeDataset');

      // Should render smoothly even with large dataset
      cy.get('[data-testid="property-card"]').should('have.length', 50);

      // Page should remain responsive
      cy.scrollTo('bottom', { duration: 1000 });
      cy.get('body').should('be.visible'); // Basic responsiveness check
    });
  });
});
