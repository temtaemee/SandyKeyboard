package com.kh.app.product.stay.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.product.exception.ErrorCode;
import com.kh.app.product.exception.ProductException;
import com.kh.app.product.space.entity.SpaceApprovalStatus;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.repository.SpaceRepository;
import com.kh.app.product.stay.dto.request.StayInsertReqDto;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.repository.StayRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StayServiceTest {

    @Mock
    private StayRepository stayRepository;

    @Mock
    private SpaceRepository spaceRepository;

    @InjectMocks
    private StayService stayService;

    @Test
    void insertFailsIfSpaceNotFound() {
        StayInsertReqDto dto = new StayInsertReqDto();
        dto.setSpaceId(1L);

        when(spaceRepository.findByIdAndDelYn(1L, "N")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> stayService.insert(dto, null, 100L))
                .isInstanceOf(ProductException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.SPACE_NOT_FOUND);
    }

    @Test
    void insertFailsIfSpaceNotApproved() {
        StayInsertReqDto dto = new StayInsertReqDto();
        dto.setSpaceId(1L);

        MemberEntity seller = MemberEntity.builder().id(10L).build();
        SpaceEntity space = SpaceEntity.builder()
                .id(1L)
                .seller(seller)
                .approvalStatus(SpaceApprovalStatus.PENDING) // NOT approved
                .build();

        when(spaceRepository.findByIdAndDelYn(1L, "N")).thenReturn(Optional.of(space));

        assertThatThrownBy(() -> stayService.insert(dto, null, 10L))
                .isInstanceOf(ProductException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.SPACE_NOT_APPROVED);
    }

    @Test
    void selectOneForSellerFailsIfStayNotFound() {
        when(stayRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> stayService.selectOneForSeller(1L, 10L))
                .isInstanceOf(ProductException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.STAY_NOT_FOUND);
    }

    @Test
    void selectOneForSellerFailsIfAccessDenied() {
        MemberEntity seller = MemberEntity.builder().id(10L).build();
        SpaceEntity space = SpaceEntity.builder().seller(seller).build();
        StayEntity stay = StayEntity.builder().id(1L).space(space).build();

        when(stayRepository.findById(1L)).thenReturn(Optional.of(stay));

        assertThatThrownBy(() -> stayService.selectOneForSeller(1L, 999L)) // non-owner memberId
                .isInstanceOf(ProductException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.STAY_ACCESS_DENIED);
    }
}
