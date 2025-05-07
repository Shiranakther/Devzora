package com.devzora.devzora.service;

import com.devzora.devzora.model.Post;
import com.devzora.devzora.repo.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(String id, Post post) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post updatedPost = existingPost.get();
            updatedPost.setTitle(post.getTitle());
            updatedPost.setDescription(post.getDescription());
            updatedPost.setImageList(post.getImageList());
            updatedPost.setVideo(post.getVideo());
            updatedPost.setCourseLink(post.getCourseLink());
            return postRepository.save(updatedPost);
        }
        throw new RuntimeException("Post not found with id: " + id);
    }

    public void deletePost(String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
        } else {
            throw new RuntimeException("Post not found with id: " + id);
        }
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }
}
