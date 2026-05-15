export const transformUserResponse = (user) => {
  const base = {
    id: user._id?.toString(),
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    gender: user.gender,
    personalPhoto: user.personalPhoto,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt, // ✅ Added missing field
    preferredLanguage: user.preferredLanguage,
  };

  if (user.role === "patient") {
    return {
      ...base,
    };
  }

  if (user.role === "doctor") {
    return {
      ...base,
      doctorProfile: user.doctorProfile,
    };
  }

  return base;
};
