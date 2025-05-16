package com.devzora.devzora.service;

import com.devzora.devzora.model.Comment;
import com.devzora.devzora.model.Post;
import com.devzora.devzora.model.Users;
import com.devzora.devzora.repo.CommentRepository;
import com.devzora.devzora.repo.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    public Comment createComment(String postId, String content, String username) {
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }

        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty()) {
            throw new RuntimeException("Post not found");
        }

        Users user = userService.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Comment comment = Comment.builder()
                .postId(postId)
                .content(content)
                .userId(user.getId())
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        Post post = postOptional.get();
        post.getComments().add(savedComment);
        postRepository.save(post);

        return savedComment;
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public List<Comment> getCommentsByUserId(String userId) {
        return commentRepository.findByUserId(userId);
    }

    public Comment updateComment(String commentId, String content, String username) {
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }

        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();
            Users user = userService.findByUsername(username);
            if (user == null || !comment.getUserId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized or comment not found");
            }
            comment.setContent(content);
            return commentRepository.save(comment);
        }
        throw new RuntimeException("Comment not found");
    }

    public void deleteComment(String commentId, String username) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();
            Users user = userService.findByUsername(username);
            if (user == null || !comment.getUserId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized or comment not found");
            }
            Optional<Post> postOptional = postRepository.findById(comment.getPostId());
            if (postOptional.isPresent()) {
                Post post = postOptional.get();
                post.getComments().removeIf(c -> c.getId().equals(commentId));
                postRepository.save(post);
            }
            commentRepository.deleteById(commentId);
        } else {
            throw new RuntimeException("Comment not found");
        }
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public UserService getUserService() {
        return userService; // Return the autowired UserService instance
    }
}