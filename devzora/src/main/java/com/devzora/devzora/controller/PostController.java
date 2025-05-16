package com.devzora.devzora.controller;

import com.devzora.devzora.model.Post;
import com.devzora.devzora.model.Users;
import com.devzora.devzora.service.PostService;
import com.devzora.devzora.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, Authentication authentication) {
        try {
            Post createdPost = postService.createPost(post, authentication);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post, Authentication authentication) {
        try {
            Post updatedPost = postService.updatePost(id, post, authentication);
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id, Authentication authentication) {
        try {
            postService.deletePost(id, authentication);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        try {
            List<Post> posts = postService.getAllPosts();
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        try {
            Post post = postService.getPostById(id);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<List<Post>> getMyPosts(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = userService.findByUsername(username);
            if (user == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            List<Post> posts = postService.getPostsByUserId(user.getId());
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable String id, Authentication authentication) {
        try {
            Post post = postService.likePost(id, authentication);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/unlike")
    public ResponseEntity<Post> unlikePost(@PathVariable String id, Authentication authentication) {
        try {
            Post post = postService.unlikePost(id, authentication);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}