package net.micromart.auth.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import net.micromart.auth.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
	User findByEmail(String email);
}
