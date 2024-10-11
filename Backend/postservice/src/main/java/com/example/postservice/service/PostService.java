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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.example.postservice.repository.PostRepostRepository;
import com.example.postservice.entity.PostRepost;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.postservice.dto.CurrentUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final PostRepostRepository postRepostRepository;
    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    public PostService(PostRepository postRepository, PostRepostRepository postRepostRepository) {
        this.postRepository = postRepository;
        this.postRepostRepository = postRepostRepository;
    }

    public CurrentUserDetails getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.debug("Current authentication: {}", authentication);
        if (authentication != null && authentication.isAuthenticated()) {
            String userId = authentication.getName();
            log.info("Authenticated user ID: {}", userId);
            return new CurrentUserDetails(Long.parseLong(userId), null, null);
        }
        log.warn("User not authenticated");
        throw new SecurityException("User not authenticated");
    }

    @Transactional
    public PostDto createPost(CreatePostRequest createPostRequest) {
        CurrentUserDetails userDetails = getCurrentUserDetails();
        Post post = new Post();
        post.setUserId(createPostRequest.getUserId());
        post.setContent(createPostRequest.getContent());
        post.setTitle(createPostRequest.getTitle());
        post.setPostFormat(createPostRequest.getPostFormat() != null ? createPostRequest.getPostFormat() : Post.PostFormat.Original);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post.setUsername(createPostRequest.getUsername());
        post.setName(createPostRequest.getName());

        Post savedPost = postRepository.save(post);

        if (Post.PostFormat.Repost.equals(createPostRequest.getPostFormat())) {
            PostRepost postRepost = new PostRepost();
            postRepost.setPostId(savedPost.getPostId());
            postRepost.setOriginalPostId(createPostRequest.getOriginalPostId());
            postRepost.setPostFormat(createPostRequest.getPostFormat());
            postRepostRepository.save(postRepost);
        }
        return convertToDto(savedPost);
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

    @Transactional(readOnly = true)
    public List<PostDto> getLatestPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Post> posts = postRepository.findLatestPosts(pageable);
        return posts.stream()
                .map(PostDto::new)
                .collect(Collectors.toList());
    }

    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto(post);
        // ... existing field mappings ...
        dto.setUsername(post.getUsername());
        dto.setName(post.getName());
        return dto;
    }
}
