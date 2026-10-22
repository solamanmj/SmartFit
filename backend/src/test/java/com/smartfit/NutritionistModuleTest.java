package com.smartfit;

import com.smartfit.model.MealPlan;
import com.smartfit.model.ChatMessage;
import com.smartfit.model.User;
import com.smartfit.repository.ChatMessageRepository;
import com.smartfit.repository.MealPlanRepository;
import com.smartfit.repository.MealScheduleRepository;
import com.smartfit.repository.UserRepository;
import com.smartfit.service.NutritionistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NutritionistModuleTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private MealPlanRepository mealPlanRepository;

    @Mock
    private MealScheduleRepository mealScheduleRepository;

    @Mock
    private ChatMessageRepository chatMessageRepository;

    private NutritionistService nutritionistService;

    private User clientAby;
    private User clientAlex;

    @BeforeEach
    void setUp() {
        nutritionistService = new NutritionistService(
                userRepository,
                mealPlanRepository,
                mealScheduleRepository,
                chatMessageRepository
        );

        // Client Aby is assigned to Sruthy
        clientAby = new User();
        clientAby.setEmail("aby@example.com");
        clientAby.setFullName("Aby Thomas");
        clientAby.setRole("USER");
        clientAby.setWeight(74);
        clientAby.setHeight(177);
        clientAby.setAge(27);
        clientAby.setDietaryPreference("Standard Balanced");
        clientAby.setAllergies(List.of("Peanuts", "Shellfish"));
        clientAby.setAssignedNutritionist(Map.of("email", "sruthy@example.com", "name", "Sruthy Varghese"));

        // Client Alex is assigned to Elena
        clientAlex = new User();
        clientAlex.setEmail("alex@example.com");
        clientAlex.setFullName("Alex Morgan");
        clientAlex.setRole("USER");
        clientAlex.setWeight(75);
        clientAlex.setHeight(178);
        clientAlex.setAge(26);
        clientAlex.setDietaryPreference("Standard Balanced");
        clientAlex.setAssignedNutritionist(Map.of("email", "elena@example.com", "name", "Dr. Elena Rostova"));
    }

    @Test
    void testAssignedClientsIsolation_OnlyAssignedReturned() {
        when(userRepository.findAll()).thenReturn(List.of(clientAby, clientAlex));

        // Sruthy should ONLY see Aby
        List<User> sruthyClients = nutritionistService.getAssignedClients("sruthy@example.com");
        assertEquals(1, sruthyClients.size());
        assertEquals("aby@example.com", sruthyClients.get(0).getEmail());

        // Elena should ONLY see Alex
        List<User> elenaClients = nutritionistService.getAssignedClients("elena@example.com");
        assertEquals(1, elenaClients.size());
        assertEquals("alex@example.com", elenaClients.get(0).getEmail());

        // Unassigned or unknown nutritionist should see 0 clients
        List<User> unknownClients = nutritionistService.getAssignedClients("other@example.com");
        assertEquals(0, unknownClients.size());
    }

    @Test
    void testClientAccessControl_UnassignedNutritionistDenied() {
        when(userRepository.findByEmail("aby@example.com")).thenReturn(Optional.of(clientAby));

        // Sruthy is assigned -> authorized
        assertTrue(nutritionistService.isClientAssignedToNutritionist("aby@example.com", "sruthy@example.com"));

        // Elena is NOT assigned to Aby -> denied
        assertFalse(nutritionistService.isClientAssignedToNutritionist("aby@example.com", "elena@example.com"));
    }

    @Test
    void testClinicalAssessment_MifflinStJeorCalculation() {
        when(userRepository.findByEmail("aby@example.com")).thenReturn(Optional.of(clientAby));
        when(mealPlanRepository.findFirstByUserEmailOrderByUpdatedAtDesc("aby@example.com")).thenReturn(Optional.empty());

        Map<String, Object> result = nutritionistService.getClientClinicalAssessment("aby@example.com");
        assertNotNull(result);
        assertTrue(result.containsKey("clinicalAssessment"));

        @SuppressWarnings("unchecked")
        Map<String, Object> clinical = (Map<String, Object>) result.get("clinicalAssessment");
        assertNotNull(clinical.get("bmr"));
        assertNotNull(clinical.get("tdee"));
        assertTrue((int) clinical.get("bmr") > 1500);

        @SuppressWarnings("unchecked")
        Map<String, Object> dietary = (Map<String, Object>) clinical.get("dietaryCategories");
        assertNotNull(dietary);
        assertEquals(List.of("Peanuts", "Shellfish"), dietary.get("confirmedAllergies"));
    }

    @Test
    void testSaveMealPlan_SafetyViolationBlocked() {
        when(userRepository.findByEmail("aby@example.com")).thenReturn(Optional.of(clientAby));

        MealPlan planWithPeanuts = new MealPlan();
        planWithPeanuts.setUserEmail("aby@example.com");
        planWithPeanuts.setPlanTitle("Peanut Butter Smoothie Plan");
        planWithPeanuts.setMeals(List.of(Map.of("title", "Crunchy Peanuts Power Toast")));

        assertThrows(IllegalArgumentException.class, () -> {
            nutritionistService.saveMealPlan(planWithPeanuts, "sruthy@example.com");
        });
    }

    @Test
    void testSaveMealPlan_UnassignedNutritionistBlocked() {
        when(userRepository.findByEmail("aby@example.com")).thenReturn(Optional.of(clientAby));

        MealPlan plan = new MealPlan();
        plan.setUserEmail("aby@example.com");
        plan.setPlanTitle("Safe Clean Quinoa Bowl");
        plan.setMeals(List.of(Map.of("title", "Steamed Quinoa Bowl")));

        // Elena tries to save plan for Aby
        assertThrows(SecurityException.class, () -> {
            nutritionistService.saveMealPlan(plan, "elena@example.com");
        });
    }

    @Test
    void testSendChatMessage_PersistentMessageStored() {
        ChatMessage msg = new ChatMessage();
        msg.setClientEmail("aby@example.com");
        msg.setSpecialistEmail("sruthy@example.com");
        msg.setSenderEmail("sruthy@example.com");
        msg.setSenderRole("NUTRITIONIST");
        msg.setText("Your daily protein adherence is solid!");

        when(chatMessageRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ChatMessage saved = nutritionistService.sendChatMessage(msg);
        assertNotNull(saved);
        assertEquals("aby@example.com_sruthy@example.com", saved.getConversationId());
        assertTrue(saved.getRawTime() > 0);
        assertNotNull(saved.getCreatedAt());
    }
}
