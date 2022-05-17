package com.commerce.backend.model.request.user;

import java.util.Set;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.commerce.backend.validator.CustomEmail;
import com.commerce.backend.validator.PasswordMatches;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@PasswordMatches
@Getter
@Setter
public class RegisterUserRequest {

    @NotBlank
    @Size(min = 3, max = 52)
    @CustomEmail
    private String email;

    @NotBlank
    @Size(min = 6, max = 52)
    private String password;

    @NotBlank
    @Size(min = 6, max = 52)
    private String passwordRepeat;
    
    private Set<String> role;
}
