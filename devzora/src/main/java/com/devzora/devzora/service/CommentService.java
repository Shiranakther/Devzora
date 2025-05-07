package com.devzora.devzora.service;

import com.devzora.devzora.model.Comment;
import com.devzora.devzora.model.Post;
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

    public Comment createComment(String postId, String content) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty()) {
            throw new RuntimeException("Post not found");
        }

        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);

        Post post = postOptional.get();
        post.getComments().add(savedComment);
        postRepository.save(post);

        return savedComment;
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment updateComment(String commentId, String content) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();
            comment.setContent(content);
            return commentRepository.save(comment);
        }
        throw new RuntimeException("Comment not found");
    }

    public void deleteComment(String commentId) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();
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
}