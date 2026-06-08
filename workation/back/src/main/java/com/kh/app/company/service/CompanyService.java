package com.kh.app.company.service;

import com.kh.app.company.dto.req.CompanyCreateReqDto;
import com.kh.app.company.dto.resp.CompanyRespDto;
import com.kh.app.company.entity.CompanyEntity;
import com.kh.app.company.exception.CompanyException;
import com.kh.app.company.exception.ErrorCode;
import com.kh.app.company.repository.CompanyRepository;
import com.kh.app.notification.dto.request.NotificationCreateReqDto;
import com.kh.app.notification.entity.NotificationType;
import com.kh.app.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final NotificationService notificationService;

    // 사업자번호 형식: 10자리 숫자(0000000000) 또는 대시 포함(000-00-00000)
    private static final Pattern BUSINESS_NO_PATTERN = Pattern.compile("^(\\d{10}|\\d{3}-\\d{2}-\\d{5})$");

    // 기업 등록
    @Transactional
    public void create(CompanyCreateReqDto dto) {
        // 기업명 중복 확인
        if (companyRepository.existsByCompanyName(dto.getCompanyName())) {
            throw new CompanyException(ErrorCode.DUPLICATE_COMPANY);
        }
        // 사업자번호가 입력된 경우에만 형식 및 중복 검사
        if (dto.getBusinessNo() != null && !dto.getBusinessNo().isBlank()) {
            // 사업자번호 형식 검사
            if (!BUSINESS_NO_PATTERN.matcher(dto.getBusinessNo()).matches()) {
                throw new CompanyException(ErrorCode.INVALID_BUSINESS_NO);
            }
            // 사업자번호 중복 확인
            if (companyRepository.existsByBusinessNo(dto.getBusinessNo())) {
                throw new CompanyException(ErrorCode.DUPLICATE_BUSINESS_NO);
            }
        }
        CompanyEntity savedCompany = companyRepository.save(dto.toEntity());

        // 알림
        notificationService.createNotification(
                NotificationCreateReqDto.builder()
                        .memberId(1L) // 관리자에게 알림
                        .type(NotificationType.COMPANY_ENROLL)
                        .content(String.format("[%s] 파트너사 등록 신청이 완료되었습니다.", savedCompany.getCompanyName()))
                        .redirectUrl("/admin/reservations")
                        .referenceId(savedCompany.getId())
                        .build());
    }

    // 기업 정보 수정
    @Transactional
    public void update(Long id, CompanyCreateReqDto dto) {
        // 기업 존재 여부 확인
        CompanyEntity entity = companyRepository.findById(id)
                .orElseThrow(() -> new CompanyException(ErrorCode.COMPANY_NOT_FOUND));
        // 비활성(탈퇴) 기업은 수정 불가
        if ("Y".equals(entity.getDelYn())) {
            throw new CompanyException(ErrorCode.DELETED_COMPANY);
        }
        // 사업자번호가 입력된 경우에만 형식 및 중복 검사
        if (dto.getBusinessNo() != null && !dto.getBusinessNo().isBlank()) {
            // 사업자번호 형식 검사
            if (!BUSINESS_NO_PATTERN.matcher(dto.getBusinessNo()).matches()) {
                throw new CompanyException(ErrorCode.INVALID_BUSINESS_NO);
            }
            // 다른 기업과의 사업자번호 중복 확인 (자기 자신 제외)
            if (companyRepository.existsByBusinessNoAndIdNot(dto.getBusinessNo(), id)) {
                throw new CompanyException(ErrorCode.DUPLICATE_BUSINESS_NO);
            }
        }
        entity.update(dto);
    }

    // 기업 활성/비활성 토글
    @Transactional
    public void toggleStatus(Long id) {
        // 기업 존재 여부 확인
        CompanyEntity entity = companyRepository.findById(id)
                .orElseThrow(() -> new CompanyException(ErrorCode.COMPANY_NOT_FOUND));
        entity.toggleStatus();

        // 알림 생성
        String status = "N".equals(entity.getDelYn()) ? "활성화" : "비활성화";
        NotificationType type = "N".equals(entity.getDelYn()) ? NotificationType.COMPANY_ACTIVE : NotificationType.COMPANY_DEACTIVATE;

        notificationService.createNotification(
                NotificationCreateReqDto.builder()
                        .memberId(1L) // 관리자에게 알림 (임시)
                        .type(type)
                        .content(String.format("[%s] 파트너사 상태가 %s 되었습니다.", entity.getCompanyName(), status))
                        .redirectUrl("/admin/reservations")
                        .referenceId(entity.getId())
                        .build());
    }

    // 기업 목록 조회 (페이징)
    public Page<CompanyRespDto> listAll(int pno) {
        Pageable pageable = PageRequest.of(pno, 10);
        return companyRepository.getList(pageable).map(CompanyRespDto::from);
    }
}
