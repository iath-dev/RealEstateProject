describe('PropertyFilters Component', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '**/api/properties**', { fixture: 'properties.json' }).as('getProperties');

    cy.visit('/');
    cy.wait('@getProperties');
  });

  context('Desktop Filters', () => {
    beforeEach(() => {
      cy.viewport(1200, 800); // Desktop viewport
    });

    it('should display all filter inputs in desktop view', () => {
      cy.get('[placeholder="Name"]').should('be.visible');
      cy.get('[placeholder="Address"]').should('be.visible');
      cy.get('[placeholder="Min Price"]').should('be.visible');
      cy.get('[placeholder="Max Price"]').should('be.visible');
    });

    it('should apply name filter and show badge', () => {
      const filterValue = 'Villa';

      // Mock filtered response
      cy.intercept('GET', '**/api/properties**', (req) => {
        if (req.query.name === filterValue) {
          req.reply({ fixture: 'filtered-properties.json' });
        }
      }).as('getFilteredProperties');

      cy.get('[placeholder="Name"]').type(filterValue);

      // Wait for debounce
      cy.wait(800);
      cy.wait('@getFilteredProperties');

      // Check filter badge appears
      cy.get('[role="button"]').contains(`Name: ${filterValue}`).should('be.visible');
    });

    it('should apply price range filters', () => {
      const minPrice = '200000';
      const maxPrice = '500000';

      cy.intercept('GET', '**/api/properties**', (req) => {
        if (req.query.minPrice === minPrice && req.query.maxPrice === maxPrice) {
          req.reply({ fixture: 'price-filtered-properties.json' });
        }
      }).as('getPriceFilteredProperties');

      cy.get('[placeholder="Min Price"]').type(minPrice);
      cy.get('[placeholder="Max Price"]').type(maxPrice);

      cy.wait(800); // Debounce
      cy.wait('@getPriceFilteredProperties');

      // Check both badges appear
      cy.get('[role="button"]').contains(`Min Price: ${minPrice}`).should('be.visible');

      cy.get('[role="button"]').contains(`Max Price: ${maxPrice}`).should('be.visible');
    });

    it('should clear individual filter badge', () => {
      const filterValue = 'Test Property';

      cy.get('[placeholder="Name"]').type(filterValue);
      cy.wait(800);

      // Verify badge exists
      cy.get('[role="button"]').contains(`Name: ${filterValue}`).should('be.visible').click();

      // Verify badge is removed and input is cleared
      cy.get('[role="button"]').contains(`Name: ${filterValue}`).should('not.exist');

      cy.get('[placeholder="Name"]').should('have.value', '');
    });

    it('should clear all filters at once', () => {
      // Apply multiple filters
      cy.get('[placeholder="Name"]').type('Villa');
      cy.get('[placeholder="Address"]').type('Downtown');
      cy.get('[placeholder="Min Price"]').type('300000');

      cy.wait(800);

      // Verify multiple badges exist
      cy.get('[role="button"]').contains('Name: Villa').should('be.visible');
      cy.get('[role="button"]').contains('Address: Downtown').should('be.visible');
      cy.get('[role="button"]').contains('Min Price: 300000').should('be.visible');

      // Clear all
      cy.get('[role="button"]').contains('Clear all').should('be.visible').click();

      // Verify all badges are gone and inputs are cleared
      cy.get('[role="button"]').contains('Name:').should('not.exist');
      cy.get('[role="button"]').contains('Address:').should('not.exist');
      cy.get('[role="button"]').contains('Min Price:').should('not.exist');
      cy.get('[role="button"]').contains('Clear all').should('not.exist');

      cy.get('[placeholder="Name"]').should('have.value', '');
      cy.get('[placeholder="Address"]').should('have.value', '');
      cy.get('[placeholder="Min Price"]').should('have.value', '');
    });
  });

  context('Mobile Filters', () => {
    beforeEach(() => {
      cy.viewport(375, 667); // Mobile viewport
    });

    it('should show filter button and popover in mobile view', () => {
      // Name should be visible
      cy.get('[placeholder="Name"]').should('be.visible');

      // Other filters should be hidden
      cy.get('[placeholder="Address"]').should('not.be.visible');

      // Filter button should be visible
      cy.get('[title="Show filters"]').should('be.visible');
    });

    it('should open popover and apply filters in mobile', () => {
      // Open popover
      cy.get('[title="Show filters"]').click();

      // Verify popover content is visible
      cy.get('[data-slot="popover-content"]').should('be.visible');
      cy.get('[data-slot="popover-content"] [placeholder="Address"]').should('be.visible');
      cy.get('[data-slot="popover-content"] [placeholder="Min Price"]').should('be.visible');
      cy.get('[data-slot="popover-content"] [placeholder="Max Price"]').should('be.visible');

      // Apply filters through popover
      cy.get('[data-slot="popover-content"] [placeholder="Address"]').type('Downtown');
      cy.get('[data-slot="popover-content"] [placeholder="Min Price"]').type('250000');

      // Close popover by clicking outside
      cy.get('body').click(0, 0);

      cy.wait(800);

      // Verify badges appear
      cy.get('[role="button"]').contains('Address: Downtown').should('be.visible');
      cy.get('[role="button"]').contains('Min Price: 250000').should('be.visible');
    });

    it('should handle responsive behavior correctly', () => {
      // Start in mobile, apply filter
      cy.get('[placeholder="Name"]').type('Mobile Test');
      cy.wait(800);

      cy.get('[role="button"]').contains('Name: Mobile Test').should('be.visible');

      // Resize to desktop
      cy.viewport(1200, 800);

      // All filters should now be visible
      cy.get('[placeholder="Name"]').should('be.visible').and('have.value', 'Mobile Test');
      cy.get('[placeholder="Address"]').should('be.visible');
      cy.get('[placeholder="Min Price"]').should('be.visible');
      cy.get('[placeholder="Max Price"]').should('be.visible');

      // Filter button should be hidden
      cy.get('[title="Show filters"]').should('not.exist');

      // Badge should still be there
      cy.get('[role="button"]').contains('Name: Mobile Test').should('be.visible');
    });
  });

  context('Filter Debounce', () => {
    it('should debounce filter requests', () => {
      let requestCount = 1;

      cy.intercept('GET', '**/api/properties**', (req) => {
        requestCount++;
        req.reply({ fixture: 'properties.json' });
      }).as('getDebouncedProperties');

      // Type multiple characters quickly
      cy.get('[placeholder="Name"]').type('V').type('i').type('l').type('l').type('a');

      // Should not make multiple requests immediately
      cy.wait(100);

      // Wait for debounce to complete
      cy.wait(800);
      cy.wait('@getDebouncedProperties');

      // Should have made only one request after debounce
      cy.then(() => {
        expect(requestCount).to.equal(2); // Initial load + debounced request
      });
    });
  });

  context('Filter Validation', () => {
    it('should handle numeric input for price filters', () => {
      cy.get('[placeholder="Min Price"]').type('abc123def');
      cy.get('[placeholder="Min Price"]').should('have.value', '123');

      cy.get('[placeholder="Max Price"]').type('999.99');
      cy.get('[placeholder="Max Price"]').should('have.value', '999.99');
    });

    it('should handle empty filters gracefully', () => {
      // Apply filter then clear it
      cy.get('[placeholder="Name"]').type('Test').clear();

      cy.wait(800);

      // Should not show badge for empty filter
      cy.get('[role="button"]').contains('Name:').should('not.exist');
    });
  });
});
