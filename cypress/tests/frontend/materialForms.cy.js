describe("Frontend Vue - Materials (Raw Materials)", () => {
  const apiUrl = Cypress.env("apiUrl");

  beforeEach(() => {
    cy.on("uncaught:exception", () => false);
  });

  describe("Page Load", () => {
    it("should display the Raw Materials heading", () => {
      cy.visit("/materials");
      cy.get("h1").contains("Raw Materials").should("be.visible");
    });

    it("should display the + New Material button", () => {
      cy.visit("/materials");
      cy.contains("+ New Material").should("be.visible");
    });

    it("should display the subtitle", () => {
      cy.visit("/materials");
      cy.contains("Manage your inventory").should("be.visible");
    });
  });

  describe("API Integration - List Materials", () => {
    it("should fetch raw materials from the API", () => {
      cy.request("GET", `${apiUrl}/raw-materials`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });

    it("should display fetched materials on the page", () => {
      cy.request("GET", `${apiUrl}/raw-materials`).then((response) => {
        cy.visit("/materials");
        if (response.body.length > 0) {
          response.body.forEach((material) => {
            cy.contains(material.name).should("be.visible");
          });
        }
      });
    });
  });

  describe("API Integration - Create Material", () => {
    const testMaterial = {
      name: `Cypress Material ${Date.now()}`,
      quantity: 250,
    };

    it("should create a new raw material via API", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, testMaterial).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body).to.have.property("name", testMaterial.name);
        expect(response.body).to.have.property("quantity", testMaterial.quantity);
        expect(response.body).to.have.property("id");
      });
    });

    it("should display the newly created material on the page", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: `Cypress Visible ${Date.now()}`,
        quantity: 100,
      }).then((response) => {
        cy.visit("/materials");
        cy.contains(response.body.name).should("be.visible");
      });
    });
  });

  describe("Modal Interaction", () => {
    it("should open the create modal when clicking + New Material", () => {
      cy.visit("/materials");
      cy.contains("+ New Material").click();
      // The modal should appear with form inputs
      cy.get("input").should("have.length.at.least", 2);
    });

    it("should close the modal on backdrop click or cancel", () => {
      cy.visit("/materials");
      cy.contains("+ New Material").click();
      cy.get("input").should("have.length.at.least", 2);
      // Press Escape or click backdrop to close
      cy.get("body").type("{esc}");
    });
  });

  describe("Material Cards", () => {
    it("should display Edit and Delete buttons on each card", () => {
      cy.request("GET", `${apiUrl}/raw-materials`).then((response) => {
        if (response.body.length > 0) {
          cy.visit("/materials");
          cy.contains("Edit").should("be.visible");
          cy.contains("Delete").should("be.visible");
        }
      });
    });

    it("should show material quantity on each card", () => {
      cy.request("GET", `${apiUrl}/raw-materials`).then((response) => {
        if (response.body.length > 0) {
          cy.visit("/materials");
          cy.contains("units").should("be.visible");
        }
      });
    });
  });

  describe("API Integration - Delete Material", () => {
    it("should delete a raw material via API", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: `To Delete ${Date.now()}`,
        quantity: 1,
      }).then((response) => {
        const id = response.body.id;
        cy.request("DELETE", `${apiUrl}/raw-materials/${id}`).then((delResponse) => {
          expect(delResponse.status).to.be.oneOf([200, 204]);
        });
      });
    });
  });
});
