package com.devzora.devzora.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devzora.devzora.model.HelpdeskTicket;
import com.devzora.devzora.repo.HelpdeskTicketRepository;

@Service
public class HelpdeskTicketService {
    @Autowired
    private HelpdeskTicketRepository ticketRepo;

    public HelpdeskTicket createTicket(HelpdeskTicket ticket) {
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setStatus("OPEN");
        return ticketRepo.save(ticket);
    }

    public List<HelpdeskTicket> getAllTickets() {
        return ticketRepo.findAll();
    }

    public Optional<HelpdeskTicket> getTicketById(String id) {
        return ticketRepo.findById(id);
    }

    public HelpdeskTicket updateTicket(String id, HelpdeskTicket updatedTicket) {
        Optional<HelpdeskTicket> existing = ticketRepo.findById(id);
        if (existing.isPresent()) {
            HelpdeskTicket ticket = existing.get();
            ticket.setDescription(updatedTicket.getDescription());
            ticket.setStatus(updatedTicket.getStatus());
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepo.save(ticket);
        } else {
            throw new RuntimeException("Ticket not found");
        }
    }

    public void deleteTicket(String id) {
        ticketRepo.deleteById(id);
    }
}

