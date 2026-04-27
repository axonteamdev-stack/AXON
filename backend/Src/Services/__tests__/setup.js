/**
 * Test setup and utilities
 * Global test configuration and mock factories
 */

import { beforeEach, vi } from "vitest";

/**
 * Reset all mocks before each test
 */
beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * Mock User document for testing
 */
export const mockUserData = {
  _id: "507f1f77bcf86cd799439011",
  fullName: "John Doe",
  email: "john@example.com",
  password: "hashedPassword123",
  phoneNumber: "1234567890",
  gender: "Male",
  role: "patient",
  isVerified: true,
  personalPhoto: "Uploads/PersonalPhoto/patient-123.jpg",
  medicalProfile: {
    bloodType: "O+",
    height: 180,
    weight: 75,
    conditions: [],
    allergies: [],
    radiologyTests: [],
    labTests: [],
  },
  following: [],
  followers: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Mock Doctor document for testing
 */
export const mockDoctorData = {
  ...mockUserData,
  _id: "507f1f77bcf86cd799439012",
  email: "doctor@example.com",
  role: "doctor",
  isVerified: true,
  personalPhoto: "Uploads/PersonalPhoto/doctor-123.jpg",
  doctorProfile: {
    specialization: "Cardiology",
    yearsExperience: 10,
    medicalLicenseNumber: "DL123456",
    licenseImage: "Uploads/Certificates/doctor-123.jpg",
    about: "Experienced cardiologist",
    price: 100,
  },
  followers: ["507f1f77bcf86cd799439011"],
};

/**
 * Mock Post document for testing
 */
export const mockPostData = {
  _id: "507f1f77bcf86cd799439020",
  author: "507f1f77bcf86cd799439012",
  content: "This is a test post about health",
  tags: ["health", "exercise"],
  visibility: "public",
  images: [],
  likes: ["507f1f77bcf86cd799439011"],
  isDeleted: false,
  editedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Mock file object for testing
 */
export const mockFileData = {
  buffer: Buffer.from("test file content"),
  originalname: "test.jpg",
  mimetype: "image/jpeg",
  size: 1024,
};

/**
 * Mock Auth tokens for testing
 */
export const mockTokens = {
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature",
};

/**
 * Create a mock request object
 */
export const createMockRequest = (overrides = {}) => ({
  user: mockUserData,
  body: {},
  params: {},
  query: {},
  headers: {},
  cookies: {},
  lang: "ar",
  ...overrides,
});

/**
 * Create a mock response object
 */
export const createMockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
};

/**
 * Create a mock next function
 */
export const createMockNext = () => vi.fn();

/**
 * Create a mock session for MongoDB transactions
 */
export const createMockSession = () => ({
  startTransaction: vi.fn(),
  commitTransaction: vi.fn(),
  abortTransaction: vi.fn(),
  endSession: vi.fn(),
});
