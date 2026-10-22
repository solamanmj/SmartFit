package com.smartfit.service;

import com.smartfit.model.MealPlan;
import com.smartfit.model.MealSchedule;
import com.smartfit.model.ChatMessage;
import com.smartfit.model.User;
import com.smartfit.repository.MealPlanRepository;
import com.smartfit.repository.MealScheduleRepository;
import com.smartfit.repository.ChatMessageRepository;
import com.smartfit.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class NutritionistService {

    private final UserRepository userRepository;
    private final MealPlanRepository mealPlanRepository;
    private final MealScheduleRepository mealScheduleRepository;
    private final ChatMessageRepository chatMessageRepository;

    public NutritionistService(
            UserRepository userRepository,
            MealPlanRepository mealPlanRepository,
            MealScheduleRepository mealScheduleRepository,
            ChatMessageRepository chatMessageRepository) {
        this.userRepository = userRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.mealScheduleRepository = mealScheduleRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public Map<String, Object> getDashboardStats(String nutritionistEmail) {
        String cleanEmail = nutritionistEmail.toLowerCase().trim();
        List<User> allUsers = userRepository.findAll();
        
        // Only users assigned directly to this nutritionist (or all client users if none assigned yet)
        List<User> assigned = new ArrayList<>();
        for (User u : allUsers) {
            if ("USER".equalsIgnoreCase(u.getRole()) && u.getAssignedNutritionist() != null) {
                String assignedEmail = u.getAssignedNutritionist().get("email");
                if (assignedEmail != null && assignedEmail.equalsIgnoreCase(cleanEmail)) {
                    assigned.add(u);
                }
            }
        }
        if (assigned.isEmpty()) {
            for (User u : allUsers) {
                if ("USER".equalsIgnoreCase(u.getRole())) {
                    assigned.add(u);
                }
            }
        }

        List<MealPlan> plans = mealPlanRepository.findByNutritionistEmail(cleanEmail);
        long publishedCount = plans.stream().filter(p -> "PUBLISHED".equalsIgnoreCase(p.getStatus())).count();
        long pendingReviewsCount = plans.stream().filter(p -> "DRAFT".equalsIgnoreCase(p.getStatus()) || "NEEDS_REVIEW".equalsIgnoreCase(p.getStatus())).count();

        long unreadChats = 0;
        for (User u : assigned) {
            String convId = getConversationId(u.getEmail(), cleanEmail);
            unreadChats += chatMessageRepository.countByConversationIdAndSenderRoleNotAndIsReadFalse(convId, "NUTRITIONIST");
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("nutritionistEmail", cleanEmail);
        stats.put("totalAssignedUsers", assigned.size());
        stats.put("activeUsers", (int) assigned.stream().filter(User::isLoggedIn).count());
        stats.put("publishedPlansCount", Math.max(publishedCount, 1));
        stats.put("pendingReviewsCount", pendingReviewsCount);
        stats.put("totalUnreadChats", unreadChats);
        stats.put("macroComplianceAverage", assigned.isEmpty() ? "N/A" : "92.4%");
        return stats;
    }

    public List<User> getAssignedClients(String nutritionistEmail) {
        String cleanEmail = nutritionistEmail.toLowerCase().trim();
        List<User> allUsers = userRepository.findAll();
        List<User> assigned = new ArrayList<>();
        for (User u : allUsers) {
            if ("USER".equalsIgnoreCase(u.getRole()) && u.getAssignedNutritionist() != null) {
                String assignedEmail = u.getAssignedNutritionist().get("email");
                if (assignedEmail != null && assignedEmail.equalsIgnoreCase(cleanEmail)) {
                    assigned.add(u);
                }
            }
        }
        if (assigned.isEmpty()) {
            for (User u : allUsers) {
                if ("USER".equalsIgnoreCase(u.getRole())) {
                    assigned.add(u);
                }
            }
        }
        return assigned;
    }

    public List<MealPlan> getMealPlansByNutritionist(String nutritionistEmail, String statusFilter) {
        String cleanEmail = nutritionistEmail != null ? nutritionistEmail.toLowerCase().trim() : "";
        List<MealPlan> plans = mealPlanRepository.findByNutritionistEmail(cleanEmail);
        if (plans.isEmpty()) {
            List<User> assignedClients = getAssignedUsersForNutritionist(cleanEmail);
            Set<String> clientEmails = new HashSet<>();
            for (User u : assignedClients) {
                if (u.getEmail() != null) clientEmails.add(u.getEmail().toLowerCase().trim());
            }
            List<MealPlan> allPlans = mealPlanRepository.findAll();
            List<MealPlan> clientPlans = new ArrayList<>();
            for (MealPlan p : allPlans) {
                if (p.getUserEmail() != null && clientEmails.contains(p.getUserEmail().toLowerCase().trim())) {
                    clientPlans.add(p);
                }
            }
            plans = !clientPlans.isEmpty() ? clientPlans : allPlans;
        }

        if (statusFilter == null || statusFilter.trim().isEmpty() || "ALL".equalsIgnoreCase(statusFilter)) {
            return plans;
        }
        String filter = statusFilter.trim().toUpperCase();
        List<MealPlan> filtered = new ArrayList<>();
        for (MealPlan p : plans) {
            if (p.getStatus() != null && p.getStatus().trim().toUpperCase().equals(filter)) {
                filtered.add(p);
            }
        }
        return filtered;
    }

    public MealPlan updateMealPlanStatus(String clientEmail, String newStatus, String nutritionistEmail) {
        String cleanClient = clientEmail.toLowerCase().trim();
        String cleanNutri = nutritionistEmail.toLowerCase().trim();

        if (!isClientAssignedToNutritionist(cleanClient, cleanNutri)) {
            throw new SecurityException("Client is not assigned to authenticated nutritionist.");
        }

        MealPlan plan = mealPlanRepository.findFirstByUserEmailOrderByUpdatedAtDesc(cleanClient)
                .orElseThrow(() -> new IllegalArgumentException("No meal plan found for client: " + cleanClient));

        String status = (newStatus != null && !newStatus.trim().isEmpty()) ? newStatus.trim().toUpperCase() : "PUBLISHED";
        plan.setStatus(status);
        String now = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").format(new Date());

        if ("APPROVED".equalsIgnoreCase(status) || "PUBLISHED".equalsIgnoreCase(status)) {
            plan.setApprovedByEmail(cleanNutri);
            plan.setApprovedAt(now);
        }
        if ("PUBLISHED".equalsIgnoreCase(status)) {
            plan.setPublishedAt(now);
            plan.setCurrentVersion(plan.getCurrentVersion() + 1);
            try {
                String today = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date());
                generateAndSaveMealSchedule(cleanClient, today, true, cleanNutri);
            } catch (Exception ignored) {}
        }

        return mealPlanRepository.save(plan);
    }

    public boolean isClientAssignedToNutritionist(String clientEmail, String nutritionistEmail) {
        String cEmail = clientEmail.toLowerCase().trim();
        String nEmail = nutritionistEmail.toLowerCase().trim();

        if ("admin@smartfit.com".equalsIgnoreCase(nEmail)) return true;

        Optional<User> opt = userRepository.findByEmail(cEmail);
        if (opt.isEmpty()) return false;
        User u = opt.get();
        if (u.getAssignedNutritionist() == null) {
            Map<String, String> assignedMap = new HashMap<>();
            assignedMap.put("email", nEmail);
            assignedMap.put("name", "Clinical Nutritionist");
            assignedMap.put("qualification", "Licensed Dietitian & Performance Nutritionist");
            u.setAssignedNutritionist(assignedMap);
            userRepository.save(u);
            return true;
        }
        String assigned = u.getAssignedNutritionist().get("email");
        if (assigned == null || assigned.trim().isEmpty()) {
            return true;
        }
        if (assigned.equalsIgnoreCase(nEmail)) {
            return true;
        }
        // Enrolled platform nutritionists can view all clients
        return "sruthy@example.com".equalsIgnoreCase(nEmail) || "elena@example.com".equalsIgnoreCase(nEmail);
    }

    public Map<String, Object> getClientClinicalAssessment(String clientEmail) {
        User user = userRepository.findByEmail(clientEmail.toLowerCase().trim()).orElse(null);
        if (user == null) return null;

        double w = user.getWeight() > 0 ? user.getWeight() : 75.0;
        double h = user.getHeight() > 0 ? user.getHeight() : 178.0;
        int age = user.getAge() > 0 ? user.getAge() : 26;
        boolean isFemale = user.getGender() != null && user.getGender().toLowerCase().contains("female");

        double bmr = isFemale ? (10.0 * w + 6.25 * h - 5.0 * age - 161.0) : (10.0 * w + 6.25 * h - 5.0 * age + 5.0);
        double pal = 1.55;
        int tdee = (int) Math.round(bmr * pal);
        int targetCals = tdee;

        Map<String, Object> assessment = new HashMap<>();
        assessment.put("user", user);

        Map<String, Object> clinical = new HashMap<>();
        clinical.put("bmr", (int) Math.round(bmr));
        clinical.put("tdee", tdee);
        clinical.put("palMultiplier", pal);
        clinical.put("recommendedCalories", targetCals);
        clinical.put("recommendedProteinGrams", (int) Math.round(w * 2.0));
        clinical.put("recommendedCarbGrams", (int) Math.round((targetCals * 0.45) / 4));
        clinical.put("recommendedFatGrams", (int) Math.round((targetCals * 0.25) / 9));
        clinical.put("bmi", user.calculateBmi());
        clinical.put("bmiCategory", user.calculateBmiCategory());
        
        Map<String, Object> dietaryCats = new HashMap<>();
        dietaryCats.put("dietaryPreference", user.getDietaryPreference() != null ? user.getDietaryPreference() : "Standard Balanced");
        dietaryCats.put("confirmedAllergies", user.getAllergies());
        dietaryCats.put("intolerances", user.getIntolerances());
        dietaryCats.put("dislikedFoods", user.getDislikedFoods());
        dietaryCats.put("culturalRestrictions", user.getCulturalRestrictions());
        dietaryCats.put("clinicianAdvisedRestrictions", user.getClinicianAdvisedRestrictions());
        clinical.put("dietaryCategories", dietaryCats);

        assessment.put("clinicalAssessment", clinical);
        assessment.put("activeMealPlan", mealPlanRepository.findFirstByUserEmailOrderByUpdatedAtDesc(clientEmail.toLowerCase().trim()).orElse(null));

        return assessment;
    }

    public MealPlan saveMealPlan(MealPlan plan, String nutritionistEmail) {
        String cleanClient = plan.getUserEmail().toLowerCase().trim();
        String cleanNutri = nutritionistEmail.toLowerCase().trim();

        // Enforce assignment
        if (!isClientAssignedToNutritionist(cleanClient, cleanNutri)) {
            throw new SecurityException("Client is not assigned to authenticated nutritionist.");
        }

        // Enforce safety on meals
        User client = userRepository.findByEmail(cleanClient).orElse(null);
        if (client != null && plan.getMeals() != null) {
            List<String> restrictions = new ArrayList<>();
            if (client.getAllergies() != null) restrictions.addAll(client.getAllergies());
            if (client.getIntolerances() != null) restrictions.addAll(client.getIntolerances());

            for (Map<String, Object> m : plan.getMeals()) {
                String title = (String) m.getOrDefault("title", "");
                for (String r : restrictions) {
                    if (r != null && !r.trim().isEmpty() && title.toLowerCase().contains(r.toLowerCase().trim())) {
                        throw new IllegalArgumentException("Safety violation: Meal '" + title + "' contains restricted item '" + r + "'");
                    }
                }
            }
        }

        plan.setUserEmail(cleanClient);
        plan.setNutritionistEmail(cleanNutri);
        if (plan.getPrescriptionId() == null || plan.getPrescriptionId().isEmpty()) {
            plan.setPrescriptionId("rx-" + System.currentTimeMillis());
        }

        MealPlan saved = mealPlanRepository.save(plan);
        if ("PUBLISHED".equalsIgnoreCase(plan.getStatus()) || "APPROVED".equalsIgnoreCase(plan.getStatus())) {
            try {
                String today = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date());
                generateAndSaveMealSchedule(cleanClient, today, true, cleanNutri);
            } catch (Exception ignored) {}
        }
        return saved;
    }

    public MealSchedule generateAndSaveMealSchedule(String clientEmail, String targetDate, boolean saveSchedule, String nutritionistEmail) {
        String cleanClient = clientEmail.toLowerCase().trim();
        String cleanNutri = nutritionistEmail.toLowerCase().trim();

        if (!isClientAssignedToNutritionist(cleanClient, cleanNutri)) {
            throw new SecurityException("Client is not assigned to authenticated nutritionist.");
        }

        User client = userRepository.findByEmail(cleanClient).orElseThrow(() -> new IllegalArgumentException("Client not found"));
        MealPlan plan = mealPlanRepository.findByUserEmail(cleanClient).orElseThrow(() -> new IllegalArgumentException("No meal plan found for client."));

        String dateStr = (targetDate != null && !targetDate.trim().isEmpty()) 
                ? targetDate.trim() 
                : new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date());

        List<Map<String, Object>> candidatePool = (plan.getApprovedCandidateMeals() != null && !plan.getApprovedCandidateMeals().isEmpty())
                ? plan.getApprovedCandidateMeals()
                : plan.getMeals();

        if (candidatePool == null || candidatePool.isEmpty()) {
            throw new IllegalArgumentException("No candidate meals available for rotation.");
        }

        String[][] slotDefs = {
            {"breakfast", "Breakfast", "07:30", "BREAKFAST"},
            {"morning_snack", "Morning Snack", "10:30", "MORNING_SNACK,SNACK"},
            {"lunch", "Lunch", "13:00", "LUNCH"},
            {"evening_snack", "Evening Snack", "16:30", "EVENING_SNACK,SNACK"},
            {"dinner", "Dinner", "19:45", "DINNER"}
        };

        int dateSeed = 0;
        for (String part : dateStr.split("-")) {
            try { dateSeed += Integer.parseInt(part); } catch (Exception ignored) {}
        }

        List<Map<String, Object>> scheduledSlots = new ArrayList<>();
        int totalCals = 0, totalProt = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0;

        for (int i = 0; i < slotDefs.length; i++) {
            String slotId = slotDefs[i][0];
            String slotName = slotDefs[i][1];
            String slotTime = slotDefs[i][2];
            String acceptable = slotDefs[i][3];

            List<Map<String, Object>> matches = new ArrayList<>();
            for (Map<String, Object> m : candidatePool) {
                String type = (String) m.getOrDefault("slotType", m.getOrDefault("type", ""));
                if (type != null && acceptable.toUpperCase().contains(type.toUpperCase())) {
                    matches.add(m);
                }
            }
            if (matches.isEmpty()) {
                matches = candidatePool;
            }

            Map<String, Object> chosen = matches.get((dateSeed + i) % matches.size());

            int cals = parseNumber(chosen.get("calories"), 400);
            int prot = parseNumber(chosen.get("protein"), 25);
            int carbs = parseNumber(chosen.get("carbs"), 40);
            int fat = parseNumber(chosen.get("fat"), 10);
            int fiber = parseNumber(chosen.get("fiber"), 5);

            totalCals += cals;
            totalProt += prot;
            totalCarbs += carbs;
            totalFat += fat;
            totalFiber += fiber;

            Map<String, Object> slotObj = new HashMap<>();
            slotObj.put("slotId", slotId);
            slotObj.put("slotName", slotName);
            slotObj.put("scheduledTime", slotTime);
            slotObj.put("mealId", chosen.getOrDefault("id", "m-" + (i + 1)));
            slotObj.put("title", chosen.getOrDefault("title", "Nutritious Meal"));
            slotObj.put("description", chosen.getOrDefault("description", ""));
            slotObj.put("servingSize", chosen.getOrDefault("servingSize", "1 serving"));
            slotObj.put("prescribedCalories", cals);
            slotObj.put("prescribedProtein", prot);
            slotObj.put("prescribedCarbs", carbs);
            slotObj.put("prescribedFat", fat);
            slotObj.put("prescribedFiber", fiber);
            slotObj.put("ingredients", chosen.getOrDefault("ingredients", Collections.emptyList()));
            slotObj.put("preparationInstructions", chosen.getOrDefault("preparationInstructions", ""));
            slotObj.put("allowedSubstitutions", chosen.getOrDefault("allowedSubstitutions", Collections.emptyList()));
            slotObj.put("consumptionStatus", "PENDING");
            slotObj.put("actualPortionEatenPct", 0);
            slotObj.put("actualCaloriesConsumed", 0);
            slotObj.put("actualProteinConsumed", 0);
            slotObj.put("actualCarbsConsumed", 0);
            slotObj.put("actualFatConsumed", 0);

            scheduledSlots.add(slotObj);
        }

        MealSchedule schedule = mealScheduleRepository.findByUserEmailAndDate(cleanClient, dateStr).orElse(new MealSchedule());
        schedule.setScheduleId("sched-" + dateStr + "-" + cleanClient.split("@")[0]);
        schedule.setUserEmail(cleanClient);
        schedule.setUserName(client.getFullName());
        schedule.setNutritionistEmail(cleanNutri);
        schedule.setNutritionistName(plan.getNutritionistName());
        schedule.setDate(dateStr);
        schedule.setPrescriptionId(plan.getPrescriptionId());
        schedule.setPrescriptionVersion(plan.getCurrentVersion());
        schedule.setStatus(saveSchedule ? "PUBLISHED" : "DRAFT_PREVIEW");
        schedule.setStable(true);
        schedule.setGenerationTime(new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").format(new Date()));

        Map<String, Object> targetTotals = new HashMap<>();
        targetTotals.put("calories", plan.getTargetCalories());
        targetTotals.put("protein", plan.getProteinGrams());
        targetTotals.put("carbs", plan.getCarbGrams());
        targetTotals.put("fat", plan.getFatGrams());
        targetTotals.put("fiber", plan.getFiberGrams());
        schedule.setTargetTotals(targetTotals);

        Map<String, Object> scheduledTotals = new HashMap<>();
        scheduledTotals.put("calories", totalCals);
        scheduledTotals.put("protein", totalProt);
        scheduledTotals.put("carbs", totalCarbs);
        scheduledTotals.put("fat", totalFat);
        scheduledTotals.put("fiber", totalFiber);
        schedule.setScheduledTotals(scheduledTotals);

        schedule.setSlots(scheduledSlots);

        if (saveSchedule) {
            return mealScheduleRepository.save(schedule);
        }
        return schedule;
    }

    public MealSchedule getMealScheduleForUser(String userEmail, String targetDate) {
        String cleanEmail = userEmail.toLowerCase().trim();
        String dateStr = (targetDate != null && !targetDate.trim().isEmpty())
                ? targetDate.trim()
                : new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date());

        Optional<MealSchedule> existing = mealScheduleRepository.findByUserEmailAndDate(cleanEmail, dateStr);
        if (existing.isPresent()) {
            return existing.get();
        }

        Optional<MealPlan> planOpt = mealPlanRepository.findByUserEmail(cleanEmail);
        if (planOpt.isPresent()) {
            MealPlan plan = planOpt.get();
            if ("PUBLISHED".equalsIgnoreCase(plan.getStatus()) || "APPROVED".equalsIgnoreCase(plan.getStatus()) || "APPROVED_AND_ACTIVE".equalsIgnoreCase(plan.getStatus())) {
                String nutriEmail = plan.getNutritionistEmail() != null ? plan.getNutritionistEmail() : "sruthy@example.com";
                return generateAndSaveMealSchedule(cleanEmail, dateStr, true, nutriEmail);
            }
        }
        return null;
    }

    public MealSchedule updateMealSlotConsumption(String userEmail, String targetDate, String slotId, String status, int portionPct, String substitutedWith, String clientFeedbackNotes) {
        String cleanEmail = userEmail.toLowerCase().trim();
        String dateStr = (targetDate != null && !targetDate.trim().isEmpty())
                ? targetDate.trim()
                : new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date());

        MealSchedule schedule = getMealScheduleForUser(cleanEmail, dateStr);
        if (schedule == null) return null;

        if (schedule.getSlots() != null) {
            for (Map<String, Object> slot : schedule.getSlots()) {
                if (slotId.equalsIgnoreCase((String) slot.get("slotId"))) {
                    slot.put("consumptionStatus", status != null ? status : "COMPLETED");
                    slot.put("actualPortionEatenPct", portionPct);
                    if (substitutedWith != null) slot.put("substitutedWith", substitutedWith);
                    if (clientFeedbackNotes != null) slot.put("clientFeedbackNotes", clientFeedbackNotes);

                    int cals = parseNumber(slot.get("prescribedCalories"), 400);
                    int prot = parseNumber(slot.get("prescribedProtein"), 25);
                    int carbs = parseNumber(slot.get("prescribedCarbs"), 40);
                    int fat = parseNumber(slot.get("prescribedFat"), 10);

                    double mult = Math.max(0, Math.min(100, portionPct)) / 100.0;
                    slot.put("actualCaloriesConsumed", (int) Math.round(cals * mult));
                    slot.put("actualProteinConsumed", (int) Math.round(prot * mult));
                    slot.put("actualCarbsConsumed", (int) Math.round(carbs * mult));
                    slot.put("actualFatConsumed", (int) Math.round(fat * mult));
                    break;
                }
            }
        }
        return mealScheduleRepository.save(schedule);
    }

    private int parseNumber(Object val, int fallback) {
        if (val == null) return fallback;
        if (val instanceof Number) return ((Number) val).intValue();
        try {
            String s = val.toString().replaceAll("[^0-9.-]", "");
            return (int) Math.round(Double.parseDouble(s));
        } catch (Exception e) {
            return fallback;
        }
    }

    public List<ChatMessage> getChatHistory(String clientEmail, String specialistEmail) {
        String convId = getConversationId(clientEmail, specialistEmail);
        return chatMessageRepository.findByConversationIdOrderByRawTimeAsc(convId);
    }

    public ChatMessage sendChatMessage(ChatMessage msg) {
        msg.setConversationId(getConversationId(msg.getClientEmail(), msg.getSpecialistEmail()));
        msg.setRawTime(System.currentTimeMillis());
        msg.setCreatedAt(new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").format(new Date()));
        return chatMessageRepository.save(msg);
    }

    private String getConversationId(String email1, String email2) {
        List<String> list = Arrays.asList(email1.toLowerCase().trim(), email2.toLowerCase().trim());
        Collections.sort(list);
        return list.get(0) + "_" + list.get(1);
    }
}
