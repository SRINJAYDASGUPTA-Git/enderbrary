package com.srinjaydg.enderbrary.user.models;

import com.srinjaydg.enderbrary.book.models.Book;
import com.srinjaydg.enderbrary.book.models.BorrowRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "users")
public class User implements UserDetails, Principal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;
    private String imageUrl;

    private Boolean accountLocked;
    private Boolean enabled;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Role> roles;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Book> postedBooks;

    @OneToMany(mappedBy = "borrower", cascade = CascadeType.ALL)
    private List<BorrowRequest> borrowedBooks;

    @OneToMany(mappedBy = "lender", cascade = CascadeType.ALL)
    private List<BorrowRequest> lentBooks;



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(r -> new SimpleGrantedAuthority (r.getName()))
                .toList ();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public boolean isAccountNonLocked() { return !accountLocked; }

    @Override
    public boolean isEnabled() { return enabled; }
}
