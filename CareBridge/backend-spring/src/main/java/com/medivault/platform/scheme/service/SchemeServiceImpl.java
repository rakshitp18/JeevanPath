package com.medivault.platform.scheme.service;

import com.medivault.platform.mapper.PlatformMapper;
import com.medivault.platform.scheme.dto.GovernmentSchemeDto;
import com.medivault.platform.scheme.repository.GovernmentSchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchemeServiceImpl implements SchemeService {

    private final GovernmentSchemeRepository schemeRepository;
    private final PlatformMapper mapper;

    @Override
    public List<GovernmentSchemeDto> getActiveSchemes() {
        return mapper.toSchemeDtoList(schemeRepository.findByStatus("ACTIVE"));
    }
}
