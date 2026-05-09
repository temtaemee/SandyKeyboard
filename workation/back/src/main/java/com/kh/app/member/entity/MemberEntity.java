package com.kh.app.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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

    @OneToMany(mappedBy = "member")
    private List<RoleEntity> roleList;


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

