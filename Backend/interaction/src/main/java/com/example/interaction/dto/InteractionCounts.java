package com.example.interaction.dto;

public class InteractionCounts {
    private long likeCount;
    private long commentCount;
    private long repostCount;
    private long quoteCount;

    // Constructor, getters, and setters
    public InteractionCounts(long likeCount, long commentCount, long repostCount, long quoteCount) {
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.repostCount = repostCount;
        this.quoteCount = quoteCount;
    }

    // Getters and setters
    public long getLikeCount() {
        return likeCount;
    }

    public long getCommentCount() {
        return commentCount;
    }

    public long getRepostCount() {
        return repostCount;
    }

    public long getQuoteCount() {
        return quoteCount;
    }
    
}
