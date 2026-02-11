package br.com.autoflex.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CompositionID implements Serializable {

    @Column(name = "id_product")
    public Long productId;

    @Column(name = "id_raw_material")
    public Long rawMaterialId;

    public CompositionID() {}
    public CompositionID(Long productId, Long rawMaterialId) {
        this.productId = productId;
        this.rawMaterialId = rawMaterialId;
    }
    @Override
    public boolean equals(Object o){
        if (this == o) return true;
        if(!(o instanceof CompositionID)) return false;
        CompositionID that = (CompositionID) o;
        return Objects.equals(productId, that.rawMaterialId) &&
                Objects.equals(rawMaterialId, that.rawMaterialId);
    }
    @Override
    public int hashCode(){
        return Objects.hash(productId, rawMaterialId);
    }
}
