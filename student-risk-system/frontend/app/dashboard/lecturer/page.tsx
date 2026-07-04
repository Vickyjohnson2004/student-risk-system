'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueries } from '@tanstack/react-query';
import { fetchLecturerDashboard, fetchLecturerStudents } from '@/lib/api';

interface LecturerData {
  lecturerId: string;
  name: string;
  email: string;
  department: string;
  specialization: string;
  officeLocation?: string;
  officeHours?: string;
  bio?: string;
  qualifications?: string[];
  statistics: {
    totalStudentsAdvised: number;
    atRiskCount: number;
    coursesTeaching: number;
  };
  advisedStudents: any[];
  taughtCourses: any[];
}

interface StudentItem {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  level: string;
  riskLevel: string;
  currentGPA: number;
  attendancePercentage: number;
}

export default function LecturerDashboard() {
  const router = useRouter();
  const [dashboardQuery, studentsQuery] = useQueries({
    queries: [
      {
        queryKey: ['lecturerDashboard'],
        queryFn: fetchLecturerDashboard,
        retry: false
      },
      {
        queryKey: ['lecturerStudents'],
        queryFn: fetchLecturerStudents,
        retry: false
      }
    ]
  });

  useEffect(() => {
    if (dashboardQuery.error || studentsQuery.error) {
      router.push('/login');
    }
  }, [dashboardQuery.error, studentsQuery.error, router]);

  const lecturer = dashboardQuery.data?.data as LecturerData | undefined;
  const students = studentsQuery.data?.data?.students as StudentItem[] | undefined;
  const isLoading = dashboardQuery.isLoading || studentsQuery.isLoading;
  const studentsList = students ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!lecturer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No dashboard data available</p>
      </div>
    );
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {lecturer.name}!</h1>
          <p className="text-gray-600 mt-2">
            Lecturer ID: {lecturer.lecturerId} • {lecturer.department} • {lecturer.specialization}
          </p>
        </div>

        {/* Quick Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm mb-2">Total Students Advised</p>
            <p className="text-4xl font-bold text-blue-600">{lecturer.statistics.totalStudentsAdvised}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <p className="text-gray-600 text-sm mb-2">Students at Risk</p>
            <p className="text-4xl font-bold text-red-600">{lecturer.statistics.atRiskCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-600 text-sm mb-2">Courses Teaching</p>
            <p className="text-4xl font-bold text-green-600">{lecturer.statistics.coursesTeaching}</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Profile Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-semibold text-gray-900">{lecturer.email}</p>
            </div>
            {lecturer.officeLocation && (
              <div>
                <p className="text-gray-600 text-sm">Office Location</p>
                <p className="font-semibold text-gray-900">{lecturer.officeLocation}</p>
              </div>
            )}
            {lecturer.officeHours && (
              <div>
                <p className="text-gray-600 text-sm">Office Hours</p>
                <p className="font-semibold text-gray-900">{lecturer.officeHours}</p>
              </div>
            )}
            {lecturer.bio && (
              <div className="md:col-span-2">
                <p className="text-gray-600 text-sm">Bio</p>
                <p className="font-semibold text-gray-900">{lecturer.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Advised Students */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Your Advised Students</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 font-semibold text-gray-900">Student ID</th>
                  <th className="pb-3 font-semibold text-gray-900">Name</th>
                  <th className="pb-3 font-semibold text-gray-900">Level</th>
                  <th className="pb-3 font-semibold text-gray-900">Current GPA</th>
                  <th className="pb-3 font-semibold text-gray-900">Attendance</th>
                  <th className="pb-3 font-semibold text-gray-900">Risk Status</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.length > 0 ? (
                  studentsList.map((student) => (
                    <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-gray-600">{student.studentId}</td>
                      <td className="py-3 font-medium text-gray-900">{student.name}</td>
                      <td className="py-3 text-gray-600">Level {student.level}</td>
                      <td className="py-3 font-medium text-gray-900">{student.currentGPA.toFixed(2)}</td>
                      <td className="py-3 text-gray-600">{student.attendancePercentage.toFixed(1)}%</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadge(student.riskLevel)}`}>
                          {student.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-600">
                      No students advised yet
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
