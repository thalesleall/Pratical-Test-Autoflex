package br.com.autoflex.service.impl;

import br.com.autoflex.dto.RawMaterialDTO;
import br.com.autoflex.mapper.RawMaterialMapper;
import br.com.autoflex.model.RawMaterial;
import br.com.autoflex.repository.RawMaterialRepository;
import br.com.autoflex.service.RawMaterialService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class RawMaterialServiceImpl implements RawMaterialService {

    @Inject
    RawMaterialRepository repository;

    @Inject
    RawMaterialMapper mapper;

    @Override
    @Transactional
    public RawMaterialDTO create(RawMaterialDTO dto) {
        RawMaterial entity = mapper.toEntity(dto);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Override
    public List<RawMaterialDTO> getAll() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RawMaterialDTO getById(Long id) {
        RawMaterial entity = repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Raw Material not found"));
        return mapper.toDTO(entity);
    }

    @Override
    @Transactional
    public RawMaterialDTO update(Long id, RawMaterialDTO dto) {
        RawMaterial entity = repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Raw Material not found"));

        mapper.updateEntityFromDTO(dto, entity);
        return mapper.toDTO(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        boolean deleted = repository.deleteById(id);
        if (!deleted) {
            throw new NotFoundException("Raw Material not found");
        }
    }
}