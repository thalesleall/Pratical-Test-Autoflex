describe("Backend API - Product Composition", () => {
  const apiUrl = Cypress.env("apiUrl");
  let productId;
  let materialIds = [];

  beforeEach(() => {
    materialIds = [];

    cy.clearDatabase();

    const materials = [
      { name: "Steel", quantity: 1000 },
      { name: "Plastic", quantity: 500 },
      { name: "Copper", quantity: 300 },
    ];

    cy.wrap(materials).each((material) => {
      cy.request("POST", `${apiUrl}/raw-materials`, material).then((response) => {
        materialIds.push(response.body.id);
      });
    });

    cy.request("POST", `${apiUrl}/products`, {
      name: "Test Product",
      value: 100.0,
    }).then((response) => {
      productId = response.body.id;
    });
  });

  describe("POST /products/:productId/raw-materials - Add Composition", () => {
    it("should add raw material to product", () => {
      const composition = {
        rawMaterialId: materialIds[0],
        quantity: 2.5,
      };

      cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, composition).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.rawMaterialId).to.eq(composition.rawMaterialId);
        expect(response.body.quantity).to.eq(composition.quantity);
      });
    });

    it("should create complete composition for a product (load test)", () => {
      const compositions = [
        { rawMaterialId: materialIds[0], quantity: 2.5 },
        { rawMaterialId: materialIds[1], quantity: 1.0 },
        { rawMaterialId: materialIds[2], quantity: 0.75 },
      ];

      cy.wrap(compositions).each((comp) => {
        cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, comp).then((response) => {
          expect(response.status).to.eq(201);
        });
      });
    });

    it("should fail to add non-existent raw material", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/products/${productId}/raw-materials`,
        body: { rawMaterialId: 99999, quantity: 1.0 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it("should fail to add with invalid quantity", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/products/${productId}/raw-materials`,
        body: { rawMaterialId: materialIds[0], quantity: -1.0 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it("should fail to add same raw material twice", () => {
      const composition = {
        rawMaterialId: materialIds[0],
        quantity: 2.0,
      };

      cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, composition).then(() => {
        cy.request({
          method: "POST",
          url: `${apiUrl}/products/${productId}/raw-materials`,
          body: composition,
          failOnStatusCode: false,
        }).then((response) => {
          expect([400, 409, 500]).to.include(response.status);
        });
      });
    });
  });

  describe("PUT /products/:productId/raw-materials/:materialId - Update Composition", () => {
    it("should update raw material quantity in composition", () => {
      const composition = {
        rawMaterialId: materialIds[0],
        quantity: 2.0,
      };

      cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, composition).then(() => {
        const updated = {
          rawMaterialId: materialIds[0],
          quantity: 5.0,
        };

        cy.request("PUT", `${apiUrl}/products/${productId}/raw-materials/${materialIds[0]}`, updated).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.quantity).to.eq(updated.quantity);
        });
      });
    });

    it("should return 404 for non-existent composition", () => {
      cy.request({
        method: "PUT",
        url: `${apiUrl}/products/${productId}/raw-materials/99999`,
        body: { rawMaterialId: 99999, quantity: 1.0 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe("DELETE /products/:productId/raw-materials/:materialId - Remove Composition", () => {
    it("should remove raw material from composition", () => {
      const composition = {
        rawMaterialId: materialIds[0],
        quantity: 2.0,
      };

      cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, composition).then(() => {
        cy.request("DELETE", `${apiUrl}/products/${productId}/raw-materials/${materialIds[0]}`).then((response) => {
          expect(response.status).to.eq(204);
        });
      });
    });

    it("should return 404 when removing non-existent composition", () => {
      cy.request({
        method: "DELETE",
        url: `${apiUrl}/products/${productId}/raw-materials/99999`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe("Load Test - Complex Composition", () => {
    it("should create product with multiple raw materials", () => {
      const materials = Array.from({ length: 5 }, (_, i) => ({
        name: `Material ${i + 1}`,
        quantity: 1000,
      }));

      const newMaterialIds = [];

      cy.wrap(materials).each((material) => {
        cy.request("POST", `${apiUrl}/raw-materials`, material).then((response) => {
          newMaterialIds.push(response.body.id);
        });
      });

      cy.then(() => {
        cy.wrap(newMaterialIds).each((matId) => {
          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: matId,
            quantity: Math.random() * 10 + 0.1,
          }).then((response) => {
            expect(response.status).to.eq(201);
          });
        });
      });
    });
  });
});
