package com.example.demo.config;

import com.example.demo.Repository.UserRepository;
import com.example.demo.entities.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

public class UserDetailsServiceImpl implements UserDetailsService {

    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOpt =     userRepository.findByMail(username);


        if(userOpt.isPresent()){

        }

        return null;
    }
}
