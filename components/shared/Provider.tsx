"use client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from 'react';

interface ProviderProps {
  children: ReactNode; // ReactNode is the type for anything that can be rendered
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <SessionProvider>{children}</SessionProvider>
  );
};

export default Provider;
