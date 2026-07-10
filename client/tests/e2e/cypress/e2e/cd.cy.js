const API_URL = 'http://localhost:5005/api/cds'

const meteora = { title: 'Meteora', artist: 'Linkin Park', year: '2003' }
const chuck = { title: 'Chuck', artist: 'Sum 41', year: '2004' }

beforeEach(() => {
  cy.request(API_URL).then(({ body }) => {
    body.forEach((/** @type {{ id: any; }} */ cd) => cy.request('DELETE', `${API_URL}/${cd.id}`))
  })
})

describe('Home page', () => {

  it('should display the title, the add form and the CD list', () => {
    cy.visit('/')

    cy.get('h1').should('contain.text', 'Gestion des CD')
    cy.contains('h2', 'Ajouter un CD').should('be.visible')
    cy.contains('h2', 'Liste des CD').should('be.visible')
  })
})

describe('Displaying the CDs', () => {

  it('should show a placeholder message when there is no CD', () => {
    cy.visit('/')

    cy.contains('Aucun CD disponible').should('be.visible')
  })

  it('should display the CDs stored in the database', () => {
    cy.request('POST', API_URL, meteora)
    cy.request('POST', API_URL, chuck)

    cy.visit('/')

    cy.get('li').should('have.length', 2)
    cy.contains('li', 'Meteora - Linkin Park (2003)').should('be.visible')
    cy.contains('li', 'Chuck - Sum 41 (2004)').should('be.visible')
  })
})

describe('Adding a CD', () => {

  it('should add the CD through the form and display it in the list', () => {
    cy.visit('/')

    cy.get('input[name="title"]').type(meteora.title)
    cy.get('input[name="artist"]').type(meteora.artist)
    cy.get('input[name="year"]').type(meteora.year)
    cy.contains('button', 'Ajouter').click()

    cy.contains('li', 'Meteora - Linkin Park (2003)').should('be.visible')
  })

  it('should not add a CD when a required field is missing', () => {
    cy.visit('/')

    cy.get('input[name="title"]').type(meteora.title)
    cy.contains('button', 'Ajouter').click()

    cy.contains('Aucun CD disponible').should('be.visible')
  })
})

describe('Deleting a CD', () => {

  it('should delete the CD and remove it from the list', () => {
    cy.request('POST', API_URL, meteora)

    cy.visit('/')
    cy.contains('li', 'Meteora - Linkin Park (2003)')
      .contains('button', 'Supprimer')
      .click()

    cy.contains('li', 'Meteora - Linkin Park (2003)').should('not.exist')
    cy.contains('Aucun CD disponible').should('be.visible')
  })

  it('should only delete the targeted CD', () => {
    cy.request('POST', API_URL, meteora)
    cy.request('POST', API_URL, chuck)

    cy.visit('/')
    cy.contains('li', 'Meteora - Linkin Park (2003)')
      .contains('button', 'Supprimer')
      .click()

    cy.contains('li', 'Meteora - Linkin Park (2003)').should('not.exist')
    cy.contains('li', 'Chuck - Sum 41 (2004)').should('be.visible')
  })
})
