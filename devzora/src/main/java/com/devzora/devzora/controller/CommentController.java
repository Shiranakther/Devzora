package com.devzora.devzora.controller;

import com.devzora.devzora.model.Comment;
import com.devzora.devzora.model.Users;
import com.devzora.devzora.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/comments/create")
    public ResponseEntity<Comment> createComment(@RequestBody CommentRequest commentRequest, Authentication authentication) {
        try {
            if (commentRequest.getPostId() == null || commentRequest.getContent() == null || commentRequest.getContent().trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            String username = authentication.getName();
            Comment comment = commentService.createComment(commentRequest.getPostId(), commentRequest.getContent(), username);
            return new ResponseEntity<>(comment, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/comments/view")
    public ResponseEntity<List<Comment>> getAllComments() {
        List<Comment> comments = commentService.getAllComments();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/comments/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/comments/user")
    public ResponseEntity<List<Comment>> getCommentsByUser(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = commentService.getUserService().findByUsername(username);
            if (user == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            List<Comment> comments = commentService.getCommentsByUserId(user.getId());
            return new ResponseEntity<>(comments, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/comments/update/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String commentId,
            @RequestBody UpdateCommentRequest updateRequest,
            Authentication authentication) {
        try {
            if (updateRequest.getContent() == null || updateRequest.getContent().trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            String username = authentication.getName();
            Comment updatedComment = commentService.updateComment(commentId, updateRequest.getContent(), username);
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/comments/delete/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String commentId, Authentication authentication) {
        try {
            String username = authentication.getName();
            commentService.deleteComment(commentId, username);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

class CommentRequest {
    private String postId;
    private String content;

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

class UpdateCommentRequest {
    private String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}