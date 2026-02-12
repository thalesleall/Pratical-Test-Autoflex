describe("Frontend - Navigation", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false);
    cy.visit("/");
  });

  describe("Home Page", () => {
    it("should load the home page", () => {
      cy.url().should("eq", Cypress.config().baseUrl + "/");
      cy.get("body").should("be.visible");
    });

    it("should display navbar with navigation links", () => {
      cy.get("nav").should("be.visible");
    });
  });

  describe("Navigation - Products", () => {
    it("should navigate to products page", () => {
      cy.visit("/products");
      cy.url().should("include", "/products");
    });

    it("should display products page content", () => {
      cy.visit("/products");
      cy.get("body").should("be.visible");
    });
  });

  describe("Navigation - Raw Materials", () => {
    it("should navigate to raw materials page", () => {
      cy.visit("/materials");
      cy.url().should("include", "/materials");
    });

    it("should display raw materials page content", () => {
      cy.visit("/materials");
      cy.get("body").should("be.visible");
    });
  });

  describe("Navigation - Composition", () => {
    it("should navigate to composition page", () => {
      cy.visit("/compositions");
      cy.url().should("include", "/compositions");
    });

    it("should display composition page content", () => {
      cy.visit("/compositions");
      cy.get("body").should("be.visible");
    });
  });

  describe("Navigation - Production", () => {
    it("should navigate to production page", () => {
      cy.visit("/production");
      cy.url().should("include", "/production");
    });

    it("should display production page content", () => {
      cy.visit("/production");
      cy.get("body").should("be.visible");
    });
  });

  describe("Navigation Links", () => {
    it("should have clickable links in navbar", () => {
      cy.get("nav a, nav button").should("have.length.at.least", 3);
    });

    it("should navigate between pages using navbar", () => {
      cy.get("nav")
        .contains(/produtos|products/i)
        .click();
      cy.wait(500);
      cy.url().should("include", "/products");

      cy.get("nav")
        .contains(/matérias|materials/i)
        .click();
      cy.wait(500);
      cy.url().should("include", "/materials");
    });
  });

  describe("Responsiveness", () => {
    const viewports = [
      { name: "Mobile", width: 375, height: 667 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Desktop", width: 1920, height: 1080 },
    ];

    viewports.forEach((viewport) => {
      it(`should be responsive on ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit("/");
        cy.get("body").should("be.visible");
        cy.get("nav").should("be.visible");
      });
    });
  });

  describe("UI Elements", () => {
    it("should have correct meta tags", () => {
      cy.visit("/");
      cy.document().its("head").find('meta[name="viewport"]').should("exist");
    });

    it("should render page structure", () => {
      cy.visit("/");
      cy.get("body").should("be.visible");
      cy.get("nav").should("exist");
    });
  });
});
