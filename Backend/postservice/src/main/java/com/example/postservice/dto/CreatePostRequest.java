package com.example.postservice.dto;

import com.example.postservice.entity.Post;


public class CreatePostRequest {
    private String content;
    private String title;
    private Post.PostFormat postFormat;
    private Integer topicId;
    private Long userId;
    private String username;
    private String name;
    private Integer originalPostId;
    // Constructors
    public CreatePostRequest(String content, String title, Post.PostFormat postFormat, Integer topicId, Long userId, String username, String name, Integer originalPostId) {
        this.content = content;
        this.title = title;
        this.postFormat = postFormat;
        this.topicId = topicId;
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.originalPostId = originalPostId;
    }

    // Getters and setters
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public Integer getOriginalPostId() {
        return originalPostId;
    }

    public void setOriginalPostId(Integer originalPostId) {
        this.originalPostId = originalPostId;
    }
}
