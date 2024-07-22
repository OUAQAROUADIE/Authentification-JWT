package com.example.demo.services;

import com.example.demo.dto.UserDto;
import com.example.demo.entities.User;

import java.util.List;

public interface Userservice {

    User savedUser(User user);

    User updateUser(Long id, UserDto userDto);

    void deleteUser(Long id);

    User getUser(Long id);

    List<User> getAllUser();
}
