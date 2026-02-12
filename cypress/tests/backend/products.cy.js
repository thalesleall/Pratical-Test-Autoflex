describe("Backend API - Products", () => {
  const apiUrl = Cypress.env("apiUrl");
  const endpoint = `${apiUrl}/products`;

  beforeEach(() => {
    cy.clearDatabase();
  });

  describe("POST /products - Create", () => {
    it("should create a new product successfully", () => {
      const newProduct = {
        name: "Premium Widget",
        value: 150.5,
      };

      cy.request("POST", endpoint, newProduct).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("id");
        expect(response.body.name).to.eq(newProduct.name);
        expect(response.body.value).to.eq(newProduct.value);
      });
    });

    it("should create multiple products (load test)", () => {
      const products = [
        { name: "Premium Widget", value: 150.0 },
        { name: "Standard Component", value: 75.5 },
        { name: "Deluxe Assembly", value: 250.0 },
      ];

      cy.wrap(products).each((product) => {
        cy.request("POST", endpoint, product).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.name).to.eq(product.name);
          expect(response.body.value).to.eq(product.value);
        });
      });

      cy.request("GET", endpoint).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");

        const createdProducts = products.map((p) => response.body.find((item) => item.name === p.name && item.value === p.value));

        createdProducts.forEach((product, index) => {
          expect(product).to.exist;
          expect(product.name).to.eq(products[index].name);
          expect(product.value).to.eq(products[index].value);
        });
      });
    });

    it("should fail to create product without name", () => {
      cy.request({
        method: "POST",
        url: endpoint,
        body: { value: 100.0 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it("should fail to create product without value", () => {
      cy.request({
        method: "POST",
        url: endpoint,
        body: { name: "Invalid Product" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it("should fail to create product with negative value", () => {
      cy.request({
        method: "POST",
        url: endpoint,
        body: { name: "Invalid Product", value: -10.0 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it("should fail to create product with zero value", () => {
      cy.request({
        method: "POST",
        url: endpoint,
        body: { name: "Zero Product", value: 0 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe("GET /products - List", () => {
    it("should list all products", () => {
      const products = [
        { name: "Product A", value: 100.0 },
        { name: "Product B", value: 200.0 },
        { name: "Product C", value: 300.0 },
      ];

      cy.wrap(products).each((p) => cy.request("POST", endpoint, p));

      cy.request("GET", endpoint).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length.at.least(3);
      });
    });

    it("should return array of products", () => {
      cy.request("GET", endpoint).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });
  });

  describe("GET /products/:id - Get by ID", () => {
    it("should fetch product by ID", () => {
      const product = { name: "Test Product", value: 99.99 };

      cy.request("POST", endpoint, product).then((createResponse) => {
        const id = createResponse.body.id;

        cy.request("GET", `${endpoint}/${id}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.id).to.eq(id);
          expect(response.body.name).to.eq(product.name);
          expect(response.body.value).to.eq(product.value);
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

  describe("PUT /products/:id - Update", () => {
    it("should return 404 when updating non-existent ID", () => {
      cy.request({
        method: "PUT",
        url: `${endpoint}/99999`,
        body: { name: "Test", value: 100.0 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe("DELETE /products/:id - Delete", () => {
    it("should delete existing product", () => {
      const product = { name: "To Delete", value: 50.0 };

      cy.request("POST", endpoint, product).then((createResponse) => {
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
    it("should support creation of 10 products", () => {
      const products = Array.from({ length: 10 }, (_, i) => ({
        name: `Product ${i + 1}`,
        value: Math.round((Math.random() * 5000 + 10) * 100) / 100,
      }));

      cy.wrap(products).each((product) => {
        cy.request("POST", endpoint, product).then((response) => {
          expect(response.status).to.eq(201);
        });
      });

      cy.request("GET", endpoint).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(0);
      });
    });
  });
});
