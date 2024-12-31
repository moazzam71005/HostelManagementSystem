"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useRouter } from "next/navigation";
import supabase from "../../../supabaseClient";
import bcrypt from "bcryptjs";
import Image from 'next/image';
import {Eye, EyeOff} from 'lucide-react';
//import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Updated for Heroicons v2

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch user data from the database
    const { data, error } = await supabase
      .from("testuser")
      .select("*")
      .eq("email", email)
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
      localStorage.setItem("studentId", data.id);
      router.push(`/pages/studentDashboard?id=${data.id}`);
    } else if (data.role === "manager") {
      localStorage.setItem("managerId", data.id);
      router.push(`/pages/managerDashboard?id=${data.id}`);
    } else {
      setError("Invalid role assigned to the user.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(to right,rgb(250, 250, 250), #ccffff)",
        color: "#fff",
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          src="/nust-logo-.png"
          alt="NUST Logo"
          className="mx-auto h-[150px] w-auto"
        />
        <h2
          className="mt-6 text-center text-3xl font-bold text-black"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Hostel Management System

        </h2>

        <h3 className="mt-2 text-center text-xl text-gray-500">
          Sign in to your account
        </h3>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white/50 p-6 rounded-2xl shadow-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
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
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-gray-900"
            />
          </div>
          <div className="relative">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 pr-10 text-gray-900"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </span>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-700 text-white font-medium rounded-md py-2 transition-all duration-200 ease-in-out transform hover:scale-105"          >
            Sign in
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link
            href="/pages/studentRegister"
            className="text-blue-600 hover:text-blue-500 font-medium transition duration-300 ease-in-out transform hover:scale-105"
          >
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
}
