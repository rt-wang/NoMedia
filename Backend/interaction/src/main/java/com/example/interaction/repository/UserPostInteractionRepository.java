package com.example.interaction.repository;

import com.example.interaction.entity.UserPostInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPostInteractionRepository extends JpaRepository<UserPostInteraction, Long> {
    long countByPostIdAndInteractionType(Long postId, UserPostInteraction.InteractionType interactionType);
    void deleteByUserIdAndPostIdAndInteractionType(Long userId, Long postId, UserPostInteraction.InteractionType interactionType);
}
