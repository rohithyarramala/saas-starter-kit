'use client';

import { Loading } from '@/components/shared';
import useOrganizations from 'hooks/useOrganizations';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import type { NextPageWithLayout } from 'types';
import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

/** =================== Types =================== */
interface Teacher {
  name: string;
  subject: string;
  classes: number;
  students: number;
}

interface Student {
  name: string;
  section: string;
  subjects: number;
}

const Dashboard: NextPageWithLayout = () => {
  /** =================== Hooks =================== */
  const { organizations, isLoading } = useOrganizations();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState(0);

  /** =================== Data (always define hooks first) =================== */
  const teacherData: Teacher[] = useMemo(
    () => [
      { name: 'Anjali Sharma', subject: 'Mathematics', classes: 12, students: 320 },
      { name: 'Rahul Mehta', subject: 'Physics', classes: 10, students: 280 },
      { name: 'Sneha Kapoor', subject: 'Chemistry', classes: 8, students: 240 },
    ],
    []
  );

  const studentData: Student[] = useMemo(
    () => [
      { name: 'Rohan Singh', section: 'A', subjects: 5 },
      { name: 'Meera Patel', section: 'B', subjects: 6 },
      { name: 'Aditya Kumar', section: 'A', subjects: 5 },
    ],
    []
  );

  const teacherColumns = useMemo<ColumnDef<Teacher>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'subject', header: 'Subject' },
      { accessorKey: 'classes', header: 'Classes' },
      { accessorKey: 'students', header: 'Students' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-green-600 text-white rounded text-xs">Edit</button>
            <button className="px-2 py-1 bg-red-600 text-white rounded text-xs">Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  const studentColumns = useMemo<ColumnDef<Student>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'section', header: 'Section' },
      { accessorKey: 'subjects', header: 'Subjects' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-green-600 text-white rounded text-xs">Edit</button>
            <button className="px-2 py-1 bg-red-600 text-white rounded text-xs">Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  /** =================== Early Returns =================== */
  if (isLoading || status === 'loading') return <Loading />;

  const org = organizations?.[0];
  const role = session?.user?.role || 'STUDENT';

  if (!org)
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-semibold">No organization found</h2>
        <a href="/organizations?newTeam=true" className="text-blue-600 underline">
          Create Organization
        </a>
      </div>
    );

  /** =================== Tabs =================== */
  const tabs: Record<string, string[]> = {
    ADMIN: ['Overview', 'Teachers', 'Students', 'Reports', 'Settings'],
    TEACHER: ['Classes', 'Evaluations', 'Uploads', 'Results'],
    STUDENT: ['Subjects', 'Assignments', 'Results', 'Progress'],
  };
  const userTabs = tabs[role as keyof typeof tabs] || [];

  /** =================== Render =================== */
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard — {org.name} ({role})
      </h1>

      {/* Tabs */}
      <div className="overflow-x-auto mb-6">
        <div className="flex space-x-2 md:space-x-4 min-w-max">
          {userTabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === idx
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        {role === 'ADMIN' && userTabs[activeTab] === 'Overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Teachers</p>
              <p className="text-2xl font-bold text-blue-700">42</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Students</p>
              <p className="text-2xl font-bold text-green-700">1,280</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Active Classes</p>
              <p className="text-2xl font-bold text-yellow-700">58</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Pending Evaluations</p>
              <p className="text-2xl font-bold text-red-700">14</p>
            </div>
          </div>
        )}

        {role === 'ADMIN' && userTabs[activeTab] === 'Teachers' && (
          <DataTable data={teacherData} columns={teacherColumns} />
        )}

        {role === 'ADMIN' && userTabs[activeTab] === 'Students' && (
          <DataTable data={studentData} columns={studentColumns} />
        )}

        {!(role === 'ADMIN' && ['Overview', 'Teachers', 'Students'].includes(userTabs[activeTab])) && (
          <p className="text-gray-600">
            Content for <span className="font-medium">{userTabs[activeTab]}</span> will go here.
          </p>
        )}
      </div>
    </div>
  );
};

/** =================== getStaticProps =================== */
export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Dashboard;
