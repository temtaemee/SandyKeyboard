package com.kh.app.product.space.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.product.exception.ErrorCode;
import com.kh.app.product.exception.ProductException;
import com.kh.app.product.space.dto.request.SpaceInsertReqDto;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.repository.SpaceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SpaceServiceTest {

    @Mock
    private SpaceRepository spaceRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private SpaceService spaceService;

    @Test
    void insertFailsIfSellerNotFound() {
        SpaceInsertReqDto dto = new SpaceInsertReqDto();
        when(memberRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> spaceService.insert(dto, null, 1L))
                .isInstanceOf(ProductException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.SELLER_NOT_FOUND);
    }

    @Test
    void selectOneForSellerFailsIfSpaceNotFound() {
        when(spaceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> spaceService.selectOneForSeller(1L, 100L))
                .isInstanceOf(ProductException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.SPACE_NOT_FOUND);
    }

    @Test
    void selectOneForSellerFailsIfAccessDenied() {
        MemberEntity seller = MemberEntity.builder().id(10L).build();
        SpaceEntity space = SpaceEntity.builder().id(1L).seller(seller).build();

        when(spaceRepository.findById(1L)).thenReturn(Optional.of(space));

        assertThatThrownBy(() -> spaceService.selectOneForSeller(1L, 999L)) // non-owner memberId
                .isInstanceOf(ProductException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.SPACE_ACCESS_DENIED);
    }

    @Test
    void insertSuccess() {
        SpaceInsertReqDto dto = new SpaceInsertReqDto();
        dto.setName("New Space");
        dto.setPhone("010-1234-5678");
        dto.setEmail("seller@test.com");
        dto.setSummary("Summary");
        dto.setDescription("Description");
        dto.setAddress1("Seoul");
        dto.setArea(Area.SEOUL);

        MemberEntity seller = MemberEntity.builder().id(1L).username("seller1").build();
        SpaceEntity savedSpace = SpaceEntity.builder().id(10L).seller(seller).build();

        when(memberRepository.findById(1L)).thenReturn(Optional.of(seller));
        when(spaceRepository.save(any(SpaceEntity.class))).thenReturn(savedSpace);

        Long spaceId = spaceService.insert(dto, null, 1L);

        assertThat(spaceId).isEqualTo(10L);
        verify(spaceRepository, times(1)).save(any(SpaceEntity.class));
    }
}
