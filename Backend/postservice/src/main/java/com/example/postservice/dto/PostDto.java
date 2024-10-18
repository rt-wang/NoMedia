package com.example.postservice.dto;

import com.example.postservice.entity.Post;
import java.time.LocalDateTime;

public class PostDto {
    private Integer postId;
    private String content;
    private String title;
    private Post.PostFormat postFormat;
    private Integer topicId;
    private LocalDateTime createdAt;
    private Integer likeCount;
    private String username;
    private String name;
    private Long userId;
    public PostDto() {}
    
    // Constructor
    public PostDto(Post post) {
        this.postId = post.getPostId();
        this.content = post.getContent();
        this.title = post.getTitle();
        this.postFormat = post.getPostFormat();
        this.topicId = post.getTopicId();
        this.createdAt = post.getCreatedAt();
        this.likeCount = post.getLikeCount();
        this.userId = post.getUserId();
    }

    // Getters and setters
    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Post.PostFormat getPostFormat() {
        return postFormat;
    }

    public void setPostFormat(Post.PostFormat postFormat) {
        this.postFormat = postFormat;
    }

    public Integer getTopicId() {
        return topicId;
    }

    public void setTopicId(Integer topicId) {
        this.topicId = topicId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
