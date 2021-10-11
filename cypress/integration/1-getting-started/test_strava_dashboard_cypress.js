/// <reference types="cypress" />

// Purpose of this Test: 
// + Get to the Dashboard Page
// + Test 3 features: that ought to be essential/primary
const CUSTOM_PAGELOAD_TIMEOUT = 120000 // ms
const CUSTOM_EXEC_TIMEOUT = 80000 // ms
const CUSTOM_CMD_TIMEOUT = 60000 // ms

// eslint-disable cypress/no-unnecessary-waiting  // eslint_example
Cypress.config('pageLoadTimeout', CUSTOM_PAGELOAD_TIMEOUT)
expect(Cypress.config('pageLoadTimeout')).to.eq(CUSTOM_PAGELOAD_TIMEOUT)
Cypress.config('execTimeout', CUSTOM_EXEC_TIMEOUT)
Cypress.config('defaultCommandTimeout', CUSTOM_CMD_TIMEOUT)

const urlUnderTest = 'https://www.strava.com'
const dashRoute = '/dashboard'
const validUser = {
    'email': Cypress.env('strava_username'),
    'pswd': Cypress.env('strava_pswd'),
}

describe(`Testing: ${urlUnderTest}: Login and Test userDashboard`, () => {
    before(() => {
      cy.log(`DEBUG: CypressConfig: ${JSON.stringify(Cypress.config(), null, 3)}`)
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
        const locationVerStrs = [urlUnderTest, dashRoute]
        locationVerStrs.forEach(str => {
            cy.url().should('include', str)
        })
    })
    it('DashboardVerification: Primary Feature OK?', () => {
        cy.log('Verify: 1: Default Feed: OK?')
          .get('#feed-filter-btn').should('contain', 'Following')  // expDefault
    })
    it('DashboardVerification: Athlete Profile Summary, Present?', () => {
        cy.log('Verify: 2: Athlete Profile Summary: OK?')
        // Athlete's summary sidebar present, has avatar image, with src attribute
    })
    it('DashboardVerification: Can Return to HomePage?', () => {
        cy.log('Verify: 3: Can Return to HomePage?')
        //   .get('.nav-bar').should('include', 'Return to the Strava home page')
    })
    it('DashboardVerification: Able to SignOut?', () => {
        cy.log('Verify: 4: Able to SignOut?')
        //   .get('.user-menu').should('include.any.keys', 'avatar-athlete')
    })
})
