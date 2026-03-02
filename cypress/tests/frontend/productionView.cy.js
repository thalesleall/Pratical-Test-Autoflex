describe("Frontend Vue - Production Suggestions", () => {
  const apiUrl = Cypress.env("apiUrl");

  beforeEach(() => {
    cy.on("uncaught:exception", () => false);
  });

  describe("Page Load", () => {
    it("should display the Production Suggestions heading", () => {
      cy.visit("/production");
      cy.get("h1").contains("Production Suggestions").should("be.visible");
    });

    it("should display the subtitle", () => {
      cy.visit("/production");
      cy.contains("Products ordered by highest value").should("be.visible");
    });
  });

  describe("Algorithm Explanation Panel", () => {
    it("should display the Smart Algorithm Active heading", () => {
      cy.visit("/production");
      cy.contains("Smart Algorithm Active").should("be.visible");
    });

    it("should display the Greedy Strategy description", () => {
      cy.visit("/production");
      cy.contains("prioritizes products by highest value").should("be.visible");
    });

    it("should show all 4 algorithm steps", () => {
      cy.visit("/production");
      cy.contains("Sort by Value").should("be.visible");
      cy.contains("Load Stock").should("be.visible");
      cy.contains("Calculate Bottleneck").should("be.visible");
      cy.contains("Virtual Consumption").should("be.visible");
    });

    it("should number steps 1 through 4", () => {
      cy.visit("/production");
      ["1", "2", "3", "4"].forEach((num) => {
        cy.get(".rounded-full").contains(num).should("exist");
      });
    });
  });

  describe("API Integration - Production Suggestions", () => {
    it("should fetch production suggestions from the API", () => {
      cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });

    it("should return correct DTO fields", () => {
      cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
        if (response.body.length > 0) {
          const suggestion = response.body[0];
          expect(suggestion).to.have.property("productName");
          expect(suggestion).to.have.property("producibleQuantity");
          expect(suggestion).to.have.property("unitValue");
          expect(suggestion).to.have.property("totalValueEstimate");
        }
      });
    });
  });

  describe("Suggestions Table", () => {
    it("should display suggestions table with column headers", () => {
      cy.visit("/production");
      cy.contains("Product").should("be.visible");
      cy.contains("Unit Value").should("be.visible");
      cy.contains("Quantity").should("be.visible");
      cy.contains("Max Revenue").should("be.visible");
    });

    it("should display suggestion rows with data from API", () => {
      cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
        cy.visit("/production");
        if (response.body.length > 0) {
          response.body.forEach((suggestion) => {
            cy.contains(suggestion.productName).should("be.visible");
          });
        } else {
          cy.contains("No production suggestions available").should("be.visible");
        }
      });
    });

    it("should show empty state when no suggestions", () => {
      cy.intercept("GET", "**/production/suggestion", []).as("emptySuggestions");
      cy.visit("/production");
      cy.wait("@emptySuggestions");
      cy.contains("No production suggestions available").should("be.visible");
      cy.contains("Make sure you have products with recipes").should("be.visible");
    });
  });

  describe("Sidebar - Total Opportunity", () => {
    it("should display the Total Opportunity card", () => {
      cy.visit("/production");
      cy.contains("Total Opportunity").should("be.visible");
    });

    it("should show Total Products, Total Units, and Max Revenue", () => {
      cy.visit("/production");
      cy.contains("Total Products:").should("be.visible");
      cy.contains("Total Units:").should("be.visible");
      cy.contains("Max Revenue:").should("be.visible");
    });
  });

  describe("Sidebar - Raw Materials", () => {
    it("should display the Raw Materials sidebar card", () => {
      cy.visit("/production");
      cy.get("h3").contains("Raw Materials").should("be.visible");
    });

    it("should list raw materials with their quantities", () => {
      cy.request("GET", `${apiUrl}/raw-materials`).then((response) => {
        cy.visit("/production");
        if (response.body.length > 0) {
          response.body.forEach((material) => {
            cy.contains(material.name).should("be.visible");
          });
        } else {
          cy.contains("No materials").should("be.visible");
        }
      });
    });
  });

  describe("Read-Only Behavior", () => {
    it("should NOT have any quantity input fields", () => {
      cy.visit("/production");
      cy.get("input[type='number']").should("not.exist");
    });

    it("should NOT have a Start Production button", () => {
      cy.visit("/production");
      cy.contains("Start Production").should("not.exist");
    });

    it("should be a purely read-only view", () => {
      cy.visit("/production");
      cy.get("button")
        .filter((_, el) => {
          const text = el.textContent.toLowerCase();
          return text.includes("start") || text.includes("produce") || text.includes("submit");
        })
        .should("have.length", 0);
    });
  });
});
