describe("Backend API - Production Planning", () => {
  const apiUrl = Cypress.env("apiUrl");
  const endpoint = `${apiUrl}/production/suggestion`;

  beforeEach(() => {
    cy.clearDatabase();
  });

  describe("GET /production/suggestion - Production Suggestion", () => {
    it("should return empty suggestion when there are no products", () => {
      cy.request("GET", endpoint).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });

    it("should calculate possible production with available stock", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Steel",
        quantity: 100,
      }).then((steelResponse) => {
        const steelId = steelResponse.body.id;

        cy.request("POST", `${apiUrl}/raw-materials`, {
          name: "Plastic",
          quantity: 50,
        }).then((plasticResponse) => {
          const plasticId = plasticResponse.body.id;

          cy.request("POST", `${apiUrl}/products`, {
            name: "Widget",
            value: 100.0,
          }).then((productResponse) => {
            const productId = productResponse.body.id;

            cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
              rawMaterialId: steelId,
              quantity: 10.0,
            });

            cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
              rawMaterialId: plasticId,
              quantity: 5.0,
            });

            cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.be.an("array");
              expect(response.body.length).to.be.greaterThan(0);

              const suggestion = response.body.find((s) => s.productName === "Widget");
              expect(suggestion).to.exist;
              expect(suggestion.producibleQuantity).to.eq(10);
              expect(suggestion.unitValue).to.eq(100.0);
              expect(suggestion.totalValueEstimate).to.eq(1000.0);
            });
          });
        });
      });
    });

    it("should prioritize products with higher value", () => {
      // Cria matéria-prima compartilhada
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Shared Material",
        quantity: 100,
      }).then((materialResponse) => {
        const materialId = materialResponse.body.id;

        // Cria produto de alto valor
        cy.request("POST", `${apiUrl}/products`, {
          name: "Premium Product",
          value: 500.0,
        }).then((premiumResponse) => {
          const premiumId = premiumResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${premiumId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 10.0,
          });

          // Cria produto de baixo valor
          cy.request("POST", `${apiUrl}/products`, {
            name: "Basic Product",
            value: 50.0,
          }).then((basicResponse) => {
            const basicId = basicResponse.body.id;

            cy.request("POST", `${apiUrl}/products/${basicId}/raw-materials`, {
              rawMaterialId: materialId,
              quantity: 5.0,
            }).then(() => {
              cy.request("GET", endpoint).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.length).to.be.greaterThan(0);

                const premiumProduct = response.body.find((s) => s.productName === "Premium Product");
                const basicProduct = response.body.find((s) => s.productName === "Basic Product");

                expect(premiumProduct).to.exist;
                expect(premiumProduct.producibleQuantity).to.eq(10);
                expect(premiumProduct.unitValue).to.eq(500.0);

                if (basicProduct) {
                  expect(basicProduct.producibleQuantity).to.eq(20);
                  expect(basicProduct.unitValue).to.eq(50.0);

                  const premiumIndex = response.body.indexOf(premiumProduct);
                  const basicIndex = response.body.indexOf(basicProduct);
                  expect(premiumIndex).to.be.lessThan(basicIndex);
                }
              });
            });
          });
        });
      });
    });

    it("should calculate multiple products with different stocks", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Steel",
        quantity: 500,
      }).then((steelResponse) => {
        const steelId = steelResponse.body.id;

        cy.request("POST", `${apiUrl}/raw-materials`, {
          name: "Plastic",
          quantity: 300,
        }).then((plasticResponse) => {
          const plasticId = plasticResponse.body.id;

          cy.request("POST", `${apiUrl}/raw-materials`, {
            name: "Copper",
            quantity: 200,
          }).then((copperResponse) => {
            const copperId = copperResponse.body.id;

            cy.request("POST", `${apiUrl}/products`, {
              name: "Deluxe Item",
              value: 300.0,
            }).then((product1Response) => {
              const product1Id = product1Response.body.id;

              cy.request("POST", `${apiUrl}/products/${product1Id}/raw-materials`, {
                rawMaterialId: steelId,
                quantity: 20.0,
              });

              cy.request("POST", `${apiUrl}/products/${product1Id}/raw-materials`, {
                rawMaterialId: copperId,
                quantity: 10.0,
              });

              cy.request("POST", `${apiUrl}/products`, {
                name: "Standard Item",
                value: 150.0,
              }).then((product2Response) => {
                const product2Id = product2Response.body.id;

                cy.request("POST", `${apiUrl}/products/${product2Id}/raw-materials`, {
                  rawMaterialId: plasticId,
                  quantity: 15.0,
                });

                cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
                  expect(response.status).to.eq(200);
                  expect(response.body.length).to.be.greaterThan(0);
                  response.body.forEach((suggestion) => {
                    expect(suggestion).to.have.property("productName");
                    expect(suggestion).to.have.property("producibleQuantity");
                    expect(suggestion).to.have.property("unitValue");
                    expect(suggestion).to.have.property("totalValueEstimate");
                    expect(suggestion.producibleQuantity).to.be.greaterThan(0);
                  });
                });
              });
            });
          });
        });
      });
    });

    it("should return zero when there is insufficient stock", () => {
      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Rare Material",
        quantity: 5,
      }).then((materialResponse) => {
        const materialId = materialResponse.body.id;

        cy.request("POST", `${apiUrl}/products`, {
          name: "Complex Product",
          value: 1000.0,
        }).then((productResponse) => {
          const productId = productResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 10.0,
          });

          cy.request("GET", endpoint).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an("array");

            const complexProduct = response.body.find((s) => s.productName === "Complex Product");
            if (complexProduct) {
              expect(complexProduct.producibleQuantity).to.eq(0);
            }
          });
        });
      });
    });

    it("should ignore products without composition", () => {
      cy.request("POST", `${apiUrl}/products`, {
        name: "Incomplete Product",
        value: 200.0,
      });

      cy.request("POST", `${apiUrl}/raw-materials`, {
        name: "Material",
        quantity: 100,
      }).then((materialResponse) => {
        const materialId = materialResponse.body.id;

        cy.request("POST", `${apiUrl}/products`, {
          name: "Complete Product",
          value: 150.0,
        }).then((productResponse) => {
          const productId = productResponse.body.id;

          cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
            rawMaterialId: materialId,
            quantity: 5.0,
          });

          cy.request("GET", endpoint).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an("array");

            const completeProduct = response.body.find((s) => s.productName === "Complete Product");
            expect(completeProduct).to.exist;
            expect(completeProduct.productName).to.eq("Complete Product");

            const incompleteProduct = response.body.find((s) => s.productName === "Incomplete Product");
            expect(incompleteProduct).to.not.exist;
          });
        });
      });
    });
  });

  describe("Load Test - Complex Scenario", () => {
    it("should calculate production for 3 products with 5 raw materials", () => {
      const materialsData = Array.from({ length: 5 }, (_, i) => ({
        name: `Material ${i + 1}`,
        quantity: Math.floor(Math.random() * 500) + 100,
      }));

      const materialIds = [];

      cy.wrap(materialsData).each((material) => {
        cy.request("POST", `${apiUrl}/raw-materials`, material).then((response) => {
          materialIds.push(response.body.id);
        });
      });

      cy.then(() => {
        const productsData = Array.from({ length: 3 }, (_, i) => ({
          name: `Product ${i + 1}`,
          value: Math.round((Math.random() * 1000 + 50) * 100) / 100,
        }));

        cy.wrap(productsData).each((product) => {
          cy.request("POST", `${apiUrl}/products`, product).then((productResponse) => {
            const productId = productResponse.body.id;

            const numMaterials = Math.floor(Math.random() * 2) + 2;
            const selectedMaterials = materialIds.slice(0, numMaterials);

            cy.wrap(selectedMaterials).each((matId) => {
              cy.request("POST", `${apiUrl}/products/${productId}/raw-materials`, {
                rawMaterialId: matId,
                quantity: Math.round((Math.random() * 10 + 1) * 100) / 100,
              });
            });
          });
        });
      });

      cy.then(() => {
        cy.request("GET", `${apiUrl}/production/suggestion`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an("array");
          for (let i = 0; i < response.body.length - 1; i++) {
            expect(response.body[i].unitValue).to.be.at.least(response.body[i + 1].unitValue);
          }
        });
      });
    });
  });
});
