package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "chatMessages")
public class ChatMessage {

    @Id
    private String id;

    @Indexed
    private String conversationId;

    @Indexed
    private String clientEmail;

    @Indexed
    private String specialistEmail;
    private String specialistRole = "NUTRITIONIST";

    private String senderEmail;
    private String senderName;
    private String senderRole; // USER, NUTRITIONIST, TRAINER, ADMIN

    private String recipientEmail;
    private String recipientName;
    private String recipientRole;

    private String text;
    private boolean isRead = false;
    private String deliveryStatus = "DELIVERED";
    private String timestamp;
    private long rawTime;
    private String clientMutationId;
    private String createdAt;

    public ChatMessage() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getSpecialistEmail() { return specialistEmail; }
    public void setSpecialistEmail(String specialistEmail) { this.specialistEmail = specialistEmail; }

    public String getSpecialistRole() { return specialistRole; }
    public void setSpecialistRole(String specialistRole) { this.specialistRole = specialistRole; }

    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientRole() { return recipientRole; }
    public void setRecipientRole(String recipientRole) { this.recipientRole = recipientRole; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public long getRawTime() { return rawTime; }
    public void setRawTime(long rawTime) { this.rawTime = rawTime; }

    public String getClientMutationId() { return clientMutationId; }
    public void setClientMutationId(String clientMutationId) { this.clientMutationId = clientMutationId; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
