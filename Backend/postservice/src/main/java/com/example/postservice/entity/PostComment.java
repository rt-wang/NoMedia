package com.example.postservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "PostComment")
public class PostComment {

    @Id
    @Column(name = "post_id")
    private Integer postId;

    @Column(name = "parent_post_id", nullable = false)
    private Integer parentPostId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "parent_post_id", insertable = false, updatable = false)
    private Post parentPost;

    @Column(name = "post_format", nullable = false)
    @Enumerated(EnumType.STRING)
    private Post.PostFormat postFormat;

    // Getters and setters

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public Integer getParentPostId() {
        return parentPostId;
    }

    public void setParentPostId(Integer parentPostId) {
        this.parentPostId = parentPostId;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Post getParentPost() {
        return parentPost;
    }

    public void setParentPost(Post parentPost) {
        this.parentPost = parentPost;
    }

    public Post.PostFormat getPostFormat() {
        return postFormat;
    }

    public void setPostFormat(Post.PostFormat postFormat) {
        this.postFormat = postFormat;
    }
}
