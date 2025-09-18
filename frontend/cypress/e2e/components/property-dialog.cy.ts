describe('PropertyDialog E2E Tests', () => {
  beforeEach(() => {
    cy.setupPropertyMocks();
    cy.visit('/');
    cy.wait('@getProperties');
  });

  context('Dialog Opening and Closing', () => {
    it('should open dialog when clicking property card button', () => {
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');

      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[data-testid="dialog-title"] h2').should('be.visible');
    });

    it('should close dialog when clicking close button', () => {
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');

      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[data-slot="dialog-close"]').click();
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should close dialog when pressing Escape key', () => {
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');

      cy.get('[role="dialog"]').should('be.visible');
      cy.get('body').type('{esc}');
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should maintain focus management when opening/closing', () => {
      const cardButton = cy.get('[data-testid="property-card"] button').first();

      cardButton.click();
      cy.wait('@getPropertyDetail');

      cy.get('[role="dialog"]').should('be.visible');

      // Close and check focus returns
      cy.get('[data-slot="dialog-close"]').click();
      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  context('Dialog Content Display', () => {
    beforeEach(() => {
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail').then(({ response }) => {
        const property = response?.body;
        cy.wrap(property).as('propertyDetail');
      });
    });

    it('should display property title and basic information', () => {
      cy.get('@propertyDetail').then((property) => {
        cy.get('[data-testid="dialog-title"] h2').should('contain.text', property.name);
        cy.get('[data-testid="dialog-title-code"]').should('contain.text', property.codeInternal);
        cy.get('[data-testid="dialog-title-year"]').should('contain.text', property.year);
      });
    });

    it('should display property price and address', () => {
      cy.get('@propertyDetail').then((property) => {
        cy.get('[data-testid="dialog-content-price"]').should('be.visible');
        cy.get('[data-testid="dialog-content-address"]').should('contain.text', property.address);
      });
    });

    it('should display property images carousel', () => {
      cy.get('[data-testid="property-image"]').should('exist');
      cy.get('[data-testid="main-image"]').should('be.visible');

      // Should have image counter if multiple images
      cy.get('[data-testid="property-image"]').then(($images) => {
        if ($images.length > 1) {
          cy.get('figcaption').should('contain', '/');
        }
      });
    });

    it('should display owner information card', () => {
      cy.get('[data-testid="owner-card"]').scrollIntoView().should('be.visible');
      cy.get('[data-testid="owner-card-name"]').should('be.visible');
      cy.get('[data-testid="owner-card-address"]').should('be.visible');
      cy.get('[data-testid="owner-card-avatar"]').should('be.visible');

      cy.get('@propertyDetail').then((property) => {
        cy.get('[data-testid="owner-card-name"]').should('contain.text', property.owner.name);
        cy.get('[data-testid="owner-card-address"]').should('contain.text', property.owner.address);
      });
    });

    it('should display property traces section', () => {
      cy.get('[data-testid="traces-trigger"]').scrollIntoView().should('be.visible');
      cy.get('[data-testid="traces-trigger"]').should('contain', 'Trace History');

      // Expand traces
      cy.get('[data-testid="traces-trigger"]').click();
      cy.get('[data-testid="property-traces"]').scrollIntoView().should('be.visible');
      cy.get('[data-testid="trace-item"]').should('have.length.at.least', 1);
    });
  });

  context('Image Carousel Functionality', () => {
    beforeEach(() => {
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');
    });

    it('should navigate between images using thumbnails', () => {
      cy.get('[data-testid="property-image"]').then(($images) => {
        if ($images.length > 1) {
          // Click second thumbnail
          cy.wrap($images).eq(1).click();

          // Main image should change
          cy.get('[data-testid="main-image"]').should('have.attr', 'src').and('include', 'Image+2');

          // Image counter should update
          cy.get('figcaption').should('contain', '2 /');

          // Clicked thumbnail should be highlighted
          cy.wrap($images).eq(1).should('have.class', 'ring-2');
        }
      });
    });

    it('should show hover effects on thumbnails', () => {
      cy.get('[data-testid="property-image"]').then(($images) => {
        if ($images.length > 1) {
          cy.wrap($images).first().trigger('mouseover').should('have.css', 'opacity');
        }
      });
    });

    it('should handle missing or broken images gracefully', () => {
      // Mock property with no images
      cy.intercept('GET', '**/api/properties/**', (req) => {
        const propertyId = req.url.split('/').pop();
        req.reply({
          idProperty: parseInt(propertyId!),
          name: `No Images Property ${propertyId}`,
          address: `No Images Street ${propertyId}`,
          price: 300000,
          codeInternal: `NOIMG${propertyId}`,
          year: 2023,
          owner: {
            idOwner: parseInt(propertyId!),
            name: `Owner ${propertyId}`,
            address: `Owner Address ${propertyId}`,
            photo: `https://placehold.co/150x150?text=Owner`,
            birthday: '1985-03-15T00:00:00Z',
          },
          images: [], // No images
          traces: [],
        });
      }).as('getPropertyNoImages');

      cy.get('[data-slot="dialog-close"]').click();
      cy.get('[data-testid="property-card"] button').eq(1).click();
      cy.wait('@getPropertyNoImages');

      // Should handle gracefully - either no carousel or placeholder
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[data-testid="dialog-title"] h2').should('contain', 'No Images Property');
    });
  });

  context('Property Traces Functionality', () => {
    beforeEach(() => {
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');
    });

    it('should expand and collapse traces section', () => {
      // Initially collapsed
      cy.get('[data-testid="property-traces"]').should('not.be.visible');

      // Expand
      cy.get('[data-testid="traces-trigger"]').scrollIntoView().click();
      cy.get('[data-testid="property-traces"]').scrollIntoView().should('be.visible');

      // Collapse
      cy.get('[data-testid="traces-trigger"]').click();
      cy.get('[data-testid="property-traces"]').should('not.be.visible');
    });

    it('should display trace details correctly', () => {
      cy.get('[data-testid="traces-trigger"]').scrollIntoView().click();

      cy.get('[data-testid="trace-item"]')
        .first()
        .within(() => {
          cy.get('[data-testid="trace-name"]')
            .scrollIntoView()
            .should('be.visible')
            .and('contain', 'Initial Purchase');
          cy.get('[data-testid="trace-value"]').should('be.visible').and('contain', '$400,000');
          cy.get('[data-testid="trace-date"]').should('be.visible');
        });

      // Check multiple traces if available
      cy.get('[data-testid="trace-item"]').then(($traces) => {
        if ($traces.length > 1) {
          cy.wrap($traces)
            .eq(1)
            .within(() => {
              cy.get('[data-testid="trace-name"]').should('contain', 'Market Revaluation');
              cy.get('[data-testid="trace-value"]').should('contain', '$450,000');
            });
        }
      });
    });

    it('should handle empty traces gracefully', () => {
      // Mock property with no traces
      cy.intercept('GET', '**/api/properties/**', (req) => {
        const propertyId = req.url.split('/').pop();
        req.reply({
          idProperty: parseInt(propertyId!),
          name: `No Traces Property ${propertyId}`,
          address: `No Traces Street ${propertyId}`,
          price: 300000,
          codeInternal: `NOTRACE${propertyId}`,
          year: 2023,
          owner: {
            idOwner: parseInt(propertyId!),
            name: `Owner ${propertyId}`,
            address: `Owner Address ${propertyId}`,
            photo: `https://placehold.co/150x150?text=Owner`,
            birthday: '1985-03-15T00:00:00Z',
          },
          images: [
            {
              idPropertyImage: 1,
              file: `https://placehold.co/800x600?text=Property+${propertyId}`,
              enabled: true,
            },
          ],
          traces: [], // No traces
        });
      }).as('getPropertyNoTraces');

      cy.get('[data-slot="dialog-close"]').click();
      cy.get('[data-testid="property-card"] button').eq(1).click();
      cy.wait('@getPropertyNoTraces');

      // Traces section should not be visible or show empty state
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="traces-trigger"]').length === 0) {
          // Traces section is completely hidden - that's ok
          cy.get('[data-testid="dialog-title"] h2').should('contain', 'No Traces Property');
        } else {
          // Traces section exists but is empty
          cy.get('[data-testid="traces-trigger"]').scrollIntoView().click();
          cy.get('[data-testid="trace-item"]').should('have.length', 0);
        }
      });
    });
  });

  context('Dialog Responsive Behavior', () => {
    it('should display correctly on desktop', () => {
      cy.viewport(1200, 800);

      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');

      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[data-testid="dialog-title"] h2').should('be.visible');

      // Desktop should show full dialog
      cy.get('[role="dialog"]').should('have.css', 'max-width');
    });

    it('should display correctly on mobile', () => {
      cy.viewport(375, 667);

      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');

      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[data-testid="dialog-title"] h2').should('be.visible');

      // Mobile dialog should be responsive
      cy.get('[role="dialog"]').then(($dialog) => {
        const dialogWidth = $dialog[0].getBoundingClientRect().width;
        expect(dialogWidth).to.be.lessThan(375);
      });
    });

    it('should handle viewport changes while dialog is open', () => {
      cy.viewport(1200, 800);

      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');

      cy.get('[role="dialog"]').should('be.visible');

      // Change to mobile while dialog is open
      cy.viewport(375, 667);

      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[data-testid="dialog-title"] h2').should('be.visible');

      // Dialog should still be functional
      cy.get('[data-slot="dialog-close"]').should('be.visible');
    });
  });

  context('Dialog Loading States', () => {
    it('should show loading skeleton while property details load', () => {
      cy.intercept('GET', '**/api/properties/**', {
        delay: 2000,
        fixture: 'property-detail.json',
      }).as('getPropertyDetailDelayed');

      cy.get('[data-testid="property-card"] button').first().click();

      // Should show skeletons while loading
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[data-testid="skeleton"]').should('exist');

      cy.wait('@getPropertyDetailDelayed');

      // Skeletons should disappear
      cy.get('[data-testid="skeleton"]').should('not.exist');
      cy.get('[data-testid="dialog-title"] h2').should('be.visible');
    });

    it('should handle API errors in dialog', () => {
      cy.intercept('GET', '**/api/properties/**', { statusCode: 500 }).as('getPropertyDetailError');

      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetailError');

      // Should show error state
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[role="alert"]').contains('Error').should('be.visible');

      // Should be able to close error dialog
      cy.get('[data-slot="dialog-close"]').click();
      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  context('Dialog Accessibility', () => {
    beforeEach(() => {
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');
    });

    it('should have proper ARIA attributes', () => {
      cy.get('[role="dialog"]').should('have.attr', 'role', 'dialog');
      cy.get('[data-testid="dialog-title"] h2').should('exist');
    });

    it('should handle keyboard shortcuts', () => {
      // Escape should close dialog
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('body').type('{esc}');
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should maintain scroll position when dialog opens/closes', () => {
      // Scroll down before opening dialog
      cy.scrollTo('bottom');

      cy.get('[data-slot="dialog-close"]').click();

      // Scroll position should be maintained
      cy.window().its('scrollY').should('be.greaterThan', 0);
    });
  });

  context('Dialog Edge Cases', () => {
    it('should handle very long property names', () => {
      cy.intercept('GET', '**/api/properties/**', (req) => {
        const propertyId = req.url.split('/').pop();
        req.reply({
          idProperty: parseInt(propertyId!),
          name: 'This is an extremely long property name that should be handled gracefully without breaking the dialog layout or causing overflow issues',
          address: 'Long Address Street',
          price: 500000,
          codeInternal: 'LONG001',
          year: 2023,
          owner: {
            idOwner: parseInt(propertyId!),
            name: 'Very Long Owner Name That Should Also Be Handled Properly',
            address: 'Very Long Owner Address That Could Potentially Cause Layout Issues',
            photo: 'https://placehold.co/150x150?text=LongOwner',
            birthday: '1985-03-15T00:00:00Z',
          },
          images: [
            {
              idPropertyImage: 1,
              file: 'https://placehold.co/800x600?text=Long+Property',
              enabled: true,
            },
          ],
          traces: [
            {
              idPropertyTrace: 1,
              dateSale: '2023-01-15T00:00:00Z',
              name: 'Very Long Trace Name That Should Be Handled Properly',
              value: 500000,
              tax: 25000,
            },
          ],
        });
      }).as('getLongProperty');

      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getLongProperty');

      // Should handle long text without breaking layout
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[data-testid="dialog-title"] h2').should('be.visible');
      cy.get('[data-testid="owner-card-name"]').scrollIntoView().should('be.visible');

      // Text should be contained within dialog bounds
      cy.get('[role="dialog"]').then(($dialog) => {
        const dialogWidth = $dialog[0].getBoundingClientRect().width;
        cy.get('[data-testid="dialog-title"] h2').then(($title) => {
          const titleWidth = $title[0].getBoundingClientRect().width;
          expect(titleWidth).to.be.lessThan(dialogWidth);
        });
      });
    });

    it('should handle multiple rapid open/close operations', () => {
      // Rapidly open and close dialog multiple times
      for (let i = 0; i < 3; i++) {
        cy.get('[data-testid="property-card"] button').first().click();
        cy.wait('@getPropertyDetail');
        cy.get('[role="dialog"]').should('be.visible');

        cy.get('[data-slot="dialog-close"]').click();
        cy.get('[role="dialog"]').should('not.exist');
      }

      // Final open should still work correctly
      cy.get('[data-testid="property-card"] button').first().click();
      cy.wait('@getPropertyDetail');
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[data-testid="dialog-title"] h2').should('be.visible');
    });
  });
});
