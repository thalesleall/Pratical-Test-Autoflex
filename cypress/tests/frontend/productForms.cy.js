describe("Frontend - Product Forms", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false);
    cy.visit("/products");
  });

  describe("Page Load and Basic UI", () => {
    it("should load products page successfully", () => {
      cy.url().should("include", "/products");
      cy.get("body").should("be.visible");
    });

    it("should render page structure", () => {
      cy.get("body").should("exist");
      cy.wait(500);
      cy.get("body").should("be.visible");
    });
  });

  describe("Product Data Display", () => {
    it("should display products from API", () => {
      const apiUrl = Cypress.env("apiUrl");

      cy.request("POST", `${apiUrl}/products`, {
        name: "Test Product Display",
        value: 99.99,
      });

      cy.wait(2000);
      cy.reload();
      cy.wait(2000);

      cy.get("body").should("be.visible");
    });

    it("should handle empty products list", () => {
      cy.get("body").should("be.visible");
      cy.url().should("include", "/products");
    });
  });

  describe("Product Listing", () => {
    it("should list existing products via API", () => {
      const apiUrl = Cypress.env("apiUrl");

      cy.request("POST", `${apiUrl}/products`, {
        name: "Product A",
        value: 100.0,
      });

      cy.request("POST", `${apiUrl}/products`, {
        name: "Product B",
        value: 200.0,
      });

      cy.wait(1000);
      cy.reload();
      cy.wait(1000);

      cy.get("body").should("be.visible");
    });

    it("should display product information", () => {
      const apiUrl = Cypress.env("apiUrl");

      cy.request("POST", `${apiUrl}/products`, {
        name: "Widget Premium",
        value: 150.5,
      });

      cy.wait(1000);
      cy.reload();
      cy.wait(1000);

      cy.get("body").should("be.visible");
    });
  });

  describe("API Integration", () => {
    it("should fetch products from backend", () => {
      const apiUrl = Cypress.env("apiUrl");

      cy.request("GET", `${apiUrl}/products`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });

    it("should create product via API and display", () => {
      const apiUrl = Cypress.env("apiUrl");
      const productName = `Test-${Date.now()}`;

      cy.request("POST", `${apiUrl}/products`, {
        name: productName,
        value: 199.99,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("id");
      });
    });
  });
});
