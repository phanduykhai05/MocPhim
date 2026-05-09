package mocphim.com.backend_web.security;

import lombok.Getter;
import mocphim.com.backend_web.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails, OidcUser {

    private final User user;
    private Map<String, Object> attributes;
    private OidcUser oidcUser;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public CustomUserDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    public CustomUserDetails(User user, OidcUser oidcUser) {
        this.user = user;
        this.oidcUser = oidcUser;
        this.attributes = oidcUser.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return user.isEnabled(); }

    @Override
    public Map<String, Object> getAttributes() { return attributes; }

    @Override
    public String getName() { return user.getEmail(); }

    @Override
    public Map<String, Object> getClaims() { return oidcUser != null ? oidcUser.getClaims() : attributes; }

    @Override
    public OidcUserInfo getUserInfo() { return oidcUser != null ? oidcUser.getUserInfo() : null; }

    @Override
    public OidcIdToken getIdToken() { return oidcUser != null ? oidcUser.getIdToken() : null; }
}
