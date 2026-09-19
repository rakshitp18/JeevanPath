import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Landing from './Landing';

export default function Signup() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const modalRole = roleParam === 'doctor' ? 'doctor' : 'patient';

  return <Landing initialAuthModal={true} initialAuthMode="signup" initialRole={modalRole} />;
}
