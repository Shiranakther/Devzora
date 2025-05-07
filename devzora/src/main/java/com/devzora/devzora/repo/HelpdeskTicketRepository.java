package com.devzora.devzora.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.devzora.devzora.model.HelpdeskTicket;

public interface HelpdeskTicketRepository extends MongoRepository<HelpdeskTicket, String> {
    List<HelpdeskTicket> findByStatus(String status);
}


