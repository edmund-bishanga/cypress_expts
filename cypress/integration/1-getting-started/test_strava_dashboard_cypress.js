/// <reference types="cypress" />

// Purpose of this Test: 
// + Get to the Dashboard Page
// + Test 3 features: that ought to be essential/primary

const urlUnderTest = 'http://strava.com'
const dashRoute = '/dashboard'
const validUser = {
    'email': 'me.bishanga@gmail.com',
    'pswd': 'gm!!!StravaApp47',
}

describe(`Testing: ${urlUnderTest}: Login and Test userDashboard`, () => {
    before(() => {
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
