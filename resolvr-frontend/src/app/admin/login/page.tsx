"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // Explicitly track which portal the user is trying to access
  const [loginType, setLoginType] = useState<"client" | "admin">("client");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // NextAuth handles the secure connection to the backend
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      // Explicit routing based exactly on what they selected in the UI
      if (loginType === "admin") {
        router.push("/admin"); // Route to Super Admin Console
      } else {
        router.push("/dashboard"); // Route to Client Workspace
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full">
        
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-6 text-sm">Select your portal and log in to continue.</p>

        {/* The Portal Toggle */}
        <div className="grid grid-cols-2 gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setLoginType("client")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              loginType === "client"
                ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Client Portal
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              loginType === "admin"
                ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Super Admin
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-shadow" 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
            <input 
              type="password" 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-shadow" 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white font-semibold py-3 mt-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : `Log In to ${loginType === "admin" ? "Admin" : "Client"} Portal`}
          </button>
        </form>

        {loginType === "client" && (
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <Link href="/admin/register" className="text-blue-600 hover:underline font-medium">Sign up</Link>
          </p>
        )}
      </div>
    </div>
  );
}