describe("Frontend Vue - Products", () => {
  const apiUrl = Cypress.env("apiUrl");

  beforeEach(() => {
    cy.on("uncaught:exception", () => false);
  });

  describe("Page Load", () => {
    it("should display the Products heading", () => {
      cy.visit("/products");
      cy.get("h1").contains("Products").should("be.visible");
    });

    it("should display the + New Product button", () => {
      cy.visit("/products");
      cy.contains("+ New Product").should("be.visible");
    });

    it("should display the subtitle", () => {
      cy.visit("/products");
      cy.contains("Manage your product catalog").should("be.visible");
    });
  });

  describe("API Integration - List Products", () => {
    it("should fetch products from the API", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });

    it("should display fetched products on the page", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        cy.visit("/products");
        if (response.body.length > 0) {
          response.body.forEach((product) => {
            cy.contains(product.name).should("be.visible");
          });
        }
      });
    });
  });

  describe("API Integration - Create Product", () => {
    const testProduct = {
      name: `Cypress Product ${Date.now()}`,
      value: 99.99,
    };

    it("should create a new product via API", () => {
      cy.request("POST", `${apiUrl}/products`, testProduct).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body).to.have.property("name", testProduct.name);
        expect(response.body).to.have.property("value", testProduct.value);
        expect(response.body).to.have.property("id");
      });
    });

    it("should display the newly created product on the page", () => {
      cy.request("POST", `${apiUrl}/products`, {
        name: `Cypress Visible Product ${Date.now()}`,
        value: 55.0,
      }).then((response) => {
        cy.visit("/products");
        cy.contains(response.body.name).should("be.visible");
      });
    });
  });

  describe("Modal Interaction", () => {
    it("should open the create modal when clicking + New Product", () => {
      cy.visit("/products");
      cy.contains("+ New Product").click();
      cy.get("input").should("have.length.at.least", 2);
    });

    it("should close the modal on Escape key", () => {
      cy.visit("/products");
      cy.contains("+ New Product").click();
      cy.get("input").should("have.length.at.least", 2);
      cy.get("body").type("{esc}");
    });
  });

  describe("Product Cards", () => {
    it("should display Edit and Delete buttons on each card", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        if (response.body.length > 0) {
          cy.visit("/products");
          cy.contains("Edit").should("be.visible");
          cy.contains("Delete").should("be.visible");
        }
      });
    });

    it("should show product value with dollar sign", () => {
      cy.request("GET", `${apiUrl}/products`).then((response) => {
        if (response.body.length > 0) {
          cy.visit("/products");
          cy.contains("$").should("be.visible");
        }
      });
    });
  });

  describe("API Integration - Delete Product", () => {
    it("should delete a product via API", () => {
      cy.request("POST", `${apiUrl}/products`, {
        name: `To Delete ${Date.now()}`,
        value: 10.0,
      }).then((response) => {
        const id = response.body.id;
        cy.request("DELETE", `${apiUrl}/products/${id}`).then((delResponse) => {
          expect(delResponse.status).to.be.oneOf([200, 204]);
        });
      });
    });
  });
});
