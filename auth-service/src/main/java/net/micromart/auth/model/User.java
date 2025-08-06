package net.micromart.auth.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

	@Id
	private String id;

	private String firstName;
	private String lastName;

	@Indexed(unique = true)
	private String email;

	private String password;
	
	@Builder.Default
	private boolean emailVerified = false;
	
	@Builder.Default
	private List<String> wishlist = new ArrayList<>();
}