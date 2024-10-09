package com.example.postservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

@Entity
@Table(name = "PostRepost")
public class PostRepost {
    @Id
    @Column(name = "post_id")
    private Integer postId;

    @Column(name = "original_post_id")
    private Integer originalPostId;

    @Enumerated(EnumType.STRING)
    @Column(name = "post_format")
    private Post.PostFormat postFormat;

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }
    
    public Integer getOriginalPostId() {
        return originalPostId;
    }

    public void setOriginalPostId(Integer originalPostId) {
        this.originalPostId = originalPostId;
    }
    
    public Post.PostFormat getPostFormat() {
        return postFormat;
    }

    public void setPostFormat(Post.PostFormat postFormat) {
        this.postFormat = postFormat;
    }
    
}
