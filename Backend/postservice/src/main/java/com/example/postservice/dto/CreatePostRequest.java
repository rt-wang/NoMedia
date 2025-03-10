package com.example.postservice.dto;

import com.example.postservice.entity.Post;


public class CreatePostRequest {
    private Long userId;
    private Post.PostFormat postFormat;
    private Integer originalPostId;
    private String name;
    private String username;
    private String content;
    private String title;
    private Integer topicId;
    private Integer parentPostId;
    
    // Constructors
    public CreatePostRequest(String content, String title, Post.PostFormat postFormat, Integer topicId, Long userId, String username, String name, Integer originalPostId, Integer parentPostId) {
        this.content = content;
        this.title = title;
        this.postFormat = postFormat;
        this.topicId = topicId;
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.originalPostId = originalPostId;
        this.parentPostId = parentPostId;
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

    public Integer getParentPostId() {
        return parentPostId;
    }

    public void setParentPostId(Integer parentPostId) {
        this.parentPostId = parentPostId;
    }
}
