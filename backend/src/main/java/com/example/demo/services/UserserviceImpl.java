package com.example.demo.services;

import com.example.demo.Repository.UserRepository;
import com.example.demo.Repository.VerificationTokenRepository;
import com.example.demo.dto.UserDto;
import com.example.demo.entities.User;
import com.example.demo.entities.VerificationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserserviceImpl implements  Userservice{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    private  PasswordEncoder passwordEncoder;

    public UserserviceImpl( ) {
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public User savedUser(User user) {
        if (user == null){
            throw new IllegalArgumentException(" user must not be null");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        VerificationToken verificationToken = new VerificationToken();

        verificationToken.setToken(UUID.randomUUID().toString());
        verificationToken.setUser(user);

        verificationTokenRepository.save(verificationToken);



        User saveduser = userRepository.save(user);
        return saveduser;
    }

    @Override
    public User updateUser(Long id, UserDto userDto) {

        User existingUser = userRepository.getById(id);
        if (userDto != null) {

            if (userDto.getFirstname() != null) {
                existingUser.setFirstname(userDto.getFirstname());
            }

            if (userDto.getLastname() != null) {
                existingUser.setLastname(userDto.getLastname());
            }

            if (userDto.getRole() != null) {
                existingUser.setRole(userDto.getRole());
            }

    }

        User updatedUser = userRepository.save(existingUser);



        return updatedUser;
    }

    @Override
    public void deleteUser(Long id) {
        try {
            User user = userRepository.getById(id);
            userRepository.delete(user);

        }catch (Exception e){
            throw new IllegalArgumentException("User not found");
        }

    }

    @Override
    public User getUser(Long id) {

        try{
            User user = userRepository.getById(id);
            return user;
        }catch (Exception e){
            throw new IllegalArgumentException("user not found");
        }

    }

    @Override
    public List<User> getAllUser() {

        List<User> users = userRepository.findAll();
        return users;
    }
}
