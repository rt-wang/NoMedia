package com.example.interaction.controller;

import com.example.interaction.service.InteractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.interaction.dto.InteractionCounts;

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {

    @Autowired
    private InteractionService interactionService;

    @PostMapping("/like/{postId}")
    public ResponseEntity<Void> likePost(@PathVariable Long postId, @RequestParam Long userId) {
        interactionService.likePost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/like/{postId}")
    public ResponseEntity<Void> unlikePost(@PathVariable Long postId, @RequestParam Long userId) {
        interactionService.unlikePost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/comment/{postId}")
    public ResponseEntity<Void> commentOnPost(@PathVariable Long postId, @RequestParam Long userId) {
        interactionService.commentOnPost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/repost/{postId}")
    public ResponseEntity<Void> repostPost(@PathVariable Long postId, @RequestParam Long userId) {
        interactionService.repostPost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/quote/{postId}")
    public ResponseEntity<Void> quotePost(@PathVariable Long postId, @RequestParam Long userId) {
        interactionService.quotePost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/counts/{postId}")
    public ResponseEntity<InteractionCounts> getInteractionCounts(@PathVariable Long postId) {
        InteractionCounts counts = interactionService.getInteractionCounts(postId);
        return ResponseEntity.ok(counts);
    }
}
