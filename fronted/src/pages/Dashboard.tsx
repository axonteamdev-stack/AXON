import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import Tabs, { TabId } from '../components/dashboard/Tabs';
import RequestsGrid, { Patient } from '../components/dashboard/RequestsGrid';

// Mock patient data
const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'Sarah Miller',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQVPyFO011916T5aQVkoFHl1XaGA-a6_v8eFvnjHs1LFdAAOX1xwa-7x5BUGcxJYcI9yz-g1eAi_iWPKzOT9dDpGokDXEmyOLVO6ZWmrUIrW4uBCB1yqfiK4mD0DqoXl5gTEivdiYqCY_TX1J7ORKJQnsXfgAweZARMcs8f4dKjwP9NJz5mR6nfCLEN0GzDmCGEwPxkDwvye6b7f-bCFHxrOtF_aCXrwSapkaP156nV7Rpi4gV8i_G601vN_13ND9Eea5KH0nR8KI',
    caseType: 'Hypertension Control',
    message: "I've been feeling slightly dizzy after my morning medication. Should I adjust the dosage?",
    status: 'new',
  },
  {
    id: 2,
    name: 'James Wilson',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVuzXPBitE1-t3Q8pJbYtOn6PDFcNAHCcZ4PNd6rObN_mi6KTXPWIdh93j98ZociFq96G91RbxutUQB6eSmqGsXP1dD-zxFA_7Ov57bM7jv8-WfbCKQc3GongCZAf8X78pPwcVf48M3gL94A0h59zzwdtOh9TYjx_IIqbmiY_hvDO3TvuMymuRG99JDxhHw0QVLkPtz7g109xVeDh3DSRWZmx6-tfuNoGWx8YRrtOcu3cOJVuzcP6m3eUYFtcjODHjT6edQW0HKXU',
    caseType: 'Post-Op Recovery',
    message: 'Recovery is going well. I would like to schedule a follow-up for next Tuesday if possible.',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Emily Chen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1QO_a766eqDuirRO2a1Ul4_vUd_qv9YX_CEfskTsVlgCzIQg5lYY4drpCfujj-lpOFSyscCgMgsNDZAvNxLzqnoqtlKVCNApFEbjqYv2Jkr6y0hqDUBLuk9G_fxXHfDNPdq1XSOe9YcNiGefKgyp0WoQNUB9xzFpeIRyqbTEV4roIHJeG5WEk24cLEownv5VVrv8A03ERb7jT6WSKJw_n4gUceZ4Sh7TcAYHJrKVGjCMLWIRLFehs7HM2vkSzZOg1itEf57WLtR0',
    caseType: 'Active Now',
    message: "The test results look promising. I'll continue the regimen as prescribed.",
    status: 'active',
    isOnline: true,
  },
  {
    id: 4,
    name: 'Robert Fox',
    avatar: null,
    caseType: 'Check-up Request',
    message: "Hi Doctor, I've noticed some unusual patterns in my heart rate monitor app. Can we discuss?",
    status: 'pending',
  },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('requests');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);

  // Separate patients by tab
  const requestPatients = patients.filter(p => p.status === 'new' || p.status === 'pending');
  const chatPatients = patients.filter(p => p.status === 'active');

  const displayPatients = activeTab === 'requests' ? requestPatients : chatPatients;

  const handleAccept = (id: string | number) => {
    setPatients(prev => 
      prev.map(p => 
        p.id === id 
          ? { ...p, status: 'active' as const, isOnline: false } 
          : p
      )
    );
  };

  const handleReject = (id: string | number) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const handleChat = (id: string | number) => {
    // Handle chat action - would navigate to chat page
    console.log(`Opening chat with patient ${id}`);
  };

  return (
    <DashboardLayout>
      <WelcomeSection doctorName="Dr Abdallah" />
      
      <Tabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <RequestsGrid
        patients={displayPatients}
        activeTab={activeTab}
        onAccept={handleAccept}
        onReject={handleReject}
        onChat={handleChat}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
