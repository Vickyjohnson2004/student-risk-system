'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchMlDatasetPredictions } from '../../../lib/api';

interface DatasetPredictionSummary {
  total: number;
  Low: number;
  Medium: number;
  High: number;
}

interface PredictionRow {
  attendancePercentage: number;
  assignmentAverage: number;
  quizAverage: number;
  midSemesterScore: number;
  previousGPA: number;
  currentGPA: number;
  studyHours: number;
  participation: number;
  libraryVisits: number;
  lateSubmissionCount: number;
  disciplinaryRecord: number;
  lmsActivity: number;
  courseLoad: number;
  sleepHours: number;
  stressLevel: number;
  predictedRisk: string;
  predictedProbability: number;
  confidence: number;
  actualRisk: string;
}

export default function MlDatasetPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ['mlDatasetPredictions'],
    queryFn: fetchMlDatasetPredictions,
    retry: false
  });

  useEffect(() => {
    if (error) router.push('/login');
  }, [error, router]);

  const summary = data?.data?.summary as DatasetPredictionSummary | undefined;
  const rows = data?.data?.rows as PredictionRow[] | undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading dataset predictions...</p>
        </div>
      </div>
    );
  }

  if (!summary || !rows) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700">Unable to load ML dataset predictions.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">UCID Dataset Predictions</h1>
          <p className="text-gray-600 mt-2">View model predictions and risk distribution for the UCID student dataset.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm mb-2">Dataset rows</p>
            <p className="text-4xl font-bold text-blue-600">{summary.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm mb-2">Predicted Medium Risk</p>
            <p className="text-4xl font-bold text-yellow-600">{summary.Medium}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
            <p className="text-gray-600 text-sm mb-2">Predicted High Risk</p>
            <p className="text-4xl font-bold text-red-600">{summary.High}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900">Prediction rows</h2>
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2 text-sm font-semibold text-slate-700">Risk</th>
                <th className="px-3 py-2 text-sm font-semibold text-slate-700">Prob.</th>
                <th className="px-3 py-2 text-sm font-semibold text-slate-700">Conf.</th>
                <th className="px-3 py-2 text-sm font-semibold text-slate-700">Actual</th>
                <th className="px-3 py-2 text-sm font-semibold text-slate-700">GPA</th>
                <th className="px-3 py-2 text-sm font-semibold text-slate-700">Attendance</th>
                <th className="px-3 py-2 text-sm font-semibold text-slate-700">Assignments</th>
                <th className="px-3 py-2 text-sm font-semibold text-slate-700">Stress</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 20).map((row, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-3 py-3 text-slate-900 font-semibold">{row.predictedRisk}</td>
                  <td className="px-3 py-3 text-slate-600">{row.predictedProbability}%</td>
                  <td className="px-3 py-3 text-slate-600">{row.confidence}%</td>
                  <td className="px-3 py-3 text-slate-600">{row.actualRisk}</td>
                  <td className="px-3 py-3 text-slate-600">{row.currentGPA.toFixed(2)}</td>
                  <td className="px-3 py-3 text-slate-600">{row.attendancePercentage.toFixed(1)}%</td>
                  <td className="px-3 py-3 text-slate-600">{row.assignmentAverage.toFixed(1)}%</td>
                  <td className="px-3 py-3 text-slate-600">{row.stressLevel.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-gray-500 mt-4">Showing the first 20 rows of the UCID prediction dataset.</p>
        </div>
      </div>
    </div>
  );
}
