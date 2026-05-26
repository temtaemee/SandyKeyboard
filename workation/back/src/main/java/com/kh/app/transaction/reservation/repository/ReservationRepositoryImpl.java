package com.kh.app.transaction.reservation.repository;

import com.kh.app.member.entity.QMemberEntity; // 💡 추가: 예약자 정보를 가져오기 위함
import com.kh.app.transaction.reservation.dto.response.ReservationAdminListResDto;
import com.kh.app.transaction.reservation.entity.QReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class ReservationRepositoryImpl implements ReservationRepositoryCustom {

    private final JPAQueryFactory qf;

    // 💡 편리한 쿼리 작성을 위해 Q도메인 상수로 선언
    private final QReservationEntity qReservation = QReservationEntity.reservationEntity;
    private final QMemberEntity qMember = QMemberEntity.memberEntity;

    @Override
    public Optional<ReservationEntity> getOneById(Long id) {
        ReservationEntity result = qf
                .selectFrom(qReservation)
                .where(qReservation.id.eq(id))
                .fetchOne();

        return Optional.ofNullable(result);
    }

    /**
     * 💡 관리자용 예약 목록 페이징 조회 구현
     */
    @Override
    public Page<ReservationAdminListResDto> findAdminReservationList(PageRequest pageRequest) {

        // 1. 컨텐츠 데이터 조회 (페치 조인으로 MemberEntity까지 한방에 긁어오기)
        List<ReservationEntity> targetList = qf
                .selectFrom(qReservation)
                .join(qReservation.member, qMember).fetchJoin() // 💡 member.username 접근 시 N+1 방지
                .where(
                        // 나중에 검색 기능 고도화 시 여기에 동적 쿼리(BooleanExpression) 추가 자리
                )
                .orderBy(qReservation.id.desc()) // 최신 예약이 가장 위로 오도록 정렬
                .offset(pageRequest.getOffset()) // 페이지 시작점 (pno * pageSize)
                .limit(pageRequest.getPageSize()) // 한 페이지에 보여줄 개수 (10개)
                .fetch();

        // 2. 전체 카운트 쿼리 조회
        Long total = qf
                .select(qReservation.count())
                .from(qReservation)
                .where(
                        // 목록 조회와 동일한 조건 적용 공간
                )
                .fetchOne();

        long totalCount = (total != null) ? total : 0L;

        // 3. 엔티티 리스트를 안전하게 어드민 DTO 리스트로 변환 (username 완벽 매핑)
        List<ReservationAdminListResDto> adminDtoList = targetList.stream()
                .map(ReservationAdminListResDto::from)
                .toList();

        // 4. 스프링 데이터 Page 결과 객체 반환
        return new PageImpl<>(adminDtoList, pageRequest, totalCount);
    }
}