describe("Backend API - Raw Materials", () => {
  const apiUrl = Cypress.env("apiUrl");
  const endpoint = `${apiUrl}/raw-materials`;

  beforeEach(() => {
    cy.clearDatabase();
  });

  describe("POST /raw-materials - Create", () => {
    it("should create a new raw material successfully", () => {
      const newMaterial = {
        name: "Steel Sheet",
        quantity: 500,
      };

      cy.request("POST", endpoint, newMaterial).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("id");
        expect(response.body.name).to.eq(newMaterial.name);
        expect(response.body.quantity).to.eq(newMaterial.quantity);
      });
    });

    it("should create multiple raw materials (load test)", () => {
      const materials = [
        { name: "Steel Sheet", quantity: 500 },
        { name: "Plastic Resin", quantity: 1000 },
        { name: "Copper Wire", quantity: 800 },
      ];

      cy.wrap(materials).each((material) => {
        cy.request("POST", endpoint, material).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.name).to.eq(material.name);
          expect(response.body.quantity).to.eq(material.quantity);
        });
      });

      cy.request("GET", endpoint).then((response) => {
        expect(response.status).to.eq(200);
        materials.forEach((material) => {
          const found = response.body.find((m) => m.name === material.name);
          expect(found).to.exist;
          expect(found.quantity).to.eq(material.quantity);
        });
      });
    });

    it("should fail to create raw material without name", () => {
      cy.request({
        method: "POST",
        url: endpoint,
        body: { quantity: 100 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it("should fail to create raw material with negative quantity", () => {
      cy.request({
        method: "POST",
        url: endpoint,
        body: { name: "Invalid Material", quantity: -10 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe("GET /raw-materials - List", () => {
    it("should list all raw materials", () => {
      // Cria alguns itens primeiro
      const materials = [
        { name: "Material A", quantity: 100 },
        { name: "Material B", quantity: 200 },
        { name: "Material C", quantity: 300 },
      ];

      cy.wrap(materials).each((m) => cy.request("POST", endpoint, m));

      cy.request("GET", endpoint).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length.at.least(3);
      });
    });

    it("should return array of raw materials", () => {
      cy.request("GET", endpoint).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });
  });

  describe("GET /raw-materials/:id - Get by ID", () => {
    it("should fetch raw material by ID", () => {
      const material = { name: "Test Material", quantity: 150 };

      cy.request("POST", endpoint, material).then((createResponse) => {
        const id = createResponse.body.id;

        cy.request("GET", `${endpoint}/${id}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.id).to.eq(id);
          expect(response.body.name).to.eq(material.name);
          expect(response.body.quantity).to.eq(material.quantity);
        });
      });
    });

    it("should return 404 for non-existent ID", () => {
      cy.request({
        method: "GET",
        url: `${endpoint}/99999`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe("PUT /raw-materials/:id - Update", () => {
    it("should return 404 when updating non-existent ID", () => {
      cy.request({
        method: "PUT",
        url: `${endpoint}/99999`,
        body: { name: "Test", quantity: 100 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe("DELETE /raw-materials/:id - Delete", () => {
    it("should delete existing raw material", () => {
      const material = { name: "To Delete", quantity: 50 };

      cy.request("POST", endpoint, material).then((createResponse) => {
        const id = createResponse.body.id;

        cy.request("DELETE", `${endpoint}/${id}`).then((response) => {
          expect(response.status).to.eq(204);
        });

        cy.request({
          method: "GET",
          url: `${endpoint}/${id}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });

    it("should return 404 when deleting non-existent ID", () => {
      cy.request({
        method: "DELETE",
        url: `${endpoint}/99999`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe("Load Test - Performance", () => {
    it("should support creation of 10 raw materials", () => {
      const materials = Array.from({ length: 10 }, (_, i) => ({
        name: `Material ${i + 1}`,
        quantity: Math.floor(Math.random() * 1000) + 1,
      }));

      cy.wrap(materials).each((material) => {
        cy.request("POST", endpoint, material).then((response) => {
          expect(response.status).to.eq(201);
        });
      });

      cy.request("GET", endpoint).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.be.greaterThan(0);
      });
    });
  });
});
