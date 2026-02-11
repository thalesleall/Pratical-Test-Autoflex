package br.com.autoflex.repository;

import br.com.autoflex.model.RawMaterial;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RawMaterialRepository implements PanacheRepository<RawMaterial> {
    //All necessary repo functions are implemented by default with panache
}