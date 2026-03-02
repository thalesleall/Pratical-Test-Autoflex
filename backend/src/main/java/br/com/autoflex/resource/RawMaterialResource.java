package br.com.autoflex.resource;

import br.com.autoflex.dto.RawMaterialDTO;
import br.com.autoflex.service.RawMaterialService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.net.URI;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Raw Material", description = "Raw material inventory management")
public class RawMaterialResource {

    @Inject
    RawMaterialService service;

    @POST
    @Operation(summary = "Create new raw material", description = "Registers a raw material in stock.")
    @APIResponse(responseCode = "201", description = "Raw material created successfully")
    @APIResponse(responseCode = "400", description = "Validation error")
    public Response create(@Valid RawMaterialDTO dto) {
        RawMaterialDTO created = service.create(dto);
        return Response.created(URI.create("/raw-materials/" + created.id()))
                .entity(created)
                .build();
    }

    @GET
    @Operation(summary = "List all raw materials")
    @APIResponse(responseCode = "200", description = "List retrieved successfully")
    public Response getAll() {
        return Response.ok(service.getAll()).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Retrieve raw material by ID")
    @APIResponse(responseCode = "200", description = "Details retrieved successfully")
    @APIResponse(responseCode = "404", description = "Raw material not found")
    public Response getById(@PathParam("id") Long id) {
        return Response.ok(service.getById(id)).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update raw material", description = "Update stock quantity or name.")
    @APIResponse(responseCode = "200", description = "Updated successfully")
    @APIResponse(responseCode = "404", description = "Raw material not found")
    public Response update(@PathParam("id") Long id, @Valid RawMaterialDTO dto) {
        return Response.ok(service.update(id, dto)).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete raw material")
    @APIResponse(responseCode = "200", description = "Deleted successfully")
    @APIResponse(responseCode = "404", description = "Raw material not found")
    public Response delete(@PathParam("id") Long id) {
        service.delete(id);
        return Response.ok()
                .entity("{\"message\": \"Raw material deleted successfully\"}")
                .build();
    }
}