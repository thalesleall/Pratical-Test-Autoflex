package br.com.autoflex.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class RawMaterial extends PanacheEntity {

    @Column(length = 250, nullable = false)
    public String name;

    public int quantity;
}
