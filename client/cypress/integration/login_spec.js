describe('Login page', function() {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('Show login page', () => {
    cy.contains('Log In')
  })
})
