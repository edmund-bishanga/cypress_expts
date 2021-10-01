/// <reference types="cypress" />

// Purpose of this Test: 
// + Get to the Dashboard Page
// + Test 3 features: that ought to be essential/primary
const CUSTOM_PAGELOAD_TIMEOUT = 120000 // ms
const CUSTOM_EXEC_TIMEOUT = 80000 // ms
const urlUnderTest = 'http://strava.com'
const dashRoute = '/dashboard'
const validUser = {
    'email': Cypress.env('strava_username'),
    'pswd': Cypress.env('strava_pswd'),
}

describe(`Testing: ${urlUnderTest}: Login and Test userDashboard`, () => {
    // eslint-disable cypress/no-unnecessary-waiting  // eslint_example
    Cypress.config('pageLoadTimeout', CUSTOM_PAGELOAD_TIMEOUT)
    expect(Cypress.config('pageLoadTimeout')).to.eq(CUSTOM_PAGELOAD_TIMEOUT)
    Cypress.config('execTimeout', CUSTOM_EXEC_TIMEOUT)
    before(() => {
      cy.log(`CypressConfig: ${JSON.stringify(Cypress.config(), null, 3)}`)
      // console.log(`CypressConfig: ${JSON.stringify(Cypress.config(), null, 3)}`)
      cy.visit(urlUnderTest)
        .log('Get to Login Page')
        .get('.btn-login').should('contain', 'Log In').click()
        .get('.btn-accept-cookie-banner').click()
        .log('LogIn as a ValidUser')
        .location('pathname').should('include', '/login')
        .logInAs(validUser.email, validUser.pswd)
    })
    it('Validate Dashboard Page', () => {
        cy.location('pathname').should('include', dashRoute)
    })
    it('Test Dashboard Feature1: ABC', () => {
        cy.log('Testing dashFeature1')
    })
})
