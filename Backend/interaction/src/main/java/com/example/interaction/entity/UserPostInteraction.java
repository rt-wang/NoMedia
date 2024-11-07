package com.example.interaction.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "UserPostInteraction")
public class UserPostInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "post_id")
    private Long postId;

    @Enumerated(EnumType.STRING)
    @Column(name = "interaction_type")
    private InteractionType interactionType;

    @Column(name = "interaction_time")
    private LocalDateTime interactionTime;

    public enum InteractionType {
        VIEW, LIKE, COMMENT, REPOST, QUOTE, DISLIKE
    }

    public UserPostInteraction(Long userId, Long postId, InteractionType interactionType) {
        this.userId = userId;
        this.postId = postId;
        this.interactionType = interactionType;
        this.interactionTime = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getPostId() {
        return postId;
    }

    public InteractionType getInteractionType() {
        return interactionType;
    }

    public LocalDateTime getInteractionTime() {
        return interactionTime;
    }
}
