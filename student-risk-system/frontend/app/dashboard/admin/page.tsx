'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueries } from '@tanstack/react-query';
import { fetchAdminDashboard, fetchAdminUsers, api } from '../../../lib/api';

interface AdminData {
  adminId: string;
  name: string;
  email: string;
  department: string;
  permissions: {
    canCreateUsers: boolean;
    canDeleteUsers: boolean;
    canEditSystem: boolean;
    canViewReports: boolean;
    canManageLecturers: boolean;
    canManageStudents: boolean;
  };
  statistics: {
    totalUsers: number;
    totalStudents: number;
    totalLecturers: number;
    totalAdmins: number;
    atRiskStudents: number;
    activeUsers: number;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [userFilter, setUserFilter] = useState('all');
  const [dashboardQuery, usersQuery] = useQueries({
    queries: [
      {
        queryKey: ['adminDashboard'],
        queryFn: fetchAdminDashboard,
        retry: false
      },
      {
        queryKey: ['adminUsers'],
        queryFn: fetchAdminUsers,
        retry: false
      }
    ]
  });

  useEffect(() => {
    if (dashboardQuery.error || usersQuery.error) {
      router.push('/login');
    }
  }, [dashboardQuery.error, usersQuery.error, router]);

  const admin = dashboardQuery.data?.data as AdminData | undefined;
  const users = usersQuery.data?.data?.users as User[] | undefined;
  const isLoading = dashboardQuery.isLoading || usersQuery.isLoading;

  const [usersList, setUsers] = useState<User[]>([]);

  // keep local usersList in sync with query result
  useEffect(() => {
    if (users) setUsers(users);
  }, [users]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      setUsers((prev) => prev.map(u => u._id === userId ? { ...u, isActive: !u.isActive } : u));
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Admin ID: {admin.adminId} • {admin.department}
          </p>
        </div>

        {/* Quick Statistics */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 text-xs mb-1">Total Users</p>
            <p className="text-2xl font-bold text-blue-600">{admin.statistics.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-600 text-xs mb-1">Active Users</p>
            <p className="text-2xl font-bold text-green-600">{admin.statistics.activeUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <p className="text-gray-600 text-xs mb-1">Students</p>
            <p className="text-2xl font-bold text-purple-600">{admin.statistics.totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <p className="text-gray-600 text-xs mb-1">Lecturers</p>
            <p className="text-2xl font-bold text-orange-600">{admin.statistics.totalLecturers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <p className="text-gray-600 text-xs mb-1">At-Risk Students</p>
            <p className="text-2xl font-bold text-red-600">{admin.statistics.atRiskStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
            <p className="text-gray-600 text-xs mb-1">Admins</p>
            <p className="text-2xl font-bold text-indigo-600">{admin.statistics.totalAdmins}</p>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Your Permissions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(admin.permissions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700 font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {value ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">User Management</h3>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="student">Students</option>
              <option value="lecturer">Lecturers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 font-semibold text-gray-900">Name</th>
                  <th className="pb-3 font-semibold text-gray-900">Email</th>
                  <th className="pb-3 font-semibold text-gray-900">Role</th>
                  <th className="pb-3 font-semibold text-gray-900">Status</th>
                  <th className="pb-3 font-semibold text-gray-900">Joined</th>
                  <th className="pb-3 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.length > 0 ? (
                  usersList.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="py-3 text-gray-600">{user.email}</td>
                      <td className="py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {admin.permissions.canDeleteUsers && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-800 font-semibold text-sm"
                            >
                              Delete
                            </button>
                          )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-600">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
