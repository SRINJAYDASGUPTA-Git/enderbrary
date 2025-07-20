package com.srinjaydg.enderbrary.user.repositories;

import com.srinjaydg.enderbrary.user.models.User;
import io.micrometer.common.KeyValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
        SELECT u FROM User u WHERE SIZE(u.postedBooks) > 0
   """)
    List<User> findUsersWithAtLeastOneBook();
}
