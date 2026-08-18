package com.smartfit.service;

import com.smartfit.dto.RegisterRequest;
import com.smartfit.model.User;
import com.smartfit.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Email Pattern (RFC 5322 compatible regex)
    private static final Pattern EMAIL_PATTERN = 
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");

    // Password Pattern: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
    private static final Pattern PASSWORD_PATTERN = 
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^()_+\\-=\\[\\]{}|;:',.<>/]).{8,}$");

    private final java.util.concurrent.ConcurrentHashMap<String, User> memoryStore = new java.util.concurrent.ConcurrentHashMap<>();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

        // Pre-seed diverse database of registered users including Admin, Aby, and Sruthy
        User adminUser = createAdminUser("System Administrator", "admin@smartfit.com", "AdminPass123!", 32, "Male", 180.0, 80.0, "Very Active", "System Operations", "Standard Balanced", "Full Gym Access", "None", passwordEncoder);

        User[] seedUsers = new User[] {
            adminUser,
            createUser("Aby Thomas", "aby@example.com", "password123", 27, "Male", 177.0, 74.0, "Moderately Active", "Muscle Building", "Standard Balanced", "Full Gym Access", "None", passwordEncoder),
            createUser("Sruthy Varghese", "sruthy@example.com", "password123", 25, "Female", 163.0, 56.0, "Very Active", "Fat Loss & Toning", "Vegetarian", "Dumbbells & Resistance Bands", "None", passwordEncoder),
            createUser("Aby", "aby@gmail.com", "password123", 27, "Male", 177.0, 74.0, "Moderately Active", "Muscle Building", "Standard Balanced", "Full Gym Access", "None", passwordEncoder),
            createUser("Sruthy", "sruthy@gmail.com", "password123", 25, "Female", 163.0, 56.0, "Very Active", "Fat Loss & Toning", "Vegetarian", "Dumbbells & Resistance Bands", "None", passwordEncoder),
            createUser("Alex Morgan", "alex@example.com", "password123", 26, "Male", 178.0, 75.0, "Moderately Active", "Muscle Building", "Standard Balanced", "Full Gym Access", "None", passwordEncoder),
            createUser("John Doe", "john@example.com", "password123", 21, "Male", 175.0, 70.0, "Moderately Active", "Weight Loss", "Vegetarian", "Dumbbells Only", "None", passwordEncoder),
            createUser("Sarah Jenkins", "sarah@example.com", "password123", 28, "Female", 165.0, 58.0, "Very Active", "Endurance & Conditioning", "Vegan", "Full Gym Access", "None", passwordEncoder),
            createUser("Marcus Vance", "marcus@example.com", "password123", 34, "Male", 185.0, 92.0, "Very Active", "Heavy Strength", "High Protein Keto", "Full Gym Access", "Knee Tendonitis", passwordEncoder),
            createUser("Elena Rostova", "elena@example.com", "password123", 31, "Female", 170.0, 62.0, "Moderately Active", "Hypertrophy & Toning", "Low Carb", "Full Gym Access", "None", passwordEncoder),
            createUser("David Kim", "david@example.com", "password123", 24, "Male", 176.0, 68.0, "Lightly Active", "Athletic Conditioning", "Standard Balanced", "Bodyweight / Calisthenics", "None", passwordEncoder),
            createUser("Priya Sharma", "priya@example.com", "password123", 29, "Female", 162.0, 55.0, "Moderately Active", "Fat Loss & Toning", "Vegetarian", "Dumbbells & Resistance Bands", "None", passwordEncoder),
            createUser("Carlos Mendez", "carlos@example.com", "password123", 38, "Male", 180.0, 84.0, "Moderately Active", "Muscle Building", "Standard Balanced", "Full Gym Access", "Lower Back Tightness", passwordEncoder),
            createUser("Emily Watson", "emily@example.com", "password123", 25, "Female", 168.0, 60.0, "Lightly Active", "Health & Mobility", "Pescatarian", "Yoga Mat & Dumbbells", "None", passwordEncoder),
            createUser("Michael Chang", "michael@example.com", "password123", 42, "Male", 172.0, 78.0, "Moderately Active", "Weight Loss", "Low Carb", "Full Gym Access", "Mild Asthma", passwordEncoder),
            createUser("Sophia Taylor", "sophia@example.com", "password123", 23, "Female", 160.0, 52.0, "Very Active", "Endurance", "High Protein", "Full Gym Access", "None", passwordEncoder),
            createUser("James Wilson", "james@example.com", "password123", 30, "Male", 182.0, 88.0, "Very Active", "Hypertrophy", "Standard Balanced", "Full Gym Access", "None", passwordEncoder)
        };

        for (User u : seedUsers) {
            memoryStore.put(u.getEmail(), u);
        }

        try {
            int savedCount = 0;
            for (User u : seedUsers) {
                if (!userRepository.existsByEmail(u.getEmail())) {
                    userRepository.save(u);
                    savedCount++;
                }
            }
            System.out.println("[SUCCESS] Seeded " + savedCount + " new registered users into MongoDB smartfit_db.users collection.");
        } catch (Exception e) {
            System.err.println("[INFO] MongoDB offline notice - users cached in memory store: " + e.getMessage());
        }
    }

    private User createAdminUser(String name, String email, String pwd, int age, String gender, double h, double w, String act, String goal, String diet, String equip, String med, PasswordEncoder encoder) {
        User u = createUser(name, email, pwd, age, gender, h, w, act, goal, diet, equip, med, encoder);
        u.setRole("ADMIN");
        return u;
    }

    private User createUser(String name, String email, String pwd, int age, String gender, double h, double w, String act, String goal, String diet, String equip, String med, PasswordEncoder encoder) {
        User u = new User();
        u.setFullName(name);
        u.setEmail(email);
        u.setPassword(encoder.encode(pwd));
        u.setAge(age);
        u.setGender(gender);
        u.setHeight(h);
        u.setWeight(w);
        u.setActivityLevel(act);
        u.setFitnessGoal(goal);
        u.setDietaryPreference(diet);
        u.setWorkoutEquipment(equip);
        u.setMedicalConditions(med);
        u.setRole("USER");
        u.recalculateMetrics();
        return u;
    }

    public void deleteUser(String email) {
        if (email == null) return;
        String cleanEmail = email.trim().toLowerCase();
        memoryStore.remove(cleanEmail);
        try {
            Optional<User> userOpt = userRepository.findByEmail(cleanEmail);
            userOpt.ifPresent(userRepository::delete);
            System.out.println("[SUCCESS] Removed user account " + cleanEmail + " from MongoDB database.");
        } catch (Exception e) {
            System.err.println("MongoDB delete user note: " + e.getMessage());
        }
    }

    public User registerUser(RegisterRequest req) {
        // 1. Full Name Validation
        if (req.getFullName() == null || req.getFullName().trim().length() < 2) {
            throw new RuntimeException("Full name must be at least 2 characters long.");
        }

        // 2. Email Validation
        if (req.getEmail() == null || !EMAIL_PATTERN.matcher(req.getEmail().trim()).matches()) {
            throw new RuntimeException("Please enter a valid email address.");
        }

        String cleanEmail = req.getEmail().trim().toLowerCase();

        // 3. Email Uniqueness Check
        boolean existsInMongo = false;
        try {
            existsInMongo = userRepository.existsByEmail(cleanEmail);
        } catch (Exception e) {
            // MongoDB offline fallback
        }

        if (existsInMongo || memoryStore.containsKey(cleanEmail)) {
            throw new RuntimeException("Email address is already registered. Please login instead.");
        }

        // 4. Password Strength Security Validation
        if (req.getPassword() == null || !PASSWORD_PATTERN.matcher(req.getPassword()).matches()) {
            throw new RuntimeException("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }

        // 5. Biometrics Range Validation
        if (req.getAge() < 13 || req.getAge() > 120) {
            throw new RuntimeException("Age must be between 13 and 120 years.");
        }
        if (req.getHeight() < 50 || req.getHeight() > 250) {
            throw new RuntimeException("Height must be between 50 cm and 250 cm.");
        }
        if (req.getWeight() < 20 || req.getWeight() > 300) {
            throw new RuntimeException("Weight must be between 20 kg and 300 kg.");
        }

        User user = new User();
        user.setFullName(req.getFullName().trim());
        user.setEmail(cleanEmail);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        
        user.setAge(req.getAge());
        user.setGender(req.getGender() != null ? req.getGender() : "Male");
        user.setHeight(req.getHeight());
        user.setWeight(req.getWeight());
        user.setActivityLevel(req.getActivityLevel() != null ? req.getActivityLevel() : "Moderately Active");
        user.setFitnessGoal(req.getFitnessGoal() != null ? req.getFitnessGoal() : "Muscle Building");
        user.setDietaryPreference(req.getDietaryPreference() != null ? req.getDietaryPreference() : "Standard Balanced");
        user.setWorkoutEquipment(req.getWorkoutEquipment() != null ? req.getWorkoutEquipment() : "Full Gym Access");
        user.setMedicalConditions(req.getMedicalConditions() != null ? req.getMedicalConditions() : "None");
        user.setRole("USER");
        user.recalculateMetrics();

        memoryStore.put(cleanEmail, user);
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            System.err.println("MongoDB offline note - Saved user to in-memory store: " + e.getMessage());
            return user;
        }
    }

    public Optional<User> findByEmail(String email) {
        if (email == null) return Optional.empty();
        String cleanEmail = email.trim().toLowerCase();
        try {
            Optional<User> mongoUser = userRepository.findByEmail(cleanEmail);
            if (mongoUser.isPresent()) return mongoUser;
        } catch (Exception e) {
            System.err.println("MongoDB query fallback active: " + e.getMessage());
        }
        return Optional.ofNullable(memoryStore.get(cleanEmail));
    }

    public java.util.List<User> findAllUsers() {
        try {
            java.util.List<User> users = userRepository.findAll();
            String now = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            boolean updated = false;

            for (User u : users) {
                if (u.getLastLoginTime() == null) {
                    u.setLoggedIn(true);
                    u.setLastLoginTime(now);
                    if (u.getRole() == null) u.setRole("USER");
                    try { userRepository.save(u); } catch (Exception e) {}
                    updated = true;
                }
            }

            return updated ? userRepository.findAll() : users;
        } catch (Exception e) {
            return new java.util.ArrayList<>(memoryStore.values());
        }
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) return false;
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public User updateUserProfile(String email, User profileData) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email address is required.");
        }
        User user = findByEmail(email.trim().toLowerCase())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email.trim().toLowerCase());
                    newUser.setFullName(profileData.getFullName() != null ? profileData.getFullName() : email.split("@")[0]);
                    return newUser;
                });

        if (profileData.getFullName() != null && !profileData.getFullName().trim().isEmpty()) {
            user.setFullName(profileData.getFullName().trim());
        }
        if (profileData.getAge() > 0) {
            user.setAge(profileData.getAge());
        }
        if (profileData.getGender() != null) {
            user.setGender(profileData.getGender());
        }
        if (profileData.getHeight() > 0) {
            user.setHeight(profileData.getHeight());
        }
        if (profileData.getWeight() > 0) {
            user.setWeight(profileData.getWeight());
        }
        if (profileData.getActivityLevel() != null) {
            user.setActivityLevel(profileData.getActivityLevel());
        }
        if (profileData.getFitnessGoal() != null) {
            user.setFitnessGoal(profileData.getFitnessGoal());
        }
        if (profileData.getDietaryPreference() != null) {
            user.setDietaryPreference(profileData.getDietaryPreference());
        }
        if (profileData.getWorkoutEquipment() != null) {
            user.setWorkoutEquipment(profileData.getWorkoutEquipment());
        }
        if (profileData.getMedicalConditions() != null) {
            user.setMedicalConditions(profileData.getMedicalConditions());
        }

        memoryStore.put(user.getEmail(), user);
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            return user;
        }
    }
}

