export const transformUserResponse = (user, subclassDoc = null) => {
  const base = {
    id: user._id?.toString(),
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    gender: user.gender,
    personalPhoto: user.personalPhoto,
    role: user.role,
    isVerified: user.isVerified,
    preferredLanguage: user.preferredLanguage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  if (user.role === "patient") {
    return {
      ...base,
      hasCompletedOnboarding: !!subclassDoc,
      profile: subclassDoc
        ? {
            bloodType: subclassDoc.bloodType,
            height: subclassDoc.height,
            weight: subclassDoc.weight,
            conditions: subclassDoc.conditions,
            allergies: subclassDoc.allergies,
            emergencyContact: subclassDoc.emergencyContact,
          }
        : null,
    };
  }

  if (user.role === "doctor") {
    return {
      ...base,
      isVerified: user.isVerified,
      doctorProfile: user.doctorProfile || null,
    };
  }

  return base;
};
