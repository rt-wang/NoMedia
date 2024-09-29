package com.example.postservice.service;

import com.example.postservice.dto.CreatePostRequest;
import com.example.postservice.dto.PostDto;
import com.example.postservice.entity.Post;
import com.example.postservice.repository.PostRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.common.security.UserDetailsInterface;

import java.time.LocalDateTime;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional
    public PostDto createPost(CreatePostRequest createPostRequest) {
        Post post = new Post();
        post.setContent(createPostRequest.getContent());
        post.setTitle(createPostRequest.getTitle());
        post.setPostFormat(createPostRequest.getPostFormat());
        post.setTopicId(createPostRequest.getTopicId());
        post.setUserId(getCurrentUserId());
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        Post savedPost = postRepository.save(post);
        return new PostDto(savedPost);
    }

    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(getCurrentUserId())) {
            throw new SecurityException("You are not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("User not authenticated");
        }
        if (!(authentication.getPrincipal() instanceof UserDetailsInterface)) {
            throw new SecurityException("Invalid user details");
        }
        return ((UserDetailsInterface) authentication.getPrincipal()).getId();
    }
}
