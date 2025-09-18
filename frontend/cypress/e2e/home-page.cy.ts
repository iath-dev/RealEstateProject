describe('HomePage E2E Tests', () => {
  beforeEach(() => {
    // Set up comprehensive mocks
    cy.setupPropertyMocks();
    cy.visit('/');
  });

  context('Page full course', () => {
    it('should complete full property browsing workflow', () => {
      // 1. Page loads with hero and initial properties
      cy.get('h1').contains('Real Estate').should('be.visible');
      cy.get('p').contains('Explore and invest in tokenized real estate').should('be.visible');

      // Wait for properties to load
      cy.wait('@getProperties');
      cy.get('[data-testid="property-card"]').should('have.length.at.least', 1);

      // 2. Apply filters to find specific property
      cy.get('[placeholder="Name"]').type('Villa');
      cy.wait(800); // Debounce
      cy.wait('@getProperties');

      // Verify filter badge
      cy.get('[role="button"]').contains('Name: Villa').should('be.visible');

      // 3. Add price range filter
      cy.get('[placeholder="Min Price"]').type('400000');
      cy.get('[placeholder="Max Price"]').type('800000');
      cy.wait(800);

      // 4. Browse filtered results
      cy.get('[data-testid="property-card"]').should('be.visible');

      // 5. Open property details
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail').then(({ response }) => {
        const property = response?.body;

        cy.wrap(property).as('propertyDetail');
      });

      // 6. Explore property details thoroughly
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('@propertyDetail').then((data) => {
        cy.get('[data-testid="dialog-title"] h2').should('contain.text', data.name);
      });

      // Check property info
      cy.get('[data-testid="dialog-content-price"]').should('be.visible');
      cy.get('[data-testid="dialog-content-address"]').should('be.visible');
      cy.get('[data-testid="dialog-title-code"]').should('be.visible');
      cy.get('[data-testid="dialog-title-year"]').should('be.visible');

      // 7. Navigate through images
      cy.get('[data-testid="property-image"]').should('exist');
      cy.get('[data-testid="main-image"]').should('have.length.at.least', 1);

      if (
        cy
          .get('[data-testid="property-image"]')
          .its('length')
          .then((length) => length > 1)
      ) {
        cy.get('[data-testid="property-image"]').eq(1).click();
        cy.get('[data-testid="main-image"]').should('have.attr', 'src').and('include', 'Image+2');
      }

      // 8. Check owner information
      cy.get('[data-testid="owner-card"]').scrollIntoView().should('be.visible');
      cy.get('[data-testid="owner-card-name"]').should('be.visible');
      cy.get('[data-testid="owner-card-address"]').should('be.visible');
      cy.get('[data-testid="owner-card-avatar"]').should('be.visible');

      // 9. Expand property traces
      cy.get('[data-testid="traces-trigger"]').scrollIntoView().click();
      cy.get('[data-testid="property-traces"]').scrollIntoView().should('be.visible');
      cy.get('[data-testid="trace-item"]').should('have.length.at.least', 1);

      // Check trace details
      cy.get('[data-testid="trace-item"]')
        .first()
        .within(() => {
          cy.get('[data-testid="trace-name"]').should('be.visible');
          cy.get('[data-testid="trace-value"]').should('be.visible');
          cy.get('[data-testid="trace-date"]').should('be.visible');
        });

      // 10. Close dialog and continue browsing
      cy.get('[data-slot="dialog-close"]').click();
      cy.get('[role="dialog"]').should('not.exist');

      // 11. Clear filters and browse more
      cy.get('[role="button"]').contains('Clear all').click();
      cy.get('[role="button"]').contains('Name:').should('not.exist');

      // 12. Test infinite scroll
      cy.scrollTo('bottom', { duration: 500 });
      cy.wait('@getProperties');

      cy.wait(700);

      cy.scrollTo('bottom');
      cy.get('[data-testid="property-card"]').should('have.length.at.least', 15);
    });
  });

  context('Error Recovery Scenarios', () => {
    it('should handle and recover from API errors gracefully', () => {
      // Start with error
      cy.intercept('GET', '**/api/properties**', { statusCode: 500 }).as('getPropertiesError');

      cy.visit('/');
      cy.wait('@getPropertiesError');

      // Should show error state
      cy.get('[role="alert"]').contains('Error').should('be.visible');

      // Simulate recovery - user retries
      cy.intercept('GET', '**/api/properties**', { fixture: 'properties.json' }).as(
        'getPropertiesSuccess'
      );

      // Reload page (user refresh)
      cy.reload();
      cy.wait('@getPropertiesSuccess');

      // Should now show properties
      cy.get('[data-testid="property-card"]').should('be.visible');
      // cy.get('[role="alert"]').contains('Error').should('not.be.visible');
    });

    it('should handle partial failures in property details', () => {
      cy.wait('@getProperties');

      // Properties load fine, but details fail
      cy.intercept('GET', '**/api/properties/*', { statusCode: 404 }).as('getPropertyDetailError');

      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetailError');

      // Dialog should show error state
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[role="alert"]').contains('Error').should('be.visible');

      // User closes dialog and tries another property
      cy.get('[data-slot="dialog-close"]').click();
      cy.get('[role="dialog"]').should('not.exist');

      // Fix API and try again
      cy.intercept('GET', '**/api/properties/*', { fixture: 'property-detail.json' }).as(
        'getPropertyDetailSuccess'
      );

      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetailSuccess');

      // Should now work properly
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[data-testid="dialog-title"]').should('be.visible');
    });

    it('should handle slow network conditions', () => {
      // Simulate slow initial load
      cy.intercept('GET', '**/api/properties**', {
        delay: 3000,
        fixture: 'properties',
      }).as('getPropertiesSlow');

      cy.visit('/');

      // Should show loading state for extended period
      cy.get('[role="alert"]').contains('Loading properties...').should('be.visible');

      cy.get('.animate-spin').should('be.visible');

      // Eventually loads
      cy.wait('@getPropertiesSlow');
      cy.get('[data-testid="property-card"]').should('be.visible');

      // Simulate slow infinite scroll
      cy.intercept('GET', '**/api/properties**', (req) => {
        if (req.query.page === '2') {
          req.reply({ delay: 2000, fixture: 'properties-page-2.json' });
        }
      }).as('getPage2Slow');

      cy.scrollTo('bottom');

      // Should show loading for next page
      cy.get('[role="alert"]').contains('Loading more properties...').should('be.visible');

      cy.wait('@getPage2Slow');
      cy.get('[data-testid="property-card"]').should('have.length.at.least', 15);
    });
  });

  context('Edge Cases and Boundary Conditions', () => {
    it('should handle missing images gracefully', () => {
      cy.intercept('GET', '**/api/properties**', {
        body: {
          items: [
            {
              idProperty: 1,
              name: 'No Image Property',
              address: 'Image Street',
              price: 400000,
              codeInternal: 'NOIMG001',
              year: 2023,
              idOwner: 1,
              ownerName: 'Owner',
              image: null,
            },
          ],
          totalCount: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }).as('getNoImage');

      cy.visit('/');
      cy.wait('@getNoImage');

      // Should show fallback image or placeholder
      cy.get('[data-testid="property-card"]').should('be.visible');
      cy.get('[data-testid="property-card"] img').should('exist');

      // Image should either be placeholder or have proper fallback
      cy.get('[data-testid="property-card"] img').should('have.attr', 'src');
    });

    it('should handle rapid filter changes without breaking', () => {
      cy.wait('@getProperties');

      // Rapid successive filter changes
      const filters = ['A', 'AB', 'ABC', 'ABCD', 'ABCDE'];

      filters.forEach((filter, index) => {
        cy.get('[placeholder="Name"]').clear().type(filter, { delay: 50 });

        if (index < filters.length - 1) {
          cy.wait(100); // Small delay between changes
        }
      });

      // Wait for final debounce
      cy.wait(800);

      // Should show final filter badge
      cy.get('[role="button"]').contains('Name: ABCDE').should('be.visible');
      cy.get('[placeholder="Name"]').should('have.value', 'ABCDE');
    });
  });

  context('Performance and Accessibility', () => {
    it('should maintain good performance with large datasets', () => {
      // Mock large response
      cy.intercept('GET', '**/api/properties**', (req) => {
        const items = Array.from({ length: 50 }, (_, i) => ({
          idProperty: i + 1,
          name: `Performance Test Property ${i + 1}`,
          address: `${i + 1} Performance Street`,
          price: 200000 + i * 10000,
          codeInternal: `PERF${i.toString().padStart(3, '0')}`,
          year: 2020 + (i % 5),
          idOwner: (i % 5) + 1,
          ownerName: `Owner ${(i % 5) + 1}`,
          image: `https://placehold.co/600x400?text=Property+${i + 1}`,
        }));

        req.reply({
          items,
          totalCount: 500,
          page: 1,
          pageSize: 50,
          totalPages: 10,
          hasNextPage: true,
          hasPreviousPage: false,
        });
      }).as('getLargeDataset');

      cy.visit('/');
      cy.wait('@getLargeDataset');

      // Should render all cards efficiently
      cy.get('[data-testid="property-card"]').should('have.length', 50);

      // Scrolling should be smooth
      cy.scrollTo('bottom', { duration: 2000 });
      cy.scrollTo('top', { duration: 2000 });

      // Page should remain responsive
      cy.get('[placeholder="Name"]').type('Performance', { delay: 0 });
      cy.get('[placeholder="Name"]').should('have.value', 'Performance');
    });
  });

  context('Data Integrity and State Management', () => {
    it('should maintain consistent state across operations', () => {
      cy.wait('@getProperties');

      // Apply filters
      cy.get('[placeholder="Name"]').type('Consistency Test');
      cy.wait(800);

      // Open property
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');

      // Verify state is maintained
      cy.get('[role="dialog"]').should('be.visible');

      // Close and verify filters are still active
      cy.get('[data-slot="dialog-close"]').click();
      cy.get('[role="button"]').contains('Name: Consistency Test').should('be.visible');
      cy.get('[placeholder="Name"]').should('have.value', 'Consistency Test');
    });

    it('should handle concurrent operations correctly', () => {
      cy.wait('@getProperties');

      // Start multiple operations quickly
      cy.get('[placeholder="Name"]').type('Concurrent');
      cy.get('[data-testid="property-card"] button').first().click();

      // Both should complete successfully
      cy.wait('@getPropertyDetail');
      cy.get('[role="dialog"]').should('be.visible');

      cy.get('[data-slot="dialog-close"]').click();
      cy.wait(800); // Wait for filter debounce

      cy.get('[role="button"]').contains('Name: Concurrent').should('be.visible');
    });

    it('should preserve user preferences across page interactions', () => {
      cy.wait('@getProperties');

      // Set viewport and apply filters
      cy.viewport(1200, 800);
      cy.get('[placeholder="Name"]').type('Preference Test');
      cy.get('[placeholder="Min Price"]').type('350000');
      cy.wait(800);

      // Change viewport (simulate device rotation)
      cy.viewport(800, 600);

      // Preferences should be maintained
      cy.get('[placeholder="Name"]').should('have.value', 'Preference Test');
      cy.get('[role="button"]').contains('Name: Preference Test').should('be.visible');
      cy.get('[role="button"]').contains('Min Price: 350000').should('be.visible');

      // Open property dialog
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');

      // Change viewport while dialog is open
      cy.viewport(375, 667);
      cy.get('[role="dialog"]').should('be.visible');

      // Close and verify everything is still consistent
      cy.get('[data-slot="dialog-close"]').click();
      cy.get('[placeholder="Name"]').should('have.value', 'Preference Test');
    });
  });
});
