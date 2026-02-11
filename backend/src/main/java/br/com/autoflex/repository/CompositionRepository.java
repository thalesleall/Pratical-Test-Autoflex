package br.com.autoflex.repository;

import br.com.autoflex.model.CompositionProduct;
import br.com.autoflex.model.CompositionID;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CompositionRepository implements PanacheRepositoryBase<CompositionProduct, CompositionID> { }