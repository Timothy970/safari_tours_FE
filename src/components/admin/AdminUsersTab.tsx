'use client';

import React from 'react';
import { Search, Phone } from 'lucide-react';
import { User } from '../../types';
import AdminPaginationBar from './AdminPaginationBar';

export interface AdminUsersTabProps {
  usersList: User[];
  searchUsers: string;
  setSearchUsers: (val: string) => void;
  selectedUserRole: string;
  setSelectedUserRole: (val: string) => void;
  usersPage: number;
  usersTotalPages: number;
  usersTotal: number;
  setUsersPage: (page: number) => void;
}

export default function AdminUsersTab({
  usersList,
  searchUsers,
  setSearchUsers,
  selectedUserRole,
  setSelectedUserRole,
  usersPage,
  usersTotalPages,
  usersTotal,
  setUsersPage,
}: AdminUsersTabProps) {
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      (u.full_name && u.full_name.toLowerCase().includes(searchUsers.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchUsers.toLowerCase())) ||
      (u.phone_number && u.phone_number.includes(searchUsers));

    if (selectedUserRole === 'all') return matchesSearch;
    return matchesSearch && u.role === selectedUserRole;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchUsers}
            onChange={(e) => setSearchUsers(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F1D36]"
          />
        </div>

        <select
          value={selectedUserRole}
          onChange={(e) => setSelectedUserRole(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
        >
          <option value="all">All Roles</option>
          <option value="customer">Travelers (Customer)</option>
          <option value="trip_leader">Trip Leaders / Guides</option>
          <option value="super_admin">Super Admins</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              <th className="py-3">Traveler Name</th>
              <th className="py-3">Email Address</th>
              <th className="py-3">Phone Number</th>
              <th className="py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 font-bold text-[#0F1D36]">{u.full_name || 'Safari Traveler'}</td>
                <td className="py-3.5 font-mono">{u.email}</td>
                <td className="py-3.5 font-mono">{u.phone_number || 'N/A'}</td>
                <td className="py-3.5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'super_admin'
                        ? 'bg-purple-100 text-purple-800'
                        : u.role === 'trip_leader'
                        ? 'bg-emerald-100 text-[#15803D]'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminPaginationBar
        currentPage={usersPage}
        totalPages={usersTotalPages}
        totalItems={usersTotal}
        onPageChange={setUsersPage}
        itemsLabel="users"
      />
    </div>
  );
}
