package com.aleprojects.tasktracker.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class WebConfig {

    private static final Logger log = LoggerFactory.getLogger(WebConfig.class);

    @Value("${CORS_ORIGINS:http://localhost:5173}")
    private String corsOrigins;

    @Bean
    public CorsFilter corsFilter() {
        String[] originArray = corsOrigins.split(",");
        List<String> originList = new ArrayList<>();
        for (String origin : originArray) {
            String trimmed = origin.trim();
            int idx = trimmed.indexOf("://");
            if (idx != -1 && trimmed.substring(idx + 3).contains("/")) {
                log.warn("CORS origin '{}' contains a path after the domain. Should be just protocol + domain (e.g., https://example.com)", trimmed);
            }
            originList.add(trimmed);
        }

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(originList);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
