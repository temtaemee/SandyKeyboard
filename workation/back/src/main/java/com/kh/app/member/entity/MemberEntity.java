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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
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


}

