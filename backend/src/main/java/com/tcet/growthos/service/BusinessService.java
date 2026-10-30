package com.tcet.growthos.service;

import com.tcet.growthos.entity.Business;
import com.tcet.growthos.repository.BusinessRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BusinessService {

    private final BusinessRepository businessRepository;

    @PostConstruct
    public void initSeedData() {
        if (businessRepository.count() == 0) {
            Business demoStore = Business.builder()
                    .name("Rang Studio")
                    .businessType("ECOMMERCE")
                    .industry("Apparel & Ethnic Wear")
                    .website("https://rangstudio.in")
                    .monthlyRevenue(1840000.0)
                    .monthlyExpenses(1420000.0)
                    .customersPerMonth(850)
                    .repeatCustomerPercentage(18)
                    .averageOrderValue(2160.0)
                    .customerAcquisitionCost(640.0)
                    .returnOnAdSpend(2.4)
                    .codRate(62)
                    .rtoRate(22)
                    .healthScore(62)
                    .build();
            businessRepository.save(demoStore);
        }
    }

    public List<Business> getAllBusinesses() {
        return businessRepository.findAll();
    }

    public Optional<Business> getBusinessById(Long id) {
        return businessRepository.findById(id);
    }

    public List<Business> searchByName(String keyword) {
        return businessRepository.findByNameContainingIgnoreCase(keyword);
    }

    public List<Business> filterByIndustry(String industry) {
        return businessRepository.findByIndustryIgnoreCase(industry);
    }

    public Business createBusiness(Business business) {
        return businessRepository.save(business);
    }

    public Optional<Business> updateBusiness(Long id, Business updated) {
        return businessRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setBusinessType(updated.getBusinessType());
            existing.setIndustry(updated.getIndustry());
            existing.setWebsite(updated.getWebsite());
            existing.setMonthlyRevenue(updated.getMonthlyRevenue());
            existing.setMonthlyExpenses(updated.getMonthlyExpenses());
            existing.setCustomersPerMonth(updated.getCustomersPerMonth());
            existing.setRepeatCustomerPercentage(updated.getRepeatCustomerPercentage());
            existing.setAverageOrderValue(updated.getAverageOrderValue());
            existing.setCustomerAcquisitionCost(updated.getCustomerAcquisitionCost());
            existing.setReturnOnAdSpend(updated.getReturnOnAdSpend());
            existing.setCodRate(updated.getCodRate());
            existing.setRtoRate(updated.getRtoRate());
            existing.setHealthScore(existing.calculateInitialHealthScore());
            return businessRepository.save(existing);
        });
    }

    public boolean deleteBusiness(Long id) {
        if (businessRepository.existsById(id)) {
            businessRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
