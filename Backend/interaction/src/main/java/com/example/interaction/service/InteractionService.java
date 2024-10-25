package com.example.interaction.service;

import com.example.interaction.repository.UserPostInteractionRepository;
import com.example.interaction.entity.UserPostInteraction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.RedisTemplate;
import java.util.concurrent.TimeUnit;
import org.springframework.scheduling.annotation.Scheduled;
import java.util.Set;
import com.example.interaction.dto.InteractionCounts;

@Service
public class InteractionService {

    @Autowired
    private UserPostInteractionRepository userPostInteractionRepository;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Transactional
    public void likePost(Long postId, Long userId) {
        UserPostInteraction interaction = new UserPostInteraction(userId, postId, UserPostInteraction.InteractionType.LIKE);
        userPostInteractionRepository.save(interaction);
        
        // Update Redis cache
        String redisKey = "post:" + postId + ":interactions";
        redisTemplate.opsForHash().increment(redisKey, "likes", 1);
    }

    @Transactional
    public void unlikePost(Long postId, Long userId) {
        userPostInteractionRepository.deleteByUserIdAndPostIdAndInteractionType(userId, postId, UserPostInteraction.InteractionType.LIKE);

        // Update Redis cache
        String redisKey = "post:" + postId + ":interactions";
        redisTemplate.opsForHash().increment(redisKey, "likes", -1);
    }

    @Transactional
    public void commentOnPost(Long postId, Long userId) {
        UserPostInteraction interaction = new UserPostInteraction(userId, postId, UserPostInteraction.InteractionType.COMMENT);
        userPostInteractionRepository.save(interaction);

        // Update Redis cache
        String redisKey = "post:" + postId + ":interactions";
        redisTemplate.opsForHash().increment(redisKey, "comments", 1);
    }

    @Transactional
    public void repostPost(Long postId, Long userId) {
        UserPostInteraction interaction = new UserPostInteraction(userId, postId, UserPostInteraction.InteractionType.REPOST);
        userPostInteractionRepository.save(interaction);

        // Update Redis cache
        String redisKey = "post:" + postId + ":interactions";
        redisTemplate.opsForHash().increment(redisKey, "reposts", 1);
    }

    @Transactional
    public void quotePost(Long postId, Long userId) {
        UserPostInteraction interaction = new UserPostInteraction(userId, postId, UserPostInteraction.InteractionType.QUOTE);
        userPostInteractionRepository.save(interaction);

        // Update Redis cache
        String redisKey = "post:" + postId + ":interactions";
        redisTemplate.opsForHash().increment(redisKey, "quotes", 1);
    }

    public InteractionCounts getInteractionCounts(Long postId) {
        String redisKey = "post:" + postId + ":interactions";
        
        // Try to get counts from Redis
        String cachedCounts = redisTemplate.opsForValue().get(redisKey);
        if (cachedCounts != null) {
            String[] counts = cachedCounts.split(",");
            return new InteractionCounts(
                Long.parseLong(counts[0]),
                Long.parseLong(counts[1]),
                Long.parseLong(counts[2]),
                Long.parseLong(counts[3])
            );
        }
        
        // If not in Redis, get from database
        long likeCount = userPostInteractionRepository.countByPostIdAndInteractionType(postId, UserPostInteraction.InteractionType.LIKE);
        long commentCount = userPostInteractionRepository.countByPostIdAndInteractionType(postId, UserPostInteraction.InteractionType.COMMENT);
        long repostCount = userPostInteractionRepository.countByPostIdAndInteractionType(postId, UserPostInteraction.InteractionType.REPOST);
        long quoteCount = userPostInteractionRepository.countByPostIdAndInteractionType(postId, UserPostInteraction.InteractionType.QUOTE);
        
        // Cache the results in Redis
        String countsString = likeCount + "," + commentCount + "," + repostCount + "," + quoteCount;
        redisTemplate.opsForValue().set(redisKey, countsString, 1, TimeUnit.HOURS); // Cache for 1 hour
        
        return new InteractionCounts(likeCount, commentCount, repostCount, quoteCount);
    }

    @Scheduled(fixedRate = 3600000) // Run every hour
    public void syncRedisWithDatabase() {
        Set<String> keys = redisTemplate.keys("post:*:interactions");
        for (String key : keys) {
            String postId = key.split(":")[1];
            InteractionCounts counts = getInteractionCounts(Long.parseLong(postId));
            String countsString = counts.getLikeCount() + "," + counts.getCommentCount() + "," + counts.getRepostCount() + "," + counts.getQuoteCount();
            redisTemplate.opsForValue().set(key, countsString, 1, TimeUnit.HOURS);
        }
    }
}
