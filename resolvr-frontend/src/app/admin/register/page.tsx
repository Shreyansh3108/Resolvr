"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", companyName: "", domain: "", email: "", password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // DEFENSIVE PARSING: Read raw text first
      const text = await res.text();

      if (!res.ok) {
        let errorMessage = "Something went wrong";
        try {
          // Attempt to parse standard backend error message
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If parsing fails, the backend is likely throwing HTML/404s or is offline
          errorMessage = `Backend Error ${res.status}: Check if localhost:5000 is running.`;
        }
        throw new Error(errorMessage);
      }

      // Registration successful! Send them to the login page.
      router.push("/admin/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Failed to connect to the backend server.");
    } finally {
      // This ensures the button NEVER gets stuck
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Create your Resolvr Account</h1>
        <p className="text-gray-500 mb-6 text-sm">Start building your custom AI agent.</p>

        {error && <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <input type="text" placeholder="Your Name" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-shadow" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="text" placeholder="Company Name (e.g., Galactic Tech)" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-shadow" 
            onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
          <input type="text" placeholder="Website Domain (e.g., galactic.com)" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-shadow" 
            onChange={(e) => setFormData({...formData, domain: e.target.value})} />
          <input type="email" placeholder="Email Address" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-shadow" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-shadow" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-3 mt-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link href="/admin/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}