package com.example.postservice.controller;

import com.example.postservice.dto.CreatePostRequest;
import com.example.postservice.dto.PostDto;
import com.example.postservice.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private static final Logger log = LoggerFactory.getLogger(PostController.class);

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody CreatePostRequest createPostRequest) {
        log.info("Received request to create post: {}", createPostRequest);
        PostDto createdPost = postService.createPost(createPostRequest);
        log.info("Created post: {}", createdPost);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @DeleteMapping("/{postId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long postId) {
        PostDto post = postService.getPost(postId);
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDto>> getPostsByUser(@PathVariable Long userId) {
        log.info("Received request to get posts for user: {}", userId);
        List<PostDto> posts = postService.getPostsByUser(userId);
        log.info("Returning {} posts for user: {}", posts.size(), userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<PostDto>> getLatestPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Received request to get latest posts. Page: {}, Size: {}", page, size);
        List<PostDto> posts = postService.getLatestPosts(page, size);
        log.info("Returning {} latest posts", posts.size());
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @PostMapping("/comment/{parentPostId}")
    public ResponseEntity<PostDto> createComment(@PathVariable Long parentPostId, @RequestBody CreatePostRequest createCommentRequest){
        createCommentRequest.setParentPostId(parentPostId.intValue());
        PostDto createdComment = postService.createPost(createCommentRequest);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @GetMapping("/comment/{parentPostId}")
    public ResponseEntity<List<PostDto>> getComments(@PathVariable Long parentPostId) {
        List<PostDto> comments = postService.getComments(parentPostId.intValue());
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}
