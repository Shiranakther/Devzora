package com.devzora.devzora.service;

import com.devzora.devzora.model.Post;
import com.devzora.devzora.model.Users;
import com.devzora.devzora.repo.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    public Post createPost(Post post, Authentication authentication) {
        String username = authentication.getName();
        Users user = userService.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        post.setUserId(user.getId());
        return postRepository.save(post);
    }

    public Post updatePost(String id, Post post, Authentication authentication) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post updatedPost = existingPost.get();
            String username = authentication.getName();
            Users user = userService.findByUsername(username);
            if (!updatedPost.getUserId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to update this post");
            }
            updatedPost.setTitle(post.getTitle());
            updatedPost.setDescription(post.getDescription());
            updatedPost.setImageList(post.getImageList());
            updatedPost.setVideo(post.getVideo());
            updatedPost.setCourseLink(post.getCourseLink());
            return postRepository.save(updatedPost);
        }
        throw new RuntimeException("Post not found with id: " + id);
    }

    public void deletePost(String id, Authentication authentication) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            String username = authentication.getName();
            Users user = userService.findByUsername(username);
            if (!post.getUserId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to delete this post");
            }
            postRepository.deleteById(id);
        } else {
            throw new RuntimeException("Post not found with id: " + id);
        }
    }

    public Post likePost(String postId, Authentication authentication) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (!optionalPost.isPresent()) {
            throw new RuntimeException("Post not found with id: " + postId);
        }
        Post post = optionalPost.get();
        String username = authentication.getName();
        Users user = userService.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        String userId = user.getId();

        // Initialize likes list if null
        if (post.getLikes() == null) {
            post.setLikes(new ArrayList<>());
        }

        // Add like if user hasn't liked yet
        if (!post.getLikes().contains(userId)) {
            post.getLikes().add(userId);
        }
        return postRepository.save(post);
    }

    public Post unlikePost(String postId, Authentication authentication) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (!optionalPost.isPresent()) {
            throw new RuntimeException("Post not found with id: " + postId);
        }
        Post post = optionalPost.get();
        String username = authentication.getName();
        Users user = userService.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        String userId = user.getId();

        // Remove like if user has liked
        if (post.getLikes() != null && post.getLikes().contains(userId)) {
            post.getLikes().remove(userId);
        }
        return postRepository.save(post);
    }

    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    public UserService getUserService() {
        return userService;
    }
}