package br.com.autoflex.resource;

import br.com.autoflex.dto.ProductDTO;
import br.com.autoflex.service.ProductService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.net.URI;
import java.util.List;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Product", description = "Product catalog management")
public class ProductResource {

    @Inject
    ProductService service;

    @POST
    @Operation(summary = "Create a new product", description = "Registers a product in the database and returns the generated ID.")
    @APIResponse(responseCode = "201", description = "Product created successfully")
    @APIResponse(responseCode = "400", description = "Validation error on submitted fields")
    public Response create(@Valid ProductDTO dto) {
        ProductDTO created = service.createProduct(dto);
        return Response.created(URI.create("/products/" + created.id()))
                .entity(created)
                .build();
    }

    @GET
    @Operation(summary = "List all products")
    @APIResponse(responseCode = "200", description = "Products retrieved successfully")
    public Response getAll() {
        return Response.ok(service.getAllProducts()).build();
    }

    @GET
    @Operation(summary = "Retrieve a product by ID")
    @APIResponse(responseCode = "200", description = "Product details retrieved successfully")
    @APIResponse(responseCode = "404", description = "Product not found")
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        return Response.ok(service.getProductById(id)).build();
    }

    @PUT
    @Operation(summary = "Update an existing product")
    @APIResponse(responseCode = "200", description = "Product updated successfully")
    @APIResponse(responseCode = "400", description = "Validation error or invalid ID")
    @APIResponse(responseCode = "404", description = "Product not found")
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid ProductDTO dto) {
        return Response.ok(service.updateProduct(id, dto)).build();
    }

    @DELETE
    @Operation(summary = "Delete a product by ID")
    @APIResponse(responseCode = "200", description = "Product deleted successfully")
    @APIResponse(responseCode = "404", description = "Product not found")
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        service.deleteProduct(id);
        return Response.ok()
                .entity("{\"message\": \"Product deleted successfully\"}")
                .build();
    }
}