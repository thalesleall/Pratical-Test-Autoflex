package br.com.autoflex.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "composition_product")
public class CompositionProduct extends PanacheEntityBase {
    @EmbeddedId
    public CompositionID id;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "id_product")
    public Product product;

    @ManyToOne
    @MapsId("rawMaterialId")
    @JoinColumn(name = "id_raw_material")
    public RawMaterial rawMaterial;

    @Column(name = "necessary_material")
    public Double necessaryMaterial;

    public static CompositionProduct create(Product p, RawMaterial rm, Double qtd) {
        CompositionProduct cp = new CompositionProduct();
        cp.id = new CompositionID(p.id, rm.id);
        cp.product = p;
        cp.rawMaterial = rm;
        cp.necessaryMaterial = qtd;
        return cp;
    }
}
