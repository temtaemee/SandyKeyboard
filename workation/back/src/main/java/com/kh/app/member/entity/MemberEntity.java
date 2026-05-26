package com.kh.app.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "MEMBER")
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Setter
public class MemberEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100 , nullable = false , unique = true)
    private String username;

    @Column(length = 100 , nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = true)
    private LocalDateTime deletedAt;

    @Column(length = 1 , nullable = false)
    private String banYn;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(
            name = "MEMBER_ROLE",
            joinColumns = @JoinColumn(name = "MEMBER_NO")
    )
    @Column(name = "ROLE_NAME")
    @Builder.Default
    private Set<Role> roleSet = new HashSet<>();

    // 1. 판매자 정보 관리인은 SellerEntity의 'member' 변수야
    @OneToOne(mappedBy = "member")
    private SellerEntity seller;

    // 2. 프로필 정보 관리인은 MemberProfileEntity의 'member' 변수야
    @OneToOne(mappedBy = "member")
    private MemberProfileEntity profile;

//    // 3. 알림 목록 관리인은 AlarmEntity의 'member' 변수야 (1:N 관계)
//    @OneToMany(mappedBy = "member")
//    private List<AlarmEntity> alarms;


    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
        this.banYn = "N";
    }

    public void delete() {
        this.deletedAt = LocalDateTime.now();
    }

    public void ban() {
        this.banYn = "Y";
    }


    public void unban() {
        this.banYn = "N";
    }

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}

