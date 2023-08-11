Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

describe("navigation page", () => {
  it("directs to campaigns page", () => {
    cy.visit("http://localhost:3000/en/navigation");
    cy.get("#support").check({ force: true });
    cy.get("support").should("be.checked");
    cy.location("pathname");
    cy.should("equal", "en/campaigns");
  });
});
describe("navigates to kickoff page", () => {
  it("directs to kickoff page", () => {
    cy.visit("http://localhost:3000/en/navigation");
    cy.get("#kick-off").check({ force: true });
    cy.get("#kick-off").should("be.checked");
    cy.location("pathname");
    cy.should("equal", "en/campaigns");
  });
});
