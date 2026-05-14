export const transformUserResponse = (user) => {
  const base = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    gender: user.gender,
    personalPhoto: user.personalPhoto,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };

  if (user.role === "patient") {
    return {
      ...base,
      preferredLanguage: user.preferredLanguage,
      // No doctorProfile
    };
  }

  if (user.role === "doctor") {
    return {
      ...base,
      doctorProfile: user.doctorProfile,
      // No preferredLanguage
    };
  }

  return base; // admin or other roles
};
