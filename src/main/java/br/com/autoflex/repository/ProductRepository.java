package br.com.autoflex.repository;

import br.com.autoflex.model.Product;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProductRepository implements PanacheRepository<Product> {
    //Allnecessary repo functions are implemented by default with panache
}
