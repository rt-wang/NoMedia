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
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PostService {

    private final PostRepository postRepository;
    private static final Logger log = LoggerFactory.getLogger(PostService.class);
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional
    public PostDto createPost(CreatePostRequest createPostRequest) {
        Post post = new Post();
        post.setContent(createPostRequest.getContent());
        post.setTitle(createPostRequest.getTitle());
        post.setPostFormat(createPostRequest.getPostFormat() != null ? createPostRequest.getPostFormat() : Post.PostFormat.Original);
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

    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.debug("Current authentication: {}", authentication);
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetailsInterface) {
                Long userId = ((UserDetailsInterface) principal).getId();
                log.info("Authenticated user ID: {}", userId);
                return userId;
            } else if (principal instanceof String) {
                Long userId = Long.parseLong((String) principal);
                log.info("Authenticated user ID: {}", userId);
                return userId;
            }
        }
        log.warn("User not authenticated");
        throw new SecurityException("User not authenticated");
    }

    @Transactional
    public PostDto getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return new PostDto(post);
    }

    @Transactional(readOnly = true)
    public List<PostDto> getPostsByUser(Long userId) {

        List<Post> posts = postRepository.findByUserId(userId);
        
        if (posts.isEmpty()) {
            // Log this information
            log.info("No posts found for user with id: {}", userId);
        }

        return posts.stream()
                .map(PostDto::new)
                .collect(Collectors.toList());
    }
}
