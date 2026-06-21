import React from 'react';
import PatientCard, { PatientCardProps, PatientStatus } from './PatientCard';

export interface Patient extends Omit<PatientCardProps, 'onAccept' | 'onReject' | 'onChat'> {
  isOnline?: boolean;
}

interface RequestsGridProps {
  patients: Patient[];
  activeTab: 'chats' | 'requests';
  onAccept?: (id: string | number) => void;
  onReject?: (id: string | number) => void;
  onChat?: (id: string | number) => void;
}

const RequestsGrid: React.FC<RequestsGridProps> = ({
  patients,
  activeTab,
  onAccept,
  onReject,
  onChat,
}) => {
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <p className="text-sm">No {activeTab} available</p>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
      role="tabpanel"
      id={`panel-${activeTab}`}
      aria-labelledby={`tab-${activeTab}`}
    >
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          id={patient.id}
          name={patient.name}
          avatar={patient.avatar}
          caseType={patient.caseType}
          message={patient.message}
          status={patient.status}
          isOnline={patient.isOnline}
          onAccept={onAccept}
          onReject={onReject}
          onChat={onChat}
        />
      ))}
    </div>
  );
};

export default RequestsGrid;
