/// <reference types="cypress" />

const urlUnderTest = 'http://strava.com'
const userCreds3 = {
    'user_name': Cypress.env('athlete_username'),
    'pswd': Cypress.env('athlete_pswd'),
}
const validUsers = [userCreds3]

const invalidUsers = require("../../fixtures/strava_users_invalid.json")

function logInAs(username, password) {
    cy.log(`Logging in as ${username}`)
      .get('[id=email]').type(username)
      .get('[id=password').type(password)
      .get('[id=login-button]')
      .click()
}

function verifyLogInErrHandling() {
    const exp_err_msg = 'The username or password did not match'
    cy.get('.alert-message').should('contain', exp_err_msg)
}

function verifyLogInOKYetSeshExpired() {
    const state = 'Expired Session'
    cy.log(`verifying login OK: ${state}`)
    const exp_err_msg_expired = 'Your session expired'
    cy.get('.alert-message').should('contain', exp_err_msg_expired)
}

describe(`Testing: ${urlUnderTest}: Login and Do a few Basics`, () => {
    before(() => {
      cy.visit(urlUnderTest)
        .log('Get to Login Page')
        .get('.btn-login').should('contain', 'Log In')
        .click()
    })
    it('Logging in: ErrHandling: Invalid pswd', () => {
        cy.location('pathname').should('include', '/login')
        cy.log(`DEBUG: From Fixtures: invalidUsers: ${JSON.stringify(invalidUsers)}`)
        for (var person in invalidUsers) {
            logInAs(invalidUsers[person]['email'], invalidUsers[person]['pswd'])
            verifyLogInErrHandling()
        }
    })
    it('Logging in: as a Valid User', () => {
        cy.location('pathname').should('include', '/login')
        validUsers.forEach(person => {
            logInAs(person.user_name, person.pswd)
            verifyLogInOKYetSeshExpired()
        });
    })
    it('Clear Cookies Banner: Accept', () => {
        cy.get('.btn-accept-cookie-banner')
          .click()
    })
})
