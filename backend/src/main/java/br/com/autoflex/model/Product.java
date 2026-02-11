package br.com.autoflex.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.FetchType;
import java.util.List;
import java.util.ArrayList;

import java.math.BigDecimal;

@Entity
public class Product extends PanacheEntity {
    @Column(length = 250, nullable = false)
    public String name;

    @Column(precision = 10, scale = 2)
    public BigDecimal value;

    @OneToMany(mappedBy = "product", fetch = FetchType.EAGER)
    public List<CompositionProduct> composition = new ArrayList<>();
}
