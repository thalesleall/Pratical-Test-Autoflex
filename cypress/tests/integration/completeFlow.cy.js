describe("Integration - Complete Production Flow", () => {
  const apiUrl = Cypress.env("apiUrl");

  beforeEach(() => {
    cy.on("uncaught:exception", () => false);
    cy.clearProducts();
    cy.clearRawMaterials();
  });

  describe("Flow 1: Complete Initial Setup", () => {
    it("should create entire production environment from scratch", () => {
      const materials = [
        { name: "Steel Sheet", quantity: 1000 },
        { name: "Plastic Resin", quantity: 500 },
        { name: "Copper Wire", quantity: 800 },
      ];

      materials.forEach((material) => {
        cy.request("POST", `${apiUrl}/raw-materials`, material);
      });

      cy.request("GET", `${apiUrl}/raw-materials`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");

        const steelSheet = response.body.find((m) => m.name === "Steel Sheet");
        const plasticResin = response.body.find((m) => m.name === "Plastic Resin");
        const copperWire = response.body.find((m) => m.name === "Copper Wire");

        expect(steelSheet).to.exist;
        expect(plasticResin).to.exist;
        expect(copperWire).to.exist;
      });

      const products = [
        { name: "Premium Widget", value: 300.0 },
        { name: "Standard Component", value: 150.0 },
      ];

      const productIds = [];

      products.forEach((product) => {
        cy.request("POST", `${apiUrl}/products`, product).then((response) => {
          productIds.push(response.body.id);
        });
      });

      cy.request("GET", `${apiUrl}/products`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");

        const premiumWidget = response.body.find((p) => p.name === "Premium Widget");
        const standardComponent = response.body.find((p) => p.name === "Standard Component");

        expect(premiumWidget).to.exist;
        expect(standardComponent).to.exist;
      });

      cy.then(() => {
        cy.request("GET", `${apiUrl}/raw-materials`).then((response) => {
          const materialIds = response.body.map((m) => m.id);

          cy.request("POST", `${apiUrl}/products/${productIds[0]}/raw-materials`, {
            rawMaterialId: materialIds[0],
            quantity: 20.0,
          });

          cy.request("POST", `${apiUrl}/products/${productIds[0]}/raw-materials`, {
            rawMaterialId: materialIds[2],
            quantity: 10.0,
          });

          cy.request("POST", `${apiUrl}/products/${productIds[1]}/raw-materials`, {
            rawMaterialId: materialIds[1],
            quantity: 15.0,
          });
        });
      });

      cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });
  });

  describe("Flow 2: Realistic Production Scenario", () => {
    it("should simulate a factory producing multiple products", () => {
      const materials = [
        { name: "Aluminum Bar", quantity: 500 },
        { name: "Glass Panel", quantity: 200 },
        { name: "Rubber Gasket", quantity: 1000 },
        { name: "Electronic Chip", quantity: 300 },
      ];

      const materialIds = [];

      materials.forEach((material) => {
        cy.request("POST", `${apiUrl}/raw-materials`, material).then((response) => {
          materialIds.push(response.body.id);
        });
      });

      const products = [
        { name: "Smart Device", value: 500.0 },
        { name: "Basic Display", value: 200.0 },
        { name: "Protection Case", value: 50.0 },
      ];

      const productIds = [];

      products.forEach((product) => {
        cy.request("POST", `${apiUrl}/products`, product).then((response) => {
          productIds.push(response.body.id);
        });
      });

      cy.wait(500);

      cy.then(() => {
        cy.request("POST", `${apiUrl}/products/${productIds[0]}/raw-materials`, {
          rawMaterialId: materialIds[0],
          quantity: 25.0,
        });

        cy.request("POST", `${apiUrl}/products/${productIds[0]}/raw-materials`, {
          rawMaterialId: materialIds[1],
          quantity: 10.0,
        });

        cy.request("POST", `${apiUrl}/products/${productIds[0]}/raw-materials`, {
          rawMaterialId: materialIds[3],
          quantity: 5.0,
        });

        cy.request("POST", `${apiUrl}/products/${productIds[1]}/raw-materials`, {
          rawMaterialId: materialIds[1],
          quantity: 5.0,
        });

        cy.request("POST", `${apiUrl}/products/${productIds[1]}/raw-materials`, {
          rawMaterialId: materialIds[3],
          quantity: 2.0,
        });

        cy.request("POST", `${apiUrl}/products/${productIds[2]}/raw-materials`, {
          rawMaterialId: materialIds[2],
          quantity: 10.0,
        });
      });

      cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(0);

        const smartDevice = response.body.find((p) => p.productName === "Smart Device");
        expect(smartDevice).to.exist;
        expect(smartDevice.producibleQuantity).to.eq(20);

        const totalRevenue = response.body.reduce((sum, item) => {
          return sum + parseFloat(item.totalValueEstimate);
        }, 0);

        expect(totalRevenue).to.be.greaterThan(0);
      });
    });
  });

  describe("Flow 3: Stock Consumption in Production", () => {
    it("should calculate production respecting limited stock", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Rare Metal",
        quantity: 50,
      }).then((materialResponse) => {
        const materialId = materialResponse.body.id;

        cy.request("POST", `${apiUrl}/products`, {
          name: "Product A",
          value: 1000.0,
        }).then((productAResponse) => {
          const productAId = productAResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${productAId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 20.0,
          });

          cy.request("POST", `${apiUrl}/products`, {
            name: "Product B",
            value: 100.0,
          }).then((productBResponse) => {
            const productBId = productBResponse.body.id;

            cy.request("POST", `${apiUrl}/products/${productBId}/raw-materials`, {
              rawMaterialId: materialId,
              quantity: 5.0,
            });

            cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
              expect(response.status).to.eq(200);

              const productA = response.body.find((p) => p.productName === "Product A");
              expect(productA).to.exist;
              expect(productA.producibleQuantity).to.eq(2);
              expect(productA.totalValueEstimate).to.eq(2000.0);

              const productB = response.body.find((p) => p.productName === "Product B");
              expect(productB).to.exist;
              expect(productB.producibleQuantity).to.eq(2);
              expect(productB.totalValueEstimate).to.eq(200.0);
            });
          });
        });
      });
    });
  });

  describe("Flow 4: Stock Update and Recalculation", () => {
    it("should recalculate production after stock update", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Component X",
        quantity: 100,
      }).then((materialResponse) => {
        const materialId = materialResponse.body.id;

        cy.request("POST", `${apiUrl}/products`, {
          name: "Product X",
          value: 250.0,
        }).then((productResponse) => {
          const productId = productResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 10.0,
          });

          cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
            const productX = response.body.find((p) => p.productName === "Product X");
            expect(productX).to.exist;
            expect(productX.producibleQuantity).to.eq(10);
          });
        });
      });
    });
  });

  describe("Flow 5: Complete End-to-End UI", () => {
    it("should complete entire flow through API integration", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Test Material",
        quantity: 1000,
      }).then((materialResponse) => {
        expect(materialResponse.status).to.eq(201);
        const materialId = materialResponse.body.id;

        cy.request("POST", `${apiUrl}/products`, {
          name: "Test Product",
          value: 199.99,
        }).then((productResponse) => {
          expect(productResponse.status).to.eq(201);
          const productId = productResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 10.0,
          }).then((compositionResponse) => {
            expect(compositionResponse.status).to.eq(201);
          });

          cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
            expect(response.status).to.eq(200);
            const testProduct = response.body.find((p) => p.productName === "Test Product");
            expect(testProduct).to.exist;
            expect(testProduct.producibleQuantity).to.eq(100);
          });
        });
      });
    });
  });

  describe("Flow 6: Error and Recovery Scenario", () => {
    it("should handle API errors gracefully", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/products`,
        failOnStatusCode: false,
        body: {},
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });

    it("should recover from connection failure", () => {
      cy.visit("/products");
      cy.get("body").should("be.visible");
    });
  });
});
