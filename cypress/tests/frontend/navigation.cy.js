describe("Frontend Vue - Navigation", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false);
  });

  describe("Dashboard (Home)", () => {
    it("should load the dashboard at /", () => {
      cy.visit("/");
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });

    it("should display the Autoflex title in the navbar", () => {
      cy.visit("/");
      cy.get("nav").contains("Autoflex").should("be.visible");
    });

    it("should display the Dashboard heading", () => {
      cy.visit("/");
      cy.get("h1").contains("Dashboard").should("be.visible");
    });

    it("should show overview cards on the dashboard", () => {
      cy.visit("/");
      cy.contains("Total Products").should("be.visible");
      cy.contains("Raw Materials").should("be.visible");
    });
  });

  describe("Navbar Link Navigation", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("should navigate to Products page via navbar", () => {
      cy.get("nav a").contains("Products").click();
      cy.url().should("include", "/products");
      cy.get("h1").contains("Products").should("be.visible");
    });

    it("should navigate to Materials page via navbar", () => {
      cy.get("nav a").contains("Materials").click();
      cy.url().should("include", "/materials");
      cy.get("h1").contains("Raw Materials").should("be.visible");
    });

    it("should navigate to Recipes page via navbar", () => {
      cy.get("nav a").contains("Recipes").click();
      cy.url().should("include", "/compositions");
      cy.get("h1").contains("Product Recipes").should("be.visible");
    });

    it("should navigate to Production page via navbar", () => {
      cy.get("nav a").contains("Production").click();
      cy.url().should("include", "/production");
      cy.get("h1").contains("Production Suggestions").should("be.visible");
    });

    it("should navigate back to Dashboard from another page", () => {
      cy.get("nav a").contains("Products").click();
      cy.url().should("include", "/products");
      cy.get("nav a").contains("Dashboard").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
      cy.get("h1").contains("Dashboard").should("be.visible");
    });

    it("should have all 5 links in the navbar", () => {
      cy.get("nav a").should("have.length.at.least", 5);
    });
  });

  describe("Direct Route Access", () => {
    it("should load /products directly", () => {
      cy.visit("/products");
      cy.get("h1").contains("Products").should("be.visible");
      cy.contains("Manage your product catalog").should("be.visible");
    });

    it("should load /materials directly", () => {
      cy.visit("/materials");
      cy.get("h1").contains("Raw Materials").should("be.visible");
      cy.contains("Manage your inventory").should("be.visible");
    });

    it("should load /compositions directly", () => {
      cy.visit("/compositions");
      cy.get("h1").contains("Product Recipes").should("be.visible");
      cy.contains("Define which materials are needed").should("be.visible");
    });

    it("should load /production directly", () => {
      cy.visit("/production");
      cy.get("h1").contains("Production Suggestions").should("be.visible");
      cy.contains("Smart Algorithm Active").should("be.visible");
    });
  });

  describe("Active Link Highlight", () => {
    it("should highlight Products link when on /products", () => {
      cy.visit("/products");
      cy.get("nav a")
        .contains("Products")
        .should("have.class", "bg-white")
        .and("have.class", "text-blue-900");
    });

    it("should highlight Dashboard link when on /", () => {
      cy.visit("/");
      cy.get("nav a")
        .contains("Dashboard")
        .should("have.class", "bg-white")
        .and("have.class", "text-blue-900");
    });
  });

  describe("Responsive Navigation", () => {
    it("should show full nav links on desktop (1280px)", () => {
      cy.viewport(1280, 720);
      cy.visit("/");
      cy.get("nav").should("be.visible");
      cy.get("nav a").contains("Products").should("be.visible");
      cy.get("nav a").contains("Materials").should("be.visible");
      cy.get("nav a").contains("Recipes").should("be.visible");
      cy.get("nav a").contains("Production").should("be.visible");
    });

    it("should show hamburger menu on mobile (375px)", () => {
      cy.viewport(375, 667);
      cy.visit("/");
      cy.get("nav").should("be.visible");
      // Hamburger button visible on mobile
      cy.get("nav button").should("be.visible");
    });

    it("should open mobile menu and navigate to Products", () => {
      cy.viewport(375, 667);
      cy.visit("/");
      cy.get("nav button").click();
      cy.get("nav a").contains("Products").should("be.visible").click();
      cy.url().should("include", "/products");
      cy.get("h1").contains("Products").should("be.visible");
    });

    it("should be responsive on tablet (768px)", () => {
      cy.viewport(768, 1024);
      cy.visit("/");
      cy.get("nav").should("be.visible");
    });
  });
});
