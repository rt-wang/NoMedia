package com.example.postservice.dto;

import com.example.postservice.entity.Post;

public class CreatePostRequest {
    private String content;
    private String title;
    private Post.PostFormat postFormat;
    private Integer topicId;
    private Long userId;

    // Constructors
    public CreatePostRequest(String content, String title, Post.PostFormat postFormat, Integer topicId, Long userId) {
        this.content = content;
        this.title = title;
        this.postFormat = postFormat;
        this.topicId = topicId;
        this.userId = userId;
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
}
