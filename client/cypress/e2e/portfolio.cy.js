describe('Portfolio E2E test', () => {
  it('navigates through the portfolio and completes the Contact form', () => {
    cy.visit('/')

    cy.contains('h1', 'My Portfolio').should('be.visible')

    cy.contains('button', 'About').click()
    cy.contains('h2', 'About Me').should('be.visible')
    cy.contains('Mahammad Mammadov').should('be.visible')

    cy.contains('button', 'Contact').click()
    cy.contains('h2', 'Contact Me').should('be.visible')

    cy.get('input[name="firstname"]')
      .type('Cypress')
      .should('have.value', 'Cypress')

    cy.get('input[name="lastname"]')
      .type('Test')
      .should('have.value', 'Test')

    cy.get('input[name="contactNumber"]')
      .type('4165550100')
      .should('have.value', '4165550100')

    cy.get('input[name="email"]')
      .type('cypress@example.com')
      .should('have.value', 'cypress@example.com')

    cy.get('textarea[name="message"]')
      .type('Assignment 4 Cypress E2E test.')
      .should('have.value', 'Assignment 4 Cypress E2E test.')

    cy.contains('button', 'Send Message').should('be.visible')
  })
})