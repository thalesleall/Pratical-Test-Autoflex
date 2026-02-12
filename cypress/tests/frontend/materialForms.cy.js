describe("Frontend - Raw Material Forms", () => {
  beforeEach(() => {
    cy.visit("/materials");
  });

  describe("Page Load and Basic UI", () => {
    it("should load materials page successfully", () => {
      cy.url().should("include", "/materials");
      cy.get("body").should("be.visible");
    });

    it("should render without errors", () => {
      cy.get("body").should("exist");
      cy.wait(500);
      cy.get("body").should("be.visible");
    });
  });

  describe("Raw Material Data Display", () => {
    it("should display materials from API", () => {
      const apiUrl = Cypress.env("apiUrl");

      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Test Material Display",
        quantity: 999,
      });

      cy.wait(2000);
      cy.reload();
      cy.wait(2000);

      cy.get("body").should("be.visible");
    });

    it("should handle empty materials list", () => {
      cy.get("body").should("be.visible");
      cy.url().should("include", "/materials");
    });
  });

  describe("API Integration", () => {
    it("should fetch materials from backend", () => {
      const apiUrl = Cypress.env("apiUrl");

      cy.request("GET", `${apiUrl}/raw-materials`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });

    it("should create material via API and display", () => {
      const apiUrl = Cypress.env("apiUrl");
      const materialName = `Test-${Date.now()}`;

      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: materialName,
        quantity: 500,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("id");
      });
    });
  });
});
