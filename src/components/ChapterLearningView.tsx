import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getChapter, getCourse } from '../data/courseData';
import { ContentIssueReporter } from './ContentIssueReporter';

export const ChapterLearningView: React.FC = () => {
  const { selectedCourseId, selectedChapterId, setCurrentPage } = useApp();
  const course = getCourse(selectedCourseId);
  const chapter = getChapter(course, selectedChapterId);
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => setCurrentPage('course-detail')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700"><ArrowLeft className="w-4 h-4" />Back to course</button>
      <header><p className="text-xs font-bold uppercase tracking-wider text-blue-600">{course.title}</p><h1 className="text-3xl font-bold text-slate-900 mt-2">{chapter.title}</h1><p className="text-slate-600 mt-2 leading-7">{chapter.summary}</p></header>
      <section className="rounded-2xl bg-white border border-slate-200 p-6"><div className="flex items-center gap-2 text-blue-700 font-semibold"><Lightbulb className="w-5 h-5" />Learning objectives</div><ul className="mt-4 space-y-3">{chapter.lessons.map((lesson) => <li key={lesson} className="flex gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />Understand {lesson.toLowerCase()}</li>)}</ul></section>
      <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6"><h2 className="font-bold text-slate-900">Ready to practice?</h2><p className="text-sm text-slate-600 mt-1">Use this chapter's ideas in a short adaptive practice set when you are ready.</p><button onClick={() => setCurrentPage('practice')} className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Start practice <ArrowRight className="w-4 h-4" /></button></section>
      <ContentIssueReporter contentId={chapter.id} contentTitle={chapter.title} />
    </div>
  );
};
