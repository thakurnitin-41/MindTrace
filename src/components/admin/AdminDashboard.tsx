import React from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Brain,
  Activity,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
  Send,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentProfile } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    activeAdmin,
    setCurrentPage,
    assignStudentIntervention,
    auditLogs
  } = useApp();

  const totalStudents = students.length;
  const criticalStudents = students.filter((s) => s.riskLevel === 'critical');
  const moderateStudents = students.filter((s) => s.riskLevel === 'moderate');
  const onTrackStudents = students.filter((s) => s.riskLevel === 'low');

  const pendingRequestsCount = students.filter(
    (s) => s.dataAccessStatus === 'pending'
  ).length;

  const grantedRequestsCount = students.filter(
    (s) => s.dataAccessStatus === 'granted'
  ).length;

  const avgMastery = Math.round(
    students.reduce((acc, s) => acc + (s.masteryScore || 65), 0) / (totalStudents || 1)
  );

  const activeTodayCount = students.filter((s) => (s.currentStreak || 0) >= 1).length;

  return (
    <div id="admin-dashboard-view" className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Institutional Executive Oversight
              </span>
              <span className="text-xs text-gray-500">
                {activeAdmin?.institution || 'Academic Partner Campus'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              Welcome back, {activeAdmin?.name || 'Administrator'}
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Monitoring cohort cognitive mastery, prerequisite gap remediation, and data disclosure clearances.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('admin-students')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Explore Student Cohort</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Role-Specific Responsibilities & Purview Spotlight */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Role Focus: {activeAdmin?.roleTitle || activeAdmin?.role.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Mandate Active
            </span>
          </div>

          <h3 className="text-base font-bold text-white">
            {activeAdmin?.role === 'dean' && 'Institutional Accreditation & Academic Compliance'}
            {activeAdmin?.role === 'department_head' && 'Curriculum Cognitive Diagnostics & Prerequisite Bottlenecks'}
            {activeAdmin?.role === 'faculty_lead' && 'Direct Student Mentorship & Diagnostic Autopsy Remediation'}
            {activeAdmin?.role === 'academic_advisor' && 'Career Placement Readiness & At-Risk Mentoring'}
            {activeAdmin?.role === 'system_admin' && 'Security Governance, MFA PINs & Access Clearance'}
          </h3>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {activeAdmin?.role === 'dean' &&
              'Review FERPA data disclosures, cross-department academic standing, and official student accreditation milestones.'}
            {activeAdmin?.role === 'department_head' &&
              'Monitor Recursion and Tree bottleneck dependencies across student cohorts and authorize faculty interventions.'}
            {activeAdmin?.role === 'faculty_lead' &&
              'Conduct granular student question autopsies, trace misconception archetypes, and assign 15-minute rescue sandboxes.'}
            {activeAdmin?.role === 'academic_advisor' &&
              'Track Tier-1 FAANG and placement test benchmarks, flag early drop-off risks, and coordinate peer study buddy cohorts.'}
            {activeAdmin?.role === 'system_admin' &&
              'Manage institutional access keys, enforce MFA security PINs, and audit administrative event trails.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() =>
              setCurrentPage(
                activeAdmin?.role === 'dean' || activeAdmin?.role === 'system_admin'
                  ? 'admin-audit'
                  : activeAdmin?.role === 'department_head'
                  ? 'admin-analytics'
                  : 'admin-students'
              )
            }
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Access Role Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cohort Size</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{totalStudents}</span>
            <span className="text-xs font-medium text-emerald-600">Enrolled Learners</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Across 6 Partner Institutions</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Average Mastery</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{avgMastery}%</span>
            <span className="text-xs font-medium text-indigo-600">+4.2% this sprint</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${avgMastery}%` }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Daily Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{activeTodayCount} / {totalStudents}</span>
            <span className="text-xs font-medium text-amber-600">Logged Today</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Streak retention rate: 83%</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Risk Triage</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{criticalStudents.length}</span>
            <span className="text-xs font-medium text-rose-600">Needs Rescue Sprint</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {moderateStudents.length} moderate, {onTrackStudents.length} stable
          </p>
        </div>
      </div>

      {/* Cohort Diagnostic Root Gap Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Root Gap Heatmap */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                Diagnosed Root Gap Clusters
              </h3>
              <p className="text-xs text-gray-500">
                Cognitive bottlenecks surfaced across student diagnostic autopsies
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('admin-analytics')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Cluster 1 */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-rose-900 font-bold">
                  Call Stack Unwinding & Base Case Mutation
                </span>
                <span className="text-rose-700 px-2 py-0.5 rounded-full bg-rose-100">
                  42% of Cohort Afflicted (High Urgency)
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Learners confuse frame return value propagation with in-place global variable updates.
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>Affected: Rohan Mehta, Vikram Patel</span>
                <span className="font-medium text-indigo-700">Prescription: Visual Trace Sandbox</span>
              </div>
            </div>

            {/* Cluster 2 */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-amber-900 font-bold">
                  BST Range Invariant Bounds Propagation
                </span>
                <span className="text-amber-800 px-2 py-0.5 rounded-full bg-amber-100">
                  28% of Cohort Afflicted
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Learners check local parent-child inequality but fail to propagate (min, max) ancestors.
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>Affected: Ananya Gupta</span>
                <span className="font-medium text-indigo-700">Prescription: Subtree Bounds Drill</span>
              </div>
            </div>

            {/* Cluster 3 */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-gray-900 font-bold">
                  Graph Visited Set vs Duplicate Queue Push
                </span>
                <span className="text-gray-700 px-2 py-0.5 rounded-full bg-gray-200">
                  18% of Cohort Afflicted
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Learners mark nodes as visited at deque time rather than at enque time, causing duplicate memory leaks.
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>Affected: Priya Sharma</span>
                <span className="font-medium text-indigo-700">Prescription: BFS Queue Invariant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Data Privacy Safeguards & Clearance Status */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900 text-base">Privacy & Consent Status</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Governance safeguards ensuring student confidential records remain protected under DPDP & FERPA.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <div>
                  <span className="font-semibold text-gray-900 block">Masked & Protected</span>
                  <span className="text-gray-500 text-[11px]">Necessary academic metrics only</span>
                </div>
                <span className="font-bold text-gray-800 text-sm">
                  {students.filter((s) => s.dataAccessStatus === 'restricted').length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <div>
                  <span className="font-semibold text-amber-900 block">Pending Student Consent</span>
                  <span className="text-amber-700 text-[11px]">Clearance requests awaiting student review</span>
                </div>
                <span className="font-bold text-amber-800 text-sm">{pendingRequestsCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div>
                  <span className="font-semibold text-emerald-900 block">Full Disclosure Granted</span>
                  <span className="text-emerald-700 text-[11px]">Full contact & question autopsy unmasked</span>
                </div>
                <span className="font-bold text-emerald-800 text-sm">{grantedRequestsCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage('admin-audit')}
              className="w-full py-2 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4 text-gray-500" />
              <span>Inspect Institutional Audit Trail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Priority Student Triage Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-600" />
              Priority Cohort Monitoring
            </h3>
            <p className="text-xs text-gray-500">
              Students identified with immediate misconception intervention needs
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('admin-students')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All {totalStudents} Students</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-1">Student Learner</th>
                <th className="pb-3">Institution & Exam</th>
                <th className="pb-3">Mastery & Streak</th>
                <th className="pb-3">Primary Root Gap</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3">Privacy Clearance</th>
                <th className="pb-3 text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {students.slice(0, 5).map((student) => {
                const isCritical = student.riskLevel === 'critical';
                const isModerate = student.riskLevel === 'moderate';

                return (
                  <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 pl-1">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{student.name}</p>
                          <p className="text-[11px] text-gray-400">{student.degree}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <p className="font-medium text-gray-900 truncate max-w-[160px]">
                        {student.institution}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                        {student.targetExam}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        <span>{student.masteryScore}%</span>
                        <span className="text-gray-400 font-normal">/</span>
                        <span className="text-amber-600 flex items-center text-[11px]">
                          <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {student.currentStreak}d
                        </span>
                      </div>
                      <div className="w-20 bg-gray-100 rounded-full h-1 mt-1">
                        <div
                          className="bg-indigo-600 h-1 rounded-full"
                          style={{ width: `${student.masteryScore}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5">
                      <p className="font-medium text-gray-800 truncate max-w-[180px]">
                        {student.primaryRootGap}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {student.misconceptionArchetype}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : isModerate
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isCritical ? 'Critical Alert' : isModerate ? 'Moderate' : 'On Track'}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-[10px] ${
                          student.dataAccessStatus === 'granted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : student.dataAccessStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {student.dataAccessStatus === 'granted'
                          ? 'Consent Granted'
                          : student.dataAccessStatus === 'pending'
                          ? 'Consent Pending'
                          : 'Masked (Privacy)'}
                      </span>
                    </td>

                    <td className="py-3.5 text-right pr-1">
                      <button
                        onClick={() => {
                          setCurrentPage('admin-students');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 font-medium text-xs transition-colors"
                      >
                        Inspect Record
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
