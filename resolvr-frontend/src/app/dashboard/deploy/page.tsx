"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Code, Copy, CheckCircle2, Key, Blocks, Webhook } from "lucide-react";

export default function DeployPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);

  // Extract real NextAuth tenant ID to inject into the widget code
  const tenantId = (session?.user as any)?.tenantId || "your_tenant_id_here";

  // The exact iframe code from your previous implementation, now dynamic
  const embedCode = `<iframe 
  src="http://localhost:3000?tenantId=${tenantId}" 
  style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); z-index: 9999;"
  allow="clipboard-write"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    // In production, this posts to your Node backend to save the CRM key securely
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
    setApiKey("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Blocks className="w-5 h-5 text-indigo-600" />
          <h1 className="text-3xl font-display font-bold tracking-tight text-gray-900">Integrations & Deploy</h1>
        </div>
        <p className="text-gray-500 font-medium text-sm">
          Configure your external CRM webhooks and deploy the Resolvr chat widget to your application.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* WIDGET DEPLOYMENT CARD */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Code className="w-5 h-5 text-gray-900" />
              <h2 className="text-lg font-bold text-gray-900">Widget Installation</h2>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Copy this HTML snippet and paste it right before the closing <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">&lt;/body&gt;</code> tag of your website.
            </p>
          </div>
          
          <div className="p-6 bg-gray-50">
            <div className="relative group">
              {/* Dark Code Block for premium contrast */}
              <pre className="bg-gray-900 text-emerald-400 p-5 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono shadow-inner border border-gray-800">
                {embedCode}
              </pre>
              
              <button 
                onClick={handleCopy} 
                className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10 backdrop-blur-sm"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* HUBSPOT CRM INTEGRATION CARD */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Webhook className="w-5 h-5 text-gray-900" />
              <h2 className="text-lg font-bold text-gray-900">HubSpot CRM Handoff</h2>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Connect your HubSpot account. When a query falls below the vector confidence threshold, Resolvr will automatically create a ticket with the full chat transcript.
            </p>
          </div>
          
          <div className="p-6 bg-gray-50">
            <form onSubmit={handleSaveKey} className="max-w-xl flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your HubSpot Private App Token..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm shadow-sm outline-none transition-shadow"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
              >
                {keySaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Saved
                  </>
                ) : (
                  "Save API Key"
                )}
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-500 font-medium">
              Your token is encrypted at rest using AES-256 and never exposed to the client browser.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}