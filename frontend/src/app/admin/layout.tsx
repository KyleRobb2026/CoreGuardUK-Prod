'use client';

import React from 'react';
import { SubscriptionProvider } from '../../components/SubscriptionProvider';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SubscriptionProvider>
      {children}
    </SubscriptionProvider>
  );
}
