package com.kh.app.transaction.reservation.repository;

import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.product.space.entity.QSpaceEntity; // 💡 추가
import com.kh.app.product.stay.entity.QStayEntity;   // 💡 추가
import com.kh.app.transaction.reservation.dto.response.ReservationAdminListResDto;
import com.kh.app.transaction.reservation.entity.QReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class ReservationRepositoryImpl implements ReservationRepositoryCustom {

    private final JPAQueryFactory qf;

    private final QReservationEntity qReservation = QReservationEntity.reservationEntity;
    private final QMemberEntity qMember = QMemberEntity.memberEntity; // 예약한 일반 유저

    // 💡 상품 판매자 조인 추적을 위한 Q도메인 선언
    private final QStayEntity qStay = QStayEntity.stayEntity;
    private final QSpaceEntity qSpace = QSpaceEntity.spaceEntity;
    private final QMemberEntity qSeller = new QMemberEntity("qSeller"); // 💡 qMember와 충돌 방지용 별칭 지정

    @Override
    public Optional<ReservationEntity> getOneById(Long id) {
        ReservationEntity result = qf
                .selectFrom(qReservation)
                .where(qReservation.id.eq(id))
                .fetchOne();

        return Optional.ofNullable(result);
    }

    /**
     * 💡 [정정] 판매자이름(sellerUsername) 파라미터 조건 반영
     */
    @Override
    public Page<ReservationAdminListResDto> findAdminReservationList(
            PageRequest pageRequest,
            String username,
            String guestName,
            Long reservationId,
            String sellerUsername // 💡 추가된 파라미터
    ) {

        // 1. 컨텐츠 데이터 조회
        List<ReservationEntity> targetList = qf
                .selectFrom(qReservation)
                .join(qReservation.member, qMember).fetchJoin() // 예약 유저 페치조인
                .join(qReservation.stay, qStay)                // 숙소 조인 (판매자 추적용)
                .join(qStay.space, qSpace)                      // 공간 조인
                .join(qSpace.seller, qSeller)                  // 💡 공간의 판매자(MemberEntity) 조인 완료
                .where(
                        usernameEq(username),
                        guestNameContains(guestName),
                        reservationIdEq(reservationId),
                        sellerUsernameEq(sellerUsername) // 💡 상품 판매자 검색 조건 바인딩
                )
                .orderBy(qReservation.id.desc())
                .offset(pageRequest.getOffset())
                .limit(pageRequest.getPageSize())
                .fetch();

        // 2. 전체 카운트 쿼리 조회
        Long total = qf
                .select(qReservation.count())
                .from(qReservation)
                .join(qReservation.stay, qStay)
                .join(qStay.space, qSpace)
                .join(qSpace.seller, qSeller) // 판매자 검색 조건이 타야하므로 조인 유지
                .where(
                        usernameEq(username),
                        guestNameContains(guestName),
                        reservationIdEq(reservationId),
                        sellerUsernameEq(sellerUsername)
                )
                .fetchOne();

        long totalCount = (total != null) ? total : 0L;

        // 3. DTO 변환 및 반환
        List<ReservationAdminListResDto> adminDtoList = targetList.stream()
                .map(ReservationAdminListResDto::from)
                .toList();

        return new PageImpl<>(adminDtoList, pageRequest, totalCount);
    }

    // =========================================================================
    // 동적 검색 조건절 메서드
    // =========================================================================

    private BooleanExpression usernameEq(String username) {
        return StringUtils.hasText(username) ? qMember.username.eq(username) : null;
    }

    private BooleanExpression guestNameContains(String guestName) {
        return StringUtils.hasText(guestName) ? qReservation.primaryGuestName.contains(guestName) : null;
    }

    private BooleanExpression reservationIdEq(Long reservationId) {
        return reservationId != null ? qReservation.id.eq(reservationId) : null;
    }

    // 💡 [추가] 숙박 상품 등록 판매자(Seller) 아이디 일치 조건 검증
    private BooleanExpression sellerUsernameEq(String sellerUsername) {
        return StringUtils.hasText(sellerUsername) ? qSeller.username.eq(sellerUsername) : null;
    }




    // 2. 구현체 (ReservationRepositoryImpl.java)에 쿼리 구현
    @Override
    public Optional<ReservationEntity> findAdminOneById(Long id) {
        ReservationEntity result = qf
                .selectFrom(qReservation)
                .join(qReservation.member, qMember).fetchJoin() // 💡 유저 정보 미리 땡겨오기
                .join(qReservation.stay, qStay).fetchJoin()     // 💡 숙소 정보 미리 땡겨오기
                .where(qReservation.id.eq(id))
                .fetchOne();

        return Optional.ofNullable(result);
    }

    @Override
    public Page<ReservationAdminListResDto> findSellerReservationList(
            org.springframework.data.domain.Pageable pageable,
            String sellerUsername,
            Long reservationId,
            String guestName,
            java.time.LocalDate checkinDate,
            ReservationStatus status // 💡 파라미터 추가
    ) {

        // 1. 동적 필터가 적용된 컨텐츠 조회
        List<ReservationEntity> targetList = qf
                .selectFrom(qReservation)
                .join(qReservation.member, qMember).fetchJoin()
                .join(qReservation.stay, qStay).fetchJoin()
                .join(qStay.space, qSpace)
                .join(qSpace.seller, qSeller)
                .where(
                        qSeller.username.eq(sellerUsername),
                        qReservation.status.ne(ReservationStatus.PENDING),
                        reservationIdEq(reservationId),
                        guestNameContains(guestName),
                        checkinDateEq(checkinDate),
                        statusEq(status) // 💡 이제 에러가 사라집니다
                )
                .orderBy(qReservation.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 2. 동적 필터가 적용된 전체 카운트 조회
        Long total = qf
                .select(qReservation.count())
                .from(qReservation)
                .join(qReservation.stay, qStay)
                .join(qStay.space, qSpace)
                .join(qSpace.seller, qSeller)
                .where(
                        qSeller.username.eq(sellerUsername),
                        qReservation.status.ne(ReservationStatus.PENDING),
                        reservationIdEq(reservationId),
                        guestNameContains(guestName),
                        checkinDateEq(checkinDate),
                        statusEq(status) // 💡 카운트 쿼리에도 추가
                )
                .fetchOne();

        long totalCount = (total != null) ? total : 0L;

        List<ReservationAdminListResDto> dtoList = targetList.stream()
                .map(ReservationAdminListResDto::from)
                .toList();

        return new PageImpl<>(dtoList, pageable, totalCount);
    }

    // =========================================================================
// 💡 [추가] 체크인 날짜 매칭 Expression 메서드
// =========================================================================
    private BooleanExpression checkinDateEq(java.time.LocalDate checkinDate) {
        return checkinDate != null ? qReservation.checkinDate.eq(checkinDate) : null;
    }

    @Override
    public Optional<ReservationEntity> findSellerOneById(Long id) {
        ReservationEntity result = qf
                .selectFrom(qReservation)
                .join(qReservation.member, qMember).fetchJoin() // 예약한 유저 정보
                .join(qReservation.stay, qStay).fetchJoin()     // 숙소 정보
                .join(qStay.space, qSpace).fetchJoin()          // 공간 정보
                .join(qSpace.seller, qSeller).fetchJoin()       // 판매자 정보까지 한방에 긁어오기
                .where(qReservation.id.eq(id))
                .fetchOne();

        return Optional.ofNullable(result);
    }

    private BooleanExpression statusEq(ReservationStatus status) {
        return status != null ? qReservation.status.eq(status) : null;
    }
}