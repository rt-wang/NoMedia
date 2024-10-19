package com.example.postservice.repository;

import com.example.postservice.entity.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Integer> {
    
    List<PostComment> findByParentPostId(Integer parentPostId);
    
    // You can add more custom query methods here if needed
}
