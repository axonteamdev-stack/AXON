import { describe, it, expect } from "@jest/globals";
import {
  userValidationSchema,
  authValidationSchema,
  postValidationSchema,
  articleValidationSchema,
  medicationValidationSchema,
  appointmentValidationSchema,
  chatValidationSchema,
  commentValidationSchema,
} from "../src/validators/index.js";

describe("Validators Test Suite", () => {
  describe("User Validation Schema", () => {
    it("should validate correct user registration", () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "SecurePass123!",
        phone: "+1234567890",
        role: "patient",
      };

      const result = userValidationSchema.register.safeParse(userData);
      expect(result.success).toBe(true);
    });

    it("should reject missing required fields", () => {
      const userData = {
        firstName: "John",
        email: "john@example.com",
      };

      const result = userValidationSchema.register.safeParse(userData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid email", () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        password: "SecurePass123!",
        role: "patient",
      };

      const result = userValidationSchema.register.safeParse(userData);
      expect(result.success).toBe(false);
    });

    it("should reject weak password", () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "weak",
        role: "patient",
      };

      const result = userValidationSchema.register.safeParse(userData);
      expect(result.success).toBe(false);
    });

    it("should validate user profile update", () => {
      const updateData = {
        firstName: "Jane",
        lastName: "Smith",
        bio: "Medical professional",
      };

      const result = userValidationSchema.update.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    it("should not require all fields for update", () => {
      const updateData = {
        firstName: "Jane",
      };

      const result = userValidationSchema.update.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    it("should validate role field", () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "SecurePass123!",
        role: "invalid-role",
      };

      const result = userValidationSchema.register.safeParse(userData);
      expect(result.success).toBe(false);
    });
  });

  describe("Auth Validation Schema", () => {
    it("should validate login credentials", () => {
      const loginData = {
        email: "user@example.com",
        password: "Password123!",
      };

      const result = authValidationSchema.login.safeParse(loginData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email on login", () => {
      const loginData = {
        email: "invalid-email",
        password: "Password123!",
      };

      const result = authValidationSchema.login.safeParse(loginData);
      expect(result.success).toBe(false);
    });

    it("should validate password reset request", () => {
      const resetData = {
        email: "user@example.com",
      };

      const result = authValidationSchema.forgotPassword.safeParse(resetData);
      expect(result.success).toBe(true);
    });

    it("should validate password reset with token", () => {
      const resetData = {
        token: "reset-token-123",
        newPassword: "NewPass123!",
        confirmPassword: "NewPass123!",
      };

      const result = authValidationSchema.resetPassword.safeParse(resetData);
      expect(result.success).toBe(true);
    });

    it("should reject mismatched passwords on reset", () => {
      const resetData = {
        token: "reset-token-123",
        newPassword: "NewPass123!",
        confirmPassword: "DifferentPass123!",
      };

      const result = authValidationSchema.resetPassword.safeParse(resetData);
      expect(result.success).toBe(false);
    });

    it("should validate 2FA setup", () => {
      const twoFAData = {
        method: "authenticator",
      };

      const result = authValidationSchema.setupTwoFA.safeParse(twoFAData);
      expect(result.success).toBe(true);
    });
  });

  describe("Post Validation Schema", () => {
    it("should validate post creation", () => {
      const postData = {
        content: "This is a test post with meaningful content",
        visibility: "public",
        tags: ["health", "wellness"],
      };

      const result = postValidationSchema.create.safeParse(postData);
      expect(result.success).toBe(true);
    });

    it("should reject empty content", () => {
      const postData = {
        content: "",
        visibility: "public",
      };

      const result = postValidationSchema.create.safeParse(postData);
      expect(result.success).toBe(false);
    });

    it("should reject too long content", () => {
      const postData = {
        content: "a".repeat(5001),
        visibility: "public",
      };

      const result = postValidationSchema.create.safeParse(postData);
      expect(result.success).toBe(false);
    });

    it("should validate visibility options", () => {
      const validVisibilities = ["public", "private", "friends"];

      validVisibilities.forEach((visibility) => {
        const postData = {
          content: "Test post",
          visibility,
        };

        const result = postValidationSchema.create.safeParse(postData);
        expect(result.success).toBe(true);
      });
    });

    it("should validate post update", () => {
      const updateData = {
        content: "Updated content",
      };

      const result = postValidationSchema.update.safeParse(updateData);
      expect(result.success).toBe(true);
    });
  });

  describe("Article Validation Schema", () => {
    it("should validate article creation", () => {
      const articleData = {
        title: "Understanding Diabetes",
        content: "Article content here",
        category: "medical",
        tags: ["diabetes", "health"],
      };

      const result = articleValidationSchema.create.safeParse(articleData);
      expect(result.success).toBe(true);
    });

    it("should require title for article", () => {
      const articleData = {
        content: "Article content here",
        category: "medical",
      };

      const result = articleValidationSchema.create.safeParse(articleData);
      expect(result.success).toBe(false);
    });

    it("should validate article categories", () => {
      const categories = ["medical", "wellness", "tips"];

      categories.forEach((category) => {
        const articleData = {
          title: "Test Article",
          content: "Content",
          category,
        };

        const result = articleValidationSchema.create.safeParse(articleData);
        expect(result.success).toBe(true);
      });
    });

    it("should validate article SEO fields", () => {
      const articleData = {
        title: "Test Article",
        content: "Content",
        category: "medical",
        seoDescription: "Article description for SEO",
        seoKeywords: ["health", "medical"],
      };

      const result = articleValidationSchema.create.safeParse(articleData);
      expect(result.success).toBe(true);
    });
  });

  describe("Medication Validation Schema", () => {
    it("should validate medication creation", () => {
      const medicationData = {
        name: "Aspirin",
        dosage: "500mg",
        frequency: "twice daily",
        startDate: "2026-01-01",
        prescribedBy: "Dr. Smith",
      };

      const result =
        medicationValidationSchema.create.safeParse(medicationData);
      expect(result.success).toBe(true);
    });

    it("should reject missing required fields", () => {
      const medicationData = {
        name: "Aspirin",
        dosage: "500mg",
      };

      const result =
        medicationValidationSchema.create.safeParse(medicationData);
      expect(result.success).toBe(false);
    });

    it("should validate frequency options", () => {
      const frequencies = [
        "once daily",
        "twice daily",
        "three times daily",
        "as needed",
      ];

      frequencies.forEach((frequency) => {
        const medicationData = {
          name: "Test Drug",
          dosage: "100mg",
          frequency,
        };

        const result =
          medicationValidationSchema.create.safeParse(medicationData);
        expect(result.success).toBe(true);
      });
    });

    it("should validate medication adherence record", () => {
      const adherenceData = {
        medicationId: "507f1f77bcf86cd799439011",
        taken: true,
        date: "2026-05-09",
      };

      const result =
        medicationValidationSchema.recordAdherence.safeParse(adherenceData);
      expect(result.success).toBe(true);
    });
  });

  describe("Appointment Validation Schema", () => {
    it("should validate appointment creation", () => {
      const appointmentData = {
        doctorId: "507f1f77bcf86cd799439011",
        date: "2026-06-15",
        time: "10:00 AM",
        reason: "Regular checkup",
        notes: "No fasting required",
      };

      const result =
        appointmentValidationSchema.create.safeParse(appointmentData);
      expect(result.success).toBe(true);
    });

    it("should validate appointment date is in future", () => {
      const appointmentData = {
        doctorId: "507f1f77bcf86cd799439011",
        date: "2020-01-01", // Past date
        time: "10:00 AM",
        reason: "Checkup",
      };

      const result =
        appointmentValidationSchema.create.safeParse(appointmentData);
      expect(result.success).toBe(false);
    });

    it("should validate appointment status update", () => {
      const updateData = {
        status: "confirmed",
        notes: "Patient confirmed appointment",
      };

      const result = appointmentValidationSchema.update.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    it("should validate appointment cancellation", () => {
      const cancelData = {
        reason: "Patient request",
      };

      const result = appointmentValidationSchema.cancel.safeParse(cancelData);
      expect(result.success).toBe(true);
    });
  });

  describe("Chat Validation Schema", () => {
    it("should validate message creation", () => {
      const messageData = {
        conversationId: "507f1f77bcf86cd799439011",
        content: "Hello! How are you?",
        type: "text",
      };

      const result = chatValidationSchema.createMessage.safeParse(messageData);
      expect(result.success).toBe(true);
    });

    it("should reject empty message", () => {
      const messageData = {
        conversationId: "507f1f77bcf86cd799439011",
        content: "",
        type: "text",
      };

      const result = chatValidationSchema.createMessage.safeParse(messageData);
      expect(result.success).toBe(false);
    });

    it("should validate message types", () => {
      const types = ["text", "image", "file", "audio"];

      types.forEach((type) => {
        const messageData = {
          conversationId: "507f1f77bcf86cd799439011",
          content: "Message",
          type,
        };

        const result =
          chatValidationSchema.createMessage.safeParse(messageData);
        expect(result.success).toBe(true);
      });
    });

    it("should validate conversation creation", () => {
      const conversationData = {
        participantId: "507f1f77bcf86cd799439011",
        type: "direct",
      };

      const result =
        chatValidationSchema.createConversation.safeParse(conversationData);
      expect(result.success).toBe(true);
    });
  });

  describe("Comment Validation Schema", () => {
    it("should validate comment creation", () => {
      const commentData = {
        postId: "507f1f77bcf86cd799439011",
        content: "Great post! Thanks for sharing.",
      };

      const result = commentValidationSchema.create.safeParse(commentData);
      expect(result.success).toBe(true);
    });

    it("should reject empty comment", () => {
      const commentData = {
        postId: "507f1f77bcf86cd799439011",
        content: "",
      };

      const result = commentValidationSchema.create.safeParse(commentData);
      expect(result.success).toBe(false);
    });

    it("should validate comment reply", () => {
      const replyData = {
        postId: "507f1f77bcf86cd799439011",
        commentId: "507f1f77bcf86cd799439012",
        content: "Thanks for the feedback",
      };

      const result = commentValidationSchema.reply.safeParse(replyData);
      expect(result.success).toBe(true);
    });

    it("should validate comment update", () => {
      const updateData = {
        content: "Updated comment content",
      };

      const result = commentValidationSchema.update.safeParse(updateData);
      expect(result.success).toBe(true);
    });
  });
});
