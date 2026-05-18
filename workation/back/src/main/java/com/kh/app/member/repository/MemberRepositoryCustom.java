package com.kh.app.member.repository;

import com.kh.app.member.dto.request.MemberSearchCondDto;
import com.kh.app.member.dto.request.SellerSearchCondDto;
import com.kh.app.member.dto.response.MemberListRespDto;

import java.util.List;

public interface MemberRepositoryCustom {
    List<MemberListRespDto> searchMembers(MemberSearchCondDto dto);

    long countMembers(MemberSearchCondDto dto);

    List<MemberListRespDto> searchSellers(SellerSearchCondDto dto);

    long countSellers(SellerSearchCondDto dto);
}
