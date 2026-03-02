package br.com.autoflex.resource;

import br.com.autoflex.dto.CompositionDTO;
import br.com.autoflex.service.CompositionService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("/products/{productId}/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Product Composition", description = "Manage the recipe/composition of products")
public class ProductCompositionResource {

    @Inject
    CompositionService service;

    @GET
    @Operation(summary = "Get product composition", description = "Retrieves all raw materials associated with a product.")
    @APIResponse(responseCode = "200", description = "Composition retrieved successfully")
    @APIResponse(responseCode = "404", description = "Product not found")
    public Response getComposition(@PathParam("productId") Long productId) {
        return Response.ok(service.getCompositionsByProduct(productId)).build();
    }

    @POST
    @Operation(summary = "Add raw material to product", description = "Links a raw material to a product with a specific quantity.")
    @APIResponse(responseCode = "201", description = "Association created successfully")
    @APIResponse(responseCode = "404", description = "Product or Raw Material not found")
    @APIResponse(responseCode = "400", description = "Validation error or Association already exists")
    public Response add(@PathParam("productId") Long productId, @Valid CompositionDTO dto) {
        CompositionDTO created = service.addComposition(productId, dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{rawMaterialId}")
    @Operation(summary = "Update raw material quantity", description = "Updates the required quantity of a specific raw material in the product.")
    @APIResponse(responseCode = "200", description = "Quantity updated successfully")
    @APIResponse(responseCode = "404", description = "Association not found")
    public Response update(
            @PathParam("productId") Long productId,
            @PathParam("rawMaterialId") Long rawMaterialId,
            @Valid CompositionDTO dto) {

        return Response.ok(service.updateComposition(productId, rawMaterialId, dto)).build();
    }

    @DELETE
    @Path("/{rawMaterialId}")
    @Operation(summary = "Remove raw material from product", description = "Deletes the association between the product and the raw material.")
    @APIResponse(responseCode = "200", description = "Association removed successfully")
    @APIResponse(responseCode = "404", description = "Association not found")
    public Response delete(
            @PathParam("productId") Long productId,
            @PathParam("rawMaterialId") Long rawMaterialId) {

        service.removeComposition(productId, rawMaterialId);
        return Response.ok()
                .entity("{\"message\": \"Association removed successfully\"}")
                .build();
    }
}