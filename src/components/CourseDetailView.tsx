import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCourse } from '../data/courseData';

export const CourseDetailView: React.FC = () => {
  const { selectedCourseId, setCurrentPage, setSelectedChapterId } = useApp();
  const course = getCourse(selectedCourseId);
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <button onClick={() => setCurrentPage('my-courses')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700"><ArrowLeft className="w-4 h-4" />My Courses</button>
      <section className="rounded-2xl bg-slate-900 text-white p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-300">{course.category}</p>
        <h1 className="text-3xl font-bold mt-2">{course.title}</h1>
        <p className="text-slate-300 mt-2 max-w-2xl">{course.description}</p>
        <div className="flex gap-5 text-sm text-slate-300 mt-5"><span>{course.level}</span><span>{course.duration}</span><span>{course.progress}% complete</span></div>
      </section>
      <div className="space-y-4">
        {course.modules.map((module, index) => (
          <section key={module.id} className="rounded-2xl bg-white border border-slate-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Module {index + 1}</p><h2 className="text-xl font-bold text-slate-900 mt-1">{module.title}</h2><p className="text-sm text-slate-500 mt-1">{module.description}</p>
            <div className="mt-4 divide-y divide-slate-100">{module.chapters.map((chapter) => <div key={chapter.id} className="flex items-center gap-3 py-3"><CheckCircle2 className={`w-5 h-5 ${chapter.completed ? 'text-emerald-500' : 'text-slate-300'}`} /><div className="flex-1"><h3 className="font-semibold text-slate-800">{chapter.title}</h3><p className="text-xs text-slate-500 mt-1">{chapter.summary}</p></div><span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400"><Clock3 className="w-3.5 h-3.5" />{chapter.durationMinutes} min</span><button onClick={() => { setSelectedChapterId(chapter.id); setCurrentPage('chapter-learning'); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-50">{chapter.completed ? 'Review' : 'Start'} <ArrowRight className="w-3.5 h-3.5" /></button></div>)}</div>
          </section>
        ))}
      </div>
    </div>
  );
};
