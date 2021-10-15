/// <reference types="cypress" />

// Purpose of this Test: 
// + Get to the Dashboard Page
// + Test 3 features: that ought to be essential/primary

// Variable Definitions
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
    'email': Cypress.env('athlete_username'),
    'pswd': Cypress.env('athlete_pswd'),
}

// Custom Functions
// Re-usable Methods: Convert to Commands, exportable
function verifyAPHrefLink(div, index, expected_str) {
  cy.log(`div: ${div}, index: ${index}, exp_str: ${expected_str}`)
  cy.get(div)
    .find('.list-stats').find('li').eq(index)
    .find('a.stat').should('have.attr', 'href')
    .and('include', expected_str)
}

// MainProgram
describe(`Testing: ${urlUnderTest}: Login and Test userDashboard`, () => {
    before(() => {
      // M: Validate URL: loginPage
      // m: Verify validUser LogIn
      // cy.log(`DEBUG: CypressConfig: ${JSON.stringify(Cypress.config(), null, '  ')}`)
      // console.log(`CypressConfig: ${JSON.stringify(Cypress.config(), null, 3)}`)
      cy.visit(urlUnderTest)
        .log('Get to LogIn Page')
        .get('.btn-login').should('contain', 'Log In').click()
        .get('.btn-accept-cookie-banner').click()
        .log('LogIn as a ValidUser')
        .location('pathname').should('include', '/login')
        .logInAs(validUser.email, validUser.pswd)
    })
    it('Validate Dashboard Page: URL and key PathWays', () => {
      // M: Validate URL
      // m: Verify Key/Priority PathWays
      cy.location('pathname').should('include', dashRoute)
      const locationVerStrs = [urlUnderTest, dashRoute]
      locationVerStrs.forEach(str => {
          cy.url().should('include', str)
      })
    })
    it('PathWay1: DashboardVerification: Primary Feature OK?', () => {
      // M: Default feed: Exists
      // m: DFeed: Has items from other athletes: n >> 1, e.g. 3
      cy.log('Verify: 1: Default Feed: OK?')
        .get('#feed-filter-btn')
        .should('contain', 'Following')
      cy.log('Default Feed: has n valid items, from other athletes, n >> 1')
    })
    it('PathWay2: DashboardVerification: Athlete Profile Summary, Present?', () => {
      // M: Athlete Profile Summary: Exists
      // m: Key AP Stats present, with appropriate href links
      cy.log('Verify: 2: Athlete Profile Summary: OK?')
      const athlete_url_prefix = `/athletes/${Cypress.env('athlete_id')}`
      cy.get('.athlete-profile').as('athleteProfile')
        .find('.card-body').find('a')
        .should('have.attr', 'href').and('include', athlete_url_prefix)
      cy.get('@athleteProfile')
        .find('.avatar-img')
        .should('have.attr', 'src').and('include', '.jpg')
      const test_data = {
        0: 'type=following',
        1: 'type=followers',
        2: '/athlete/training'
      }
      for (let [index, expected_str] of Object.entries(test_data)) {
        verifyAPHrefLink('@athleteProfile', index, expected_str)
      }
    })
    it('PathWay3: DashboardVerification: Can Return to HomePage?', () => {
      // M: User sees company logo, has href -> Home Page
      // m: User hoovers over logo, has helpful text
      const hoover_txt = 'Return to the Strava home page'
      cy.log('Verify: 3: Can Return to HomePage?')
        .get('.nav-bar').find('.branding').as('navToHomeDiv')
        .should('have.attr', 'title').should('contain', hoover_txt)
      cy.get('@navToHomeDiv')
        .find('.sr-only')
        .should('have.text', 'Strava')
      cy.get('@navToHomeDiv')
        .find('a')
        .should('have.attr', 'href').should('contain', '/')
    })
    it('PathWay4: DashboardVerification: Able to SignOut?', () => {
      // M: User able to LogOut: navigates to LogOut button
      // m: Associated mReadable link: Accurate
      cy.log('Verify: 4: Able to SignOut?')
        .get('.nav-item.drop-down-menu.user-menu').find('.options')
        .find('li').eq(3).find('a').as('logOutOption')
      cy.get('@logOutOption')
        .should('have.attr', 'href').should('contain', '/session')
      cy.get('@logOutOption')
        .should('have.text', 'Log Out')
    })
})
