import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import Tabs, { TabId } from '../components/dashboard/Tabs';
import RequestsGrid, { Patient } from '../components/dashboard/RequestsGrid';
import * as appointmentsApi from '../api/appointments';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('requests');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pendingRes, historyRes] = await Promise.allSettled([
        appointmentsApi.getPendingRequests(),
        appointmentsApi.getDoctorHistory(),
      ]);

      const pending = pendingRes.status === 'fulfilled'
        ? (pendingRes.value.data?.data || pendingRes.value.data || [])
        : [];
      const history = historyRes.status === 'fulfilled'
        ? (historyRes.value.data?.data || historyRes.value.data || [])
        : [];

      const mapped: Patient[] = [
        ...(Array.isArray(pending) ? pending : []).map((a: any) => ({
          id: a._id || a.id,
          name: a.patient?.name || a.patientName || 'Patient',
          avatar: a.patient?.avatar || null,
          caseType: a.reason || a.caseType || 'Appointment Request',
          message: a.notes || a.message || 'No additional details provided.',
          status: a.status === 'new' ? 'new' as const : 'pending' as const,
        })),
        ...(Array.isArray(history) ? history : []).filter((a: any) => a.status === 'accepted').map((a: any) => ({
          id: a._id || a.id,
          name: a.patient?.name || a.patientName || 'Patient',
          avatar: a.patient?.avatar || null,
          caseType: a.reason || a.caseType || 'Active Case',
          message: a.notes || a.message || 'Follow-up in progress.',
          status: 'active' as const,
          isOnline: false,
        })),
      ];

      setPatients(mapped);
    } catch (err: any) {
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const requestPatients = patients.filter(p => p.status === 'new' || p.status === 'pending');
  const chatPatients = patients.filter(p => p.status === 'active');
  const displayPatients = activeTab === 'requests' ? requestPatients : chatPatients;

  const handleAccept = async (id: string | number) => {
    try {
      await appointmentsApi.updateAppointmentStatus(id as string, 'accepted');
      setPatients(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, status: 'active' as const, isOnline: false }
            : p
        )
      );
    } catch {
      setPatients(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, status: 'active' as const, isOnline: false }
            : p
        )
      );
    }
  };

  const handleReject = async (id: string | number) => {
    try {
      await appointmentsApi.updateAppointmentStatus(id as string, 'rejected');
    } catch {
      // proceed with local removal anyway
    }
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const handleChat = (id: string | number) => {
    navigate(`/messages?patientId=${id}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <WelcomeSection doctorName="Dr Abdallah" />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <WelcomeSection doctorName="Dr Abdallah" />
        <div className="text-center py-20 text-red-500">
          <p>{error}</p>
          <button onClick={fetchPatients} className="mt-4 text-primary underline">
            Try again
          </button>
        </div>
      </DashboardLayout>
    );
  }

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
