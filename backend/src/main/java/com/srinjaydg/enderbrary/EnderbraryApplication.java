package com.srinjaydg.enderbrary;

import com.srinjaydg.enderbrary.user.models.Role;
import com.srinjaydg.enderbrary.user.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EnderbraryApplication {

	public static void main(String[] args) {
		SpringApplication.run(EnderbraryApplication.class, args);
	}
	@Bean
	public CommandLineRunner runner(RoleRepository roleRepository) {
		return args -> {
			if(roleRepository.findByName ("USER").isEmpty ()){
				roleRepository.save (
						Role.builder ()
								.name ("USER")
								.build ()
				);
			}
		};
	}

}
