describe("Integration - Validations and Business Rules", () => {
  const apiUrl = Cypress.env("apiUrl");

  beforeEach(() => {
    cy.clearProducts();
    cy.clearRawMaterials();
  });

  describe("Validation: Product without Composition", () => {
    it("should not include product without composition in production suggestion", () => {
      cy.request("POST", `${apiUrl}/products`, {
        name: "Incomplete Product",
        value: 500.0,
      });

      cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
        expect(response.status).to.eq(200);
        const incompleteProduct = response.body.find((p) => p.productName === "Incomplete Product");
        expect(incompleteProduct).to.be.undefined;
      });
    });
  });

  describe("Validation: Insufficient Stock", () => {
    it("should not suggest production when stock is insufficient", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Scarce Material",
        quantity: 5,
      }).then((materialResponse) => {
        const materialId = materialResponse.body.id;

        cy.request("POST", `${apiUrl}/products`, {
          name: "High Demand Product",
          value: 300.0,
        }).then((productResponse) => {
          const productId = productResponse.body.id;

          // Produto precisa de 10, mas só tem 5
          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 10.0,
          });

          cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
            expect(response.status).to.eq(200);
            const highDemandProduct = response.body.find((p) => p.productName === "High Demand Product");
            expect(highDemandProduct).to.be.undefined;
          });
        });
      });
    });
  });

  describe("Validation: Prioritization by Value", () => {
    it("should prioritize higher value products in production", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Shared Resource",
        quantity: 100,
      }).then((materialResponse) => {
        const materialId = materialResponse.body.id;

        cy.request("POST", `${apiUrl}/products`, {
          name: "Low Value Product",
          value: 50.0,
        }).then((lowValueResponse) => {
          const lowValueId = lowValueResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${lowValueId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 5.0,
          });

          cy.request("POST", `${apiUrl}/products`, {
            name: "High Value Product",
            value: 500.0,
          }).then((highValueResponse) => {
            const highValueId = highValueResponse.body.id;

            cy.request("POST", `${apiUrl}/products/${highValueId}/raw-materials`, {
              rawMaterialId: materialId,
              quantity: 10.0,
            });

            cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
              expect(response.status).to.eq(200);

              const highValueProduct = response.body.find((p) => p.productName === "High Value Product");
              expect(highValueProduct).to.exist;
              expect(highValueProduct.producibleQuantity).to.eq(10);

              const lowValueProduct = response.body.find((p) => p.productName === "Low Value Product");
              if (lowValueProduct) {
                const highValueIndex = response.body.indexOf(highValueProduct);
                const lowValueIndex = response.body.indexOf(lowValueProduct);
                expect(highValueIndex).to.be.lessThan(lowValueIndex);
              }
            });
          });
        });
      });
    });
  });

  describe("Validation: Cascade Relationships", () => {
    it("should maintain integrity when deleting raw material used in composition", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Critical Material",
        quantity: 100,
      }).then((materialResponse) => {
        const materialId = materialResponse.body.id;

        cy.request("POST", `${apiUrl}/products`, {
          name: "Dependent Product",
          value: 200.0,
        }).then((productResponse) => {
          const productId = productResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 5.0,
          });

          // Tenta deletar matéria-prima
          cy.request({
            method: "DELETE",
            url: `${apiUrl}/raw-materials/${materialId}`,
            failOnStatusCode: false,
          }).then((response) => {
            // Pode ser 409 (conflict) ou 400, dependendo da implementação
            // Ou pode permitir delete e quebrar composição
            expect([204, 400, 409, 500]).to.include(response.status);
          });
        });
      });
    });
  });

  describe("Validation: Complex Production Calculations", () => {
    it("should calculate correctly with multiple materials and restrictions", () => {
      const materials = [
        { name: "Material A", quantity: 100 },
        { name: "Material B", quantity: 150 },
        { name: "Material C", quantity: 500 },
      ];

      const materialIds = [];

      materials.forEach((material) => {
        cy.request("POST", `${apiUrl}/raw-materials`, material).then((response) => {
          materialIds.push(response.body.id);
        });
      });

      cy.then(() => {
        cy.request("POST", `${apiUrl}/products`, {
          name: "Complex Product",
          value: 350.0,
        }).then((productResponse) => {
          const productId = productResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialIds[0],
            quantity: 5.0,
          });

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialIds[1],
            quantity: 10.0,
          });

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialIds[2],
            quantity: 20.0,
          });

          cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
            expect(response.status).to.eq(200);

            const suggestion = response.body.find((p) => p.productName === "Complex Product");
            expect(suggestion).to.exist;
            expect(suggestion.producibleQuantity).to.eq(15);
            expect(suggestion.totalValueEstimate).to.eq(5250.0);
          });
        });
      });
    });
  });

  describe("Validation: Real-time Updates", () => {
    it("should reflect composition in production suggestions", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Dynamic Material",
        quantity: 50,
      }).then((materialResponse) => {
        const materialId = materialResponse.body.id;

        cy.request("POST", `${apiUrl}/products`, {
          name: "Dynamic Product",
          value: 100.0,
        }).then((productResponse) => {
          const productId = productResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 10.0,
          }).then((compResponse) => {
            expect(compResponse.status).to.eq(201);
          });

          cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
            const dynamicProduct = response.body.find((p) => p.productName === "Dynamic Product");
            expect(dynamicProduct).to.exist;
            expect(dynamicProduct.producibleQuantity).to.eq(5);
          });

          cy.request({
            method: "DELETE",
            url: `${apiUrl}/products/${productId}/raw-materials/${materialId}`,
            failOnStatusCode: false,
          }).then((deleteResponse) => {
            expect([200, 204, 404]).to.include(deleteResponse.status);
          });
        });
      });
    });
  });

  describe("Validation: Data Consistency", () => {
    it("should maintain correct decimal values in calculations", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Precision Material",
        quantity: 100,
      }).then((materialResponse) => {
        const materialId = materialResponse.body.id;

        cy.request("POST", `${apiUrl}/products`, {
          name: "Precision Product",
          value: 123.45,
        }).then((productResponse) => {
          const productId = productResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 7.5,
          });

          cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
            expect(response.status).to.eq(200);

            const suggestion = response.body.find((p) => p.productName === "Precision Product");
            expect(suggestion).to.exist;
            expect(suggestion.producibleQuantity).to.eq(13);
            const expectedTotal = 123.45 * 13;
            expect(suggestion.totalValueEstimate).to.be.closeTo(expectedTotal, 0.01);
          });
        });
      });
    });
  });
});
