package com.devzora.devzora.controller;

import com.devzora.devzora.model.Forum;
import com.devzora.devzora.service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forums")
public class ForumController {

    @Autowired
    private ForumService forumService;

    // Create a new forum
    @PostMapping
    public ResponseEntity<Forum> createForum(@RequestBody Forum forum) {
        Forum createdForum = forumService.createForum(forum);
        return ResponseEntity.ok(createdForum);
    }

    // Update an existing forum
    @PutMapping("/{id}")
    public ResponseEntity<Forum> updateForum(@PathVariable String id, @RequestBody Forum forumDetails) {
        Forum updatedForum = forumService.updateForum(id, forumDetails);
        return ResponseEntity.ok(updatedForum);
    }

    // View all forums
    @GetMapping
    public ResponseEntity<List<Forum>> getAllForums() {
        List<Forum> forums = forumService.getAllForums();
        return ResponseEntity.ok(forums);
    }

    // View forum by ID
    @GetMapping("/{id}")
    public ResponseEntity<Forum> getForumById(@PathVariable String id) {
        Forum forum = forumService.getForumById(id);
        return ResponseEntity.ok(forum);
    }

    // Delete a forum
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForum(@PathVariable String id) {
        forumService.deleteForum(id);
        return ResponseEntity.noContent().build();
    }
}
