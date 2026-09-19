package com.medivault.platform.scheme.entity;

import com.medivault.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "government_schemes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GovernmentScheme extends BaseEntity {

    @Column(name = "scheme_name", nullable = false)
    private String schemeName;

    @Column(length = 100)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "eligibility_criteria", columnDefinition = "TEXT")
    private String eligibilityCriteria;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    @Column(length = 50)
    private String gender;

    @Column(name = "max_income")
    private Double maxIncome;

    @Column(length = 100)
    private String state;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(length = 50)
    @Builder.Default
    private String status = "ACTIVE";
}
