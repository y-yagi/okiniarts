describe('Create atrist', function() {
  beforeEach(function setUser () {
    cy.login()
      .then((resp) => { return resp.body; })
      .then((body) => {
        const {access_token, expires_in, id_token} = body;
        cy.visit('http://localhost:3000/', {
          onBeforeLoad(win) {
            const expires_at = JSON.stringify(expires_in * 1000 + new Date().getTime());
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("id_token", id_token);
            localStorage.setItem("expires_at", expires_at);
          }
        });
      });
  })

  it('Show TOP page', () => {
    cy.contains('List of Arts')
  })

  it('Show Artist', () => {
    cy.get('[href="/artists"]').click()
    cy.get('a').contains('クロード・モネ').click()

    cy.contains('印象派を代表するフランスの画家')
  })

  it('Create And Delete Artist', () => {
    cy.get('[href="/artists/new"]').click()
    cy.get('input').type('下村観山')
    cy.get('textarea').type('昭和初期の日本画家。')

    cy.get('button').click()
    cy.contains('Artist was successfully created')

    cy.get('[href="/artists"]').click()
    cy.get('a').contains('下村観山').click()

    cy.contains('昭和初期の日本画家。')

    cy.get('button').contains('Destroy').click()
    cy.get('button').contains('OK').click()
    cy.contains('Artist was successfully deleted')
  })
})
