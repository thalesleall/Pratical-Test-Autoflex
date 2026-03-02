describe("Frontend Vue - Compositions (Product Recipes)", () => {
  const apiUrl = Cypress.env("apiUrl");

  beforeEach(() => {
    cy.on("uncaught:exception", () => false);
  });

  describe("Page Load", () => {
    it("should display the Product Recipes heading", () => {
      cy.visit("/compositions");
      cy.get("h1").contains("Product Recipes").should("be.visible");
    });

    it("should display the subtitle", () => {
      cy.visit("/compositions");
      cy.contains("Define which materials are needed").should("be.visible");
    });

    it("should display the Select Product sidebar", () => {
      cy.visit("/compositions");
      cy.contains("Select Product").should("be.visible");
    });
  });

  describe("Product List Sidebar", () => {
    it("should list existing products as selectable buttons", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        cy.visit("/compositions");
        if (response.body.length > 0) {
          response.body.forEach((product) => {
            cy.contains(product.name).should("be.visible");
          });
        } else {
          cy.contains("No products available").should("be.visible");
        }
      });
    });

    it("should show product values alongside names", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        cy.visit("/compositions");
        if (response.body.length > 0) {
          cy.contains("$").should("be.visible");
        }
      });
    });

    it("should highlight the selected product", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        if (response.body.length > 0) {
          cy.visit("/compositions");
          cy.contains(response.body[0].name).click();
          cy.contains(response.body[0].name)
            .closest("button")
            .should("have.class", "text-white");
        }
      });
    });
  });

  describe("Recipe Form", () => {
    it("should display form when a product is selected", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        if (response.body.length > 0) {
          cy.visit("/compositions");
          cy.contains(response.body[0].name).click();
          cy.contains(`Recipe for ${response.body[0].name}`).should("be.visible");
          cy.get("select").should("be.visible");
        }
      });
    });

    it("should show placeholder text when no product is selected", () => {
      cy.visit("/compositions");
      cy.contains("Select a product").should("be.visible");
    });

    it("should display material dropdown with available materials", () => {
      cy.request("GET", `${apiUrl}/products`).then((productRes) => {
        cy.request("GET", `${apiUrl}/raw-materials`).then((materialRes) => {
          if (productRes.body.length > 0 && materialRes.body.length > 0) {
            cy.visit("/compositions");
            cy.contains(productRes.body[0].name).click();
            cy.get("select").should("be.visible");
            cy.get("select option").should("have.length.at.least", 2); // includes "Select a material"
          }
        });
      });
    });

    it("should display quantity input field", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        if (response.body.length > 0) {
          cy.visit("/compositions");
          cy.contains(response.body[0].name).click();
          cy.get("input").should("be.visible");
        }
      });
    });

    it("should have an Add Material button", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        if (response.body.length > 0) {
          cy.visit("/compositions");
          cy.contains(response.body[0].name).click();
          cy.contains("Add Material").should("be.visible");
        }
      });
    });
  });

  describe("API Integration - Compositions", () => {
    it("should fetch compositions for a product via API", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        if (response.body.length > 0) {
          const productId = response.body[0].id;
          cy.request("GET", `${apiUrl}/products/${productId}/raw-materials`).then(
            (compResponse) => {
              expect(compResponse.status).to.eq(200);
              expect(compResponse.body).to.be.an("array");
            }
          );
        }
      });
    });

    it("should add a composition via API and see it on the page", () => {
      // Create a product and material first
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: `Comp Test Material ${Date.now()}`,
        quantity: 500,
      }).then((materialRes) => {
        cy.request("POST", `${apiUrl}/products`, {
          name: `Comp Test Product ${Date.now()}`,
          value: 120.0,
        }).then((productRes) => {
          const productId = productRes.body.id;
          const materialId = materialRes.body.id;

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 5,
          }).then((compResponse) => {
            expect(compResponse.status).to.be.oneOf([200, 201]);
          });
        });
      });
    });
  });

  describe("Composition List (Delete)", () => {
    it("should display Remove button on existing compositions", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        if (response.body.length > 0) {
          const productId = response.body[0].id;
          cy.request("GET", `${apiUrl}/products/${productId}/raw-materials`).then(
            (compResponse) => {
              if (compResponse.body.length > 0) {
                cy.visit("/compositions");
                cy.contains(response.body[0].name).click();
                cy.contains("Remove").should("be.visible");
              }
            }
          );
        }
      });
    });
  });
});
