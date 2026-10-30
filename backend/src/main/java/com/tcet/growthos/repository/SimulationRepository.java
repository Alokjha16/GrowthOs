package com.tcet.growthos.repository;

import com.tcet.growthos.entity.Simulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulationRepository extends JpaRepository<Simulation, Long> {
    List<Simulation> findByBusinessIdOrderByCreatedAtDesc(Long businessId);
}