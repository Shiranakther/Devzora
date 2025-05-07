package com.devzora.devzora.service;

import com.devzora.devzora.model.Forum;
import com.devzora.devzora.repo.ForumRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ForumService {

    @Autowired
    private ForumRepository forumRepository;

    // Create a new forum
    public Forum createForum(Forum forum) {
        forum.setCreatedAt(LocalDateTime.now());
        forum.setUpdatedAt(LocalDateTime.now());
        forum.setViewCount(0);
        forum.setReplyCount(0);
        return forumRepository.save(forum);
    }

    // Update an existing forum
    public Forum updateForum(String id, Forum forumDetails) {
        Optional<Forum> optionalForum = forumRepository.findById(id);
        if (optionalForum.isPresent()) {
            Forum forum = optionalForum.get();
            forum.setTitle(forumDetails.getTitle());
            forum.setDescription(forumDetails.getDescription());
            forum.setTags(forumDetails.getTags());
            forum.setUpdatedAt(LocalDateTime.now());
            return forumRepository.save(forum);
        } else {
            throw new RuntimeException("Forum not found with id: " + id);
        }
    }

    // View all forums
    public List<Forum> getAllForums() {
        return forumRepository.findAll();
    }

    // View forum by ID
    public Forum getForumById(String id) {
        Optional<Forum> optionalForum = forumRepository.findById(id);
        if (optionalForum.isPresent()) {
            Forum forum = optionalForum.get();
            forum.setViewCount(forum.getViewCount() + 1);
            return forumRepository.save(forum);
        } else {
            throw new RuntimeException("Forum not found with id: " + id);
        }
    }

    // Delete a forum
    public void deleteForum(String id) {
        if (forumRepository.existsById(id)) {
            forumRepository.deleteById(id);
        } else {
            throw new RuntimeException("Forum not found with id: " + id);
        }
    }
}
