'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from "../../components/ui/input";
import { Label } from '../../components/ui/label';
import { useRouter } from 'next/navigation';
import supabase from '../../../supabaseClient';
import bcrypt from 'bcryptjs';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch user data from the database
    const { data, error } = await supabase
      .from('testuser')
      .select('*')
      .eq('email', email)
      .single();

    // Check if the user exists
    if (error || !data) {
      setError("Invalid email or user not found.");
      return;
    }

    // Verify the password
    const isValidPassword = await bcrypt.compare(password, data.password_hash);
    if (!isValidPassword) {
      setError("Incorrect password.");
      return;
    }

    // Check if the account is approved
    if (data.approval_status !== "approved") {
      setError("Your account is not yet approved.");
      return;
    }

    // Route based on the user's role
    if (data.role === "student") {
      localStorage.setItem('studentId', data.id);
      router.push(`/pages/studentDashboard?id=${data.id}`);
    } else if (data.role === "manager") {
      localStorage.setItem('managerId', data.id);
      router.push(`/pages/managerDashboard?id=${data.id}`);
    } else {
      setError("Invalid role assigned to the user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <img 
        src="/nust-logo-.png"   
        alt="NUST Logo" 
        className="mx-auto h-[150px] w-auto"   />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Hostel Management System
        </h2>
        <h3 className="mt-2 text-center text-xl text-gray-600">
          Sign in to your account
        </h3>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md py-2"
            >
              Sign in
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/pages/studentRegister" className="text-indigo-600 hover:text-indigo-500">
              Create new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
