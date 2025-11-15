
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Profile = {
  name: string;
  state: string;
  district: string;
  cityVillage: string;
  phone: string;
  email: string;
  avatar: string;
  farmName: string;
  farmSize: string;
  mainCrop: string;
  darkMode: boolean;
};

type ProfileContextType = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const initialProfile: Profile = {
  name: 'Ramesh Kumar',
  state: 'Maharashtra',
  district: 'Washim',
  cityVillage: 'Washim',
  phone: '+91-9876543210',
  email: 'ramesh@example.com',
  avatar: 'https://picsum.photos/seed/farmer_profile/200/200',
  farmName: 'Kumar Agro Farm',
  farmSize: '15',
  mainCrop: 'Soybean',
  darkMode: false,
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
