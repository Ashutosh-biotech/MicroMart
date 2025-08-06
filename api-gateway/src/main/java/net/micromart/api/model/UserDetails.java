package net.micromart.api.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetails {
    private String id;
    private String username;
    private String email;
    private List<String> permissions;
    private boolean active;
}