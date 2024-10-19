package com.example.postservice.entity;

import java.io.Serializable;
import java.util.Objects;

public class PostCommentId implements Serializable {
    private Integer postId;
    private Integer parentPostId;

    public PostCommentId() {}

    public PostCommentId(Integer postId, Integer parentPostId) {
        this.postId = postId;
        this.parentPostId = parentPostId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PostCommentId that = (PostCommentId) o;
        return Objects.equals(postId, that.postId) &&
               Objects.equals(parentPostId, that.parentPostId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(postId, parentPostId);
    }
}
