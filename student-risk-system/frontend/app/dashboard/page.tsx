'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      try {
        // Ask backend for current user (session cookie)
        const res = await getCurrentUser().catch(() => null);
        const user = res?.data?.user;
        if (!user) {
          // no session
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        // keep local copy
        localStorage.setItem('user', JSON.stringify(user));
        redirectByRole(user.role);
      } finally {
        setLoading(false);
      }
    };

    redirect();
  }, [router]);

  const redirectByRole = (role: string) => {
    switch (role) {
      case 'student':
        router.push('/dashboard/student');
        break;
      case 'lecturer':
        router.push('/dashboard/lecturer');
        break;
      case 'admin':
        router.push('/dashboard/admin');
        break;
      default:
        router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}
            <div>
              <h2 className="text-xl font-semibold text-white">Student predictions</h2>
              <p className="mt-2 text-sm text-slate-400">Latest risk categories from the prediction engine.</p>
            </div>
            <button className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400">Refresh data</button>
          </div>
          <div className="mt-8">
            <StudentTable />
          </div>
        </div>
      </div>
    </main>
  );
}
