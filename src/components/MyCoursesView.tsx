import React from 'react';
import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEEDED_COURSES } from '../data/courseData';

export const MyCoursesView: React.FC = () => {
  const { setCurrentPage, setSelectedCourseId } = useApp();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Your library</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">My Courses</h1>
        <p className="text-sm text-slate-500 mt-1">Pick up where you left off or explore your recommended learning paths.</p>
      </header>
      <div className="grid md:grid-cols-2 gap-5">
        {SEEDED_COURSES.map((course) => (
          <article key={course.id} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="p-3 rounded-xl bg-blue-50"><BookOpen className="w-6 h-6 text-blue-600" /></div>
              <span className="text-xs font-semibold text-slate-500">{course.level}</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mt-5">{course.category}</p>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{course.title}</h2>
            <p className="text-sm text-slate-600 mt-2 leading-6">{course.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-4"><span className="inline-flex items-center gap-1"><Clock3 className="w-4 h-4" />{course.duration}</span><span>{course.progress}% complete</span></div>
            <div className="h-2 rounded-full bg-slate-100 mt-3"><div className="h-full rounded-full bg-blue-600" style={{ width: `${course.progress}%` }} /></div>
            <button onClick={() => { setSelectedCourseId(course.id); setCurrentPage('course-detail'); }} className="mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">View course <ArrowRight className="w-4 h-4" /></button>
          </article>
        ))}
      </div>
    </div>
  );
};
