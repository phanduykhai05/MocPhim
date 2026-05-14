package mocphim.com.backend_web.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column
    private String password;

    @Column
    private String name;

    @Column
    private String avatar;

    @Column(nullable = false)
    private String provider = "local";

    @Column
    private String providerId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>(Set.of(Role.ROLE_USER));

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column
    private boolean enabled = true;

    @Column(name = "is_verified", nullable = false, columnDefinition = "boolean not null default false")
    private boolean isVerified = false;

    @Column(name = "verify_token")
    private String verifyToken;

    @Column(name = "verify_expires")
    private LocalDateTime verifyExpires;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_expires")
    private LocalDateTime resetExpires;
}
