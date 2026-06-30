import React, { useState, useEffect } from 'react';

interface WelcomeSectionProps {
  doctorName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ doctorName: initialName }) => {
  const [displayName, setDisplayName] = useState(initialName);

  useEffect(() => {
    const checkName = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setDisplayName(parsed.name || parsed.firstName || initialName);
      } else {
        setDisplayName(initialName); // Fallback if no user in localStorage
      }
    };

    window.addEventListener('storage', checkName);
    checkName(); // Initial check
    return () => window.removeEventListener('storage', checkName);
  }, [initialName]);

  return (
    <div className="mb-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
        Hi, {displayName || 'Dr Abdallah'}
      </h1>
      <p className="text-gray-500 mt-1 text-sm">
        Manage your patients easily
      </p>
    </div>
  );
};

export default WelcomeSection;
