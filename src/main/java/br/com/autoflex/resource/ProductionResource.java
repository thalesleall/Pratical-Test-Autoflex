package br.com.autoflex.resource;

import br.com.autoflex.service.ProductionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("/production")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Production Planning", description = "Endpoints for production feasibility and suggestions")
public class ProductionResource {

    @Inject
    ProductionService service;

    @GET
    @Path("/suggestion")
    @Operation(
            summary = "Get production suggestion",
            description = "Calculates producible quantity based on current stock, prioritizing higher-value products."
    )
    @APIResponse(responseCode = "200", description = "Suggestion generated successfully")
    public Response getSuggestion() {
        return Response.ok(service.getProductionSuggestion()).build();
    }
}