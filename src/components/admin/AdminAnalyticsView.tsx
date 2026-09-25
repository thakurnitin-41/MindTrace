import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Layers,
  Clock,
  Target,
  Sparkles,
  School,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminAnalyticsView: React.FC = () => {
  const { students } = useApp();

  const totalStudents = students.length;

  const conceptBottlenecks = [
    {
      concept: 'Recursion Call Stack & Invariant Return',
      category: 'Data Structures',
      affectedCount: 3,
      percentage: 50,
      severity: 'Critical',
      commonTrap: 'Global state mutation instead of return value unwinding',
      rescueRecommendation: 'Step-by-step memory frame execution visualizer'
    },
    {
      concept: 'BST Range Bounds Propagation (min, max)',
      category: 'Trees',
      affectedCount: 2,
      percentage: 33,
      severity: 'Moderate',
      commonTrap: 'Local immediate child comparison instead of entire subtree invariant',
      rescueRecommendation: 'Subtree validation counterexample suite'
    },
    {
      concept: 'Graph BFS Visited Set Enque Timing',
      category: 'Graphs',
      affectedCount: 2,
      percentage: 33,
      severity: 'Moderate',
      commonTrap: 'Adding to visited set on dequeue instead of immediately upon enqueue',
      rescueRecommendation: 'Duplicate node enque animation tracer'
    },
    {
      concept: 'Dynamic Programming State Tuple Overlap',
      category: 'Algorithms',
      affectedCount: 1,
      percentage: 17,
      severity: 'Low',
      commonTrap: 'Confusing index parameter with running sum in memo key',
      rescueRecommendation: 'DAG topological state mapping sprint'
    }
  ];

  const campusBreakdown = [
    {
      name: 'Indian Institute of Technology Bombay',
      studentsCount: 2,
      avgMastery: 84,
      riskStudents: 0
    },
    {
      name: 'Delhi Technological University',
      studentsCount: 1,
      avgMastery: 42,
      riskStudents: 1
    },
    {
      name: 'BITS Pilani',
      studentsCount: 1,
      avgMastery: 68,
      riskStudents: 0
    },
    {
      name: 'NIT Trichy',
      studentsCount: 1,
      avgMastery: 74,
      riskStudents: 0
    },
    {
      name: 'IIIT Hyderabad',
      studentsCount: 1,
      avgMastery: 89,
      riskStudents: 0
    }
  ];

  return (
    <div id="admin-analytics-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Cognitive Diagnostics & Pedagogy
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          Cohort Diagnostic Analytics
        </h1>
        <p className="text-sm text-gray-600 mt-0.5">
          Aggregate analysis of algorithmic misconceptions, prerequisite chain failures, and institutional performance metrics.
        </p>
      </div>

      {/* Prerequisite Bottlenecks Grid */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Prerequisite Dependency Chain Bottlenecks
            </h3>
            <p className="text-xs text-gray-500">
              Identified breakdown points in foundational mental models across enrolled students
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conceptBottlenecks.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${
                item.severity === 'Critical'
                  ? 'border-rose-200 bg-rose-50/40'
                  : item.severity === 'Moderate'
                  ? 'border-amber-200 bg-amber-50/40'
                  : 'border-gray-200 bg-gray-50/50'
              } space-y-2`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-gray-500">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">{item.concept}</h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.severity === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : item.severity === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {item.severity}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Affected Students: {item.affectedCount} / {totalStudents}</span>
                  <span className="font-bold">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      item.severity === 'Critical'
                        ? 'bg-rose-500'
                        : item.severity === 'Moderate'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200/60 text-xs space-y-1">
                <p className="text-gray-700">
                  <strong className="text-gray-900">Cognitive Trap:</strong> {item.commonTrap}
                </p>
                <p className="text-indigo-700 font-medium">
                  <strong>Recommended Prescription:</strong> {item.rescueRecommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Benchmarking */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 text-base mb-1 flex items-center gap-2">
          <School className="w-5 h-5 text-indigo-600" />
          Partner Institutional Benchmarking
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Comparative performance and risk triage across participating colleges and universities
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                <th className="pb-3">Institution</th>
                <th className="pb-3">Cohort Size</th>
                <th className="pb-3">Average Mastery</th>
                <th className="pb-3">Intervention Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {campusBreakdown.map((campus, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-semibold text-gray-900">{campus.name}</td>
                  <td className="py-3">{campus.studentsCount} Students</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{campus.avgMastery}%</span>
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${campus.avgMastery}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    {campus.riskStudents > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-semibold">
                        {campus.riskStudents} Requires Rescue Sprint
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                        All Learners On Track
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
