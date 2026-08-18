'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api/auth';

export default function ProfilePage() {
  const { user } = useAuth();

  const fullName = user?.full_name ?? 'Not set';
  const email = user?.email ?? 'Not set';
  const initial = (user?.full_name?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters');
      return;
    }

    setPwLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setPwSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-[700px]">
      {/* Header */}
      <h1 className="text-[24px] font-extrabold text-black mb-6">My Profile</h1>

      {/* Profile Card */}
      <div className="rounded-2xl p-6 mb-5" style={{ border: '1px solid #D9D9D9' }}>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white font-bold text-[28px] shrink-0" style={{ backgroundColor: '#3008F8' }}>
            {initial}
          </div>
          <div>
            <h2 className="text-[20px] font-extrabold text-black">{fullName}</h2>
            <p className="text-[14px] text-gray-500">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#F5F3FF' }}>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
            <p className="text-[15px] font-semibold text-black">{fullName}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#F5F3FF' }}>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1">Email</p>
            <p className="text-[15px] font-semibold text-black">{email}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#F5F3FF' }}>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1">User ID</p>
            <p className="text-[15px] font-semibold text-black">#{user?.id ?? '—'}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#F5F3FF' }}>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1">Member Since</p>
            <p className="text-[15px] font-semibold text-black">{memberSince}</p>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="rounded-2xl p-6" style={{ border: '1px solid #D9D9D9' }}>
        <h2 className="text-[19px] font-extrabold text-black mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-semibold text-gray-600 mb-1 block">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#D9D9D9] text-[14px] text-black outline-none focus:border-[#3008F8] transition-colors"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-gray-600 mb-1 block">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#D9D9D9] text-[14px] text-black outline-none focus:border-[#3008F8] transition-colors"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-gray-600 mb-1 block">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#D9D9D9] text-[14px] text-black outline-none focus:border-[#3008F8] transition-colors"
            />
          </div>

          {pwError && (
            <p className="text-[13px] font-semibold text-red-500">{pwError}</p>
          )}
          {pwSuccess && (
            <p className="text-[13px] font-semibold text-green-600">{pwSuccess}</p>
          )}

          <button
            type="submit"
            disabled={pwLoading}
            className="self-start px-6 py-3 rounded-xl font-bold text-[14px] text-white transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#3008F8' }}
          >
            {pwLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
