import { createContext, useContext, useState } from 'react';

const InviteContext = createContext(null);

// Pre-seeded so the demo caregiver (Dr. Chidi) is already linked to Amara (id:1)
const INITIAL_INVITES = [
  { code: 'RAMBA-001', patientId: 1, patientName: 'Amara Kamara', patientEmail: 'amara@example.com', caregiverEmail: 'chidi@example.com', status: 'accepted' },
  { code: 'RAMBA-002', patientId: 1, patientName: 'Amara Kamara', patientEmail: 'amara@example.com', caregiverEmail: 'kwame.care@example.com', status: 'pending' },
];

const generateCode = () => 'RAMBA-' + Math.random().toString(36).toUpperCase().slice(2, 7);

export function InviteProvider({ children }) {
  const [invites, setInvites] = useState(INITIAL_INVITES);

  // Patient sends invite to a caregiver email
  const sendInvite = (patientId, patientName, patientEmail, caregiverEmail) => {
    const already = invites.find(i => i.patientId === patientId && i.caregiverEmail === caregiverEmail);
    if (already) return { success: false, error: 'An invite has already been sent to this email.' };
    const code = generateCode();
    setInvites(prev => [...prev, { code, patientId, patientName, patientEmail, caregiverEmail, status: 'pending' }]);
    return { success: true, code };
  };

  // Caregiver redeems a code after login
  const redeemInvite = (code, caregiverId) => {
    const invite = invites.find(i => i.code === code.toUpperCase().trim());
    if (!invite) return { success: false, error: 'Invalid invite code. Please check and try again.' };
    if (invite.status === 'accepted') return { success: false, error: 'This invite has already been used.' };
    setInvites(prev => prev.map(i => i.code === invite.code ? { ...i, status: 'accepted', caregiverId } : i));
    return { success: true, invite };
  };

  // Get all invites sent by a patient
  const getPatientInvites = (patientId) => invites.filter(i => i.patientId === patientId);

  // Get all accepted patients for a caregiver (by caregiverId or email match)
  const getCaregiverPatients = (caregiverId, caregiverEmail) =>
    invites.filter(i => i.status === 'accepted' && (i.caregiverId === caregiverId || i.caregiverEmail === caregiverEmail));

  const revokeInvite = (code) =>
    setInvites(prev => prev.filter(i => i.code !== code));

  return (
    <InviteContext.Provider value={{ invites, sendInvite, redeemInvite, getPatientInvites, getCaregiverPatients, revokeInvite }}>
      {children}
    </InviteContext.Provider>
  );
}

export const useInvite = () => useContext(InviteContext);
