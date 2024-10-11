package com.example.postservice.repository;

import com.example.postservice.entity.PostRepost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepostRepository extends JpaRepository<PostRepost, Integer> {
}
