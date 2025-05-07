package com.devzora.devzora.repo;

import com.devzora.devzora.model.Forum;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForumRepository extends MongoRepository<Forum, String> {
}
