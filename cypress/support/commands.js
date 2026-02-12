Cypress.Commands.add("seedDatabase", () => {
  const apiUrl = Cypress.env("apiUrl");

  const rawMaterials = [
    { name: "Steel Sheet", quantity: 500 },
    { name: "Plastic Resin", quantity: 1000 },
    { name: "Copper Wire", quantity: 800 },
    { name: "Aluminum Bar", quantity: 300 },
    { name: "Glass Panel", quantity: 150 },
  ];

  const products = [
    { name: "Premium Widget", value: 150.0 },
    { name: "Standard Component", value: 75.5 },
    { name: "Deluxe Assembly", value: 250.0 },
  ];

  cy.wrap(rawMaterials).each((material) => {
    cy.request("POST", `${apiUrl}/raw-materials`, material);
  });

  cy.wrap(products).each((product) => {
    cy.request("POST", `${apiUrl}/products`, product);
  });
});

Cypress.Commands.add("clearProducts", () => {
  const apiUrl = Cypress.env("apiUrl");

  return cy.request("GET", `${apiUrl}/products`).then((response) => {
    if (response.body && response.body.length > 0) {
      return cy.wrap(response.body).each((product) => {
        cy.request({
          method: "DELETE",
          url: `${apiUrl}/products/${product.id}`,
          failOnStatusCode: false,
        });
      });
    }
  });
});

Cypress.Commands.add("clearRawMaterials", () => {
  const apiUrl = Cypress.env("apiUrl");

  return cy.request("GET", `${apiUrl}/raw-materials`).then((response) => {
    if (response.body && response.body.length > 0) {
      return cy.wrap(response.body).each((material) => {
        cy.request({
          method: "DELETE",
          url: `${apiUrl}/raw-materials/${material.id}`,
          failOnStatusCode: false,
        });
      });
    }
  });
});

Cypress.Commands.add("clearDatabase", () => {
  cy.clearProducts();
  cy.clearRawMaterials();
  cy.wait(500);
});

Cypress.Commands.add("login", (username, password) => {
  cy.log("Login functionality not implemented yet");
});
