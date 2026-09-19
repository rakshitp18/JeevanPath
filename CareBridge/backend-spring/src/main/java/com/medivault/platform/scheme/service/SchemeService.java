package com.medivault.platform.scheme.service;

import com.medivault.platform.scheme.dto.GovernmentSchemeDto;

import java.util.List;

public interface SchemeService {
    List<GovernmentSchemeDto> getActiveSchemes();
}
