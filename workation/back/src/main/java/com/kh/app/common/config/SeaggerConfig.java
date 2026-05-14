package com.kh.app.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeaggerConfig {

    @Bean
    public OpenAPI openAPI(){
        String schemeName = "BearTokenAuth";
        return new OpenAPI()
                .info(new Info().title("파이널 프로젝트").version("v0"))
                .addSecurityItem(new SecurityRequirement().addList(schemeName))
                .components(
                        new Components()
                                .addSecuritySchemes(
                                        schemeName,
                                        new SecurityScheme()
                                                .name(schemeName)
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("Jwt")
                                )
                )
                ;
    }
}
