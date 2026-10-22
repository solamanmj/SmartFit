package com.smartfit.repository;

import com.smartfit.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByClientEmailAndSpecialistEmailOrderByRawTimeAsc(String clientEmail, String specialistEmail);
    List<ChatMessage> findByConversationIdOrderByRawTimeAsc(String conversationId);
    long countByConversationIdAndSenderRoleNotAndIsReadFalse(String conversationId, String senderRole);
}
