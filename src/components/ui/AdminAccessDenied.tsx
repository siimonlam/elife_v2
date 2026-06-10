import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AdminAccessDenied() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7 text-amber-500" />
        </div>
        <h1 className="font-bold text-gray-900 text-xl mb-2">Admin access required</h1>
        <p className="text-gray-500 text-sm mb-6">
          You are signed in, but this account is not an administrator, so the
          admin panel cannot be shown.
        </p>
        <p className="text-gray-400 text-xs mb-6 leading-relaxed">
          If no admin account exists yet, create one on the setup page. Otherwise
          sign in with an account that has admin rights, or ask an administrator
          to grant access.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="/setup"
            className="inline-block bg-forest-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-forest-600 transition-colors text-sm"
          >
            Create / set up admin account
          </a>
          <a
            href="/login"
            className="inline-block text-forest-600 font-semibold text-sm hover:underline"
          >
            Sign in with a different account
          </a>
          <a
            href="/"
            className="inline-block text-gray-400 text-sm hover:underline"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
