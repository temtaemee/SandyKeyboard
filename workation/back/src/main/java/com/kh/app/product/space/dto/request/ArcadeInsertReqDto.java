package com.kh.app.product.space.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArcadeInsertReqDto {
    @NotBlank
    private String name;
}
