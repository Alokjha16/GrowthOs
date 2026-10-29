package com.tcet.growthos.repository;

import com.tcet.growthos.model.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {
    List<Business> findByIndustryIgnoreCase(String industry);
    List<Business> findByNameContainingIgnoreCase(String keyword);
}
