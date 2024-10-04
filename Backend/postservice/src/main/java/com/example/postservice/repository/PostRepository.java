package com.example.postservice.repository;

import com.example.postservice.entity.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long userId);
    List<Post> findByTitle(String title);
    List<Post> findByPostId(Integer postId);
    @Query("SELECT p FROM Post p ORDER BY p.createdAt DESC")
    List<Post> findLatestPosts(Pageable pageable);
}
