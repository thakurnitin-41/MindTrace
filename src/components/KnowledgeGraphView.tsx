import React, { useState } from 'react';
import {
  GitFork,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GraphNode {
  id: string;
  name: string;
  category: string;
  x: number; // canvas coordinate %
  y: number;
  mastery: number;
  status: 'mastered' | 'proficient' | 'developing' | 'needs_attention';
  prerequisites: string[];
  riskNote?: string;
  isBottleneck?: boolean;
}

export const KnowledgeGraphView: React.FC = () => {
  const {
    topics,
    selectedGraphNodeId,
    setSelectedGraphNodeId,
    setCurrentPage,
    updateTopicMastery
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'all' | 'needs_attention' | 'mastered'>('all');

  // Defined layout coordinates for the directed acyclic graph (DAG)
  const nodes: GraphNode[] = [
    {
      id: 'arrays',
      name: 'Arrays',
      category: 'Linear Structures',
      x: 18,
      y: 22,
      mastery: topics.arrays?.mastery ?? 92,
      status: 'mastered',
      prerequisites: []
    },
    {
      id: 'searching',
      name: 'Searching',
      category: 'Algorithms',
      x: 42,
      y: 22,
      mastery: topics.searching?.mastery ?? 81,
      status: 'proficient',
      prerequisites: ['arrays']
    },
    {
      id: 'recursion',
      name: 'Recursion',
      category: 'Algorithmic Paradigm',
      x: 28,
      y: 68,
      mastery: topics.recursion?.mastery ?? 42,
      status: 'needs_attention',
      prerequisites: [],
      isBottleneck: true,
      riskNote: 'Primary root blocker for recursive divide-and-conquer & tree traversal algorithms.'
    },
    {
      id: 'binary_search',
      name: 'Binary Search',
      category: 'Divide & Conquer',
      x: 62,
      y: 35,
      mastery: topics.binary_search?.mastery ?? 63,
      status: 'developing',
      prerequisites: ['searching', 'recursion']
    },
    {
      id: 'trees',
      name: 'Binary Trees',
      category: 'Hierarchical Structures',
      x: 55,
      y: 68,
      mastery: topics.trees?.mastery ?? 79,
      status: 'proficient',
      prerequisites: ['recursion']
    },
    {
      id: 'bst',
      name: 'Binary Search Trees (BST)',
      category: 'Non-Linear Structures',
      x: 82,
      y: 48,
      mastery: topics.bst?.mastery ?? 43,
      status: 'needs_attention',
      prerequisites: ['binary_search', 'trees', 'recursion'],
      riskNote: 'Recursion weakness may be affecting BST problem-solving.'
    },
    {
      id: 'advanced_trees',
      name: 'Advanced Trees (AVL)',
      category: 'Self-Balancing',
      x: 94,
      y: 75,
      mastery: topics.advanced_trees?.mastery ?? 25,
      status: 'needs_attention',
      prerequisites: ['bst'],
      riskNote: 'Currently blocked until BST and Recursion reach Proficient.'
    }
  ];

  // Prerequisite directed edges
  const edges: { from: string; to: string; isRiskPath?: boolean }[] = [
    { from: 'arrays', to: 'searching' },
    { from: 'searching', to: 'binary_search' },
    { from: 'recursion', to: 'binary_search', isRiskPath: true },
    { from: 'recursion', to: 'trees', isRiskPath: true },
    { from: 'recursion', to: 'bst', isRiskPath: true },
    { from: 'binary_search', to: 'bst' },
    { from: 'trees', to: 'bst' },
    { from: 'bst', to: 'advanced_trees' }
  ];

  const selectedNode = nodes.find((n) => n.id === selectedGraphNodeId) || nodes[5]; // defaults to BST

  const getStatusBadge = (status: GraphNode['status']) => {
    switch (status) {
      case 'mastered':
        return { label: 'Mastered', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'proficient':
        return { label: 'Proficient', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
      case 'developing':
        return { label: 'Developing', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'needs_attention':
        return { label: 'Needs Attention', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
    }
  };

  const filteredNodes = nodes.filter((n) => {
    if (filterMode === 'needs_attention') return n.status === 'needs_attention';
    if (filterMode === 'mastered') return n.status === 'mastered' || n.status === 'proficient';
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-100 text-blue-700">
              <GitFork className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Knowledge Graph
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Prerequisite Flow
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Displaying topological dependencies between DSA concepts and upstream risk propagation.
          </p>
        </div>

        {/* Legend / Filter Chips */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Topics
          </button>
          <button
            onClick={() => setFilterMode('needs_attention')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              filterMode === 'needs_attention'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
            }`}
          >
            Needs Attention
          </button>
          <button
            onClick={() => setFilterMode('mastered')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              filterMode === 'mastered'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            Proficient+
          </button>
        </div>
      </div>

      {/* Main Canvas & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Graph Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative min-h-[520px] flex flex-col justify-between overflow-hidden">
          {/* Canvas Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          ></div>

          {/* Floating Zoom / Reset Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Vector Prerequisite Arrows */}
          <div
            className="relative w-full h-[460px] transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
                </marker>
                <marker
                  id="arrow-risk"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ec4899" />
                </marker>
              </defs>

              {edges.map((edge, i) => {
                const srcNode = nodes.find((n) => n.id === edge.from);
                const dstNode = nodes.find((n) => n.id === edge.to);
                if (!srcNode || !dstNode) return null;

                const isConnectedToSelected =
                  selectedGraphNodeId === edge.from || selectedGraphNodeId === edge.to;

                return (
                  <line
                    key={i}
                    x1={`${srcNode.x}%`}
                    y1={`${srcNode.y}%`}
                    x2={`${dstNode.x}%`}
                    y2={`${dstNode.y}%`}
                    stroke={edge.isRiskPath ? '#ec4899' : isConnectedToSelected ? '#3b82f6' : '#cbd5e1'}
                    strokeWidth={edge.isRiskPath ? 2.5 : isConnectedToSelected ? 2 : 1.5}
                    strokeDasharray={edge.isRiskPath ? '4 3' : undefined}
                    markerEnd={edge.isRiskPath ? 'url(#arrow-risk)' : 'url(#arrow-default)'}
                    className="transition-colors duration-200"
                  />
                );
              })}
            </svg>

            {/* Interactive Graph Node Elements */}
            {filteredNodes.map((node) => {
              const isSelected = selectedGraphNodeId === node.id;
              const statusBadge = getStatusBadge(node.status);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedGraphNodeId(node.id)}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute cursor-pointer transition-all duration-200 select-none ${
                    isSelected ? 'z-30 scale-110' : 'z-10 hover:scale-105'
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl border transition-all text-left shadow-xs ${
                      isSelected
                        ? 'border-blue-600 bg-white ring-4 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`}></span>
                      <span className="text-xs font-bold text-slate-900 tracking-tight">
                        {node.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-[11px]">
                      <span className="text-slate-500">{node.category}</span>
                      <span className="font-extrabold text-slate-800">{node.mastery}%</span>
                    </div>

                    {node.isBottleneck && (
                      <div className="mt-1.5 flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                        <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                        <span>Root Blocker</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom helper tip */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Pink dashed arrows indicate propagating prerequisite risk
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Click node for deep trace</span>
          </div>
        </div>

        {/* Selected Node Side Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header info */}
            <div className="border-b border-slate-100 pb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Node Diagnostic Inspector
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">{selectedNode.name}</h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    getStatusBadge(selectedNode.status).bg
                  }`}
                >
                  {getStatusBadge(selectedNode.status).label}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{selectedNode.category}</div>
            </div>

            {/* Mastery Meter */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Mastery Level</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {selectedNode.mastery}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedNode.mastery >= 80
                      ? 'bg-emerald-500'
                      : selectedNode.mastery >= 60
                      ? 'bg-blue-500'
                      : selectedNode.mastery >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${selectedNode.mastery}%` }}
                ></div>
              </div>
            </div>

            {/* Prerequisites List */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Prerequisites Breakdown
              </div>
              {selectedNode.prerequisites.length === 0 ? (
                <div className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                  Foundational topic. No upstream prerequisites in this module.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedNode.prerequisites.map((prereqId) => {
                    const prereqNode = nodes.find((n) => n.id === prereqId);
                    if (!prereqNode) return null;
                    const isWeak = prereqNode.mastery < 60;

                    return (
                      <div
                        key={prereqId}
                        onClick={() => setSelectedGraphNodeId(prereqId)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isWeak
                            ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50'
                            : 'border-slate-100 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                            {isWeak && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                            {prereqNode.name}
                          </div>
                          <div className="text-[10px] text-slate-500">{prereqNode.category}</div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-xs font-bold ${
                              isWeak ? 'text-rose-700' : 'text-slate-800'
                            }`}
                          >
                            {prereqNode.mastery}%
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {prereqNode.mastery >= 80 ? 'Solid' : isWeak ? 'Gap' : 'Fair'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detected Risk Box per Prompt */}
            {selectedNode.riskNote && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Detected Risk
                </div>
                <p className="leading-relaxed text-amber-800">{selectedNode.riskNote}</p>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setCurrentPage('practice')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>View Intervention</span>
            </button>
            <button
              onClick={() => setCurrentPage('tutor')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Discuss {selectedNode.name} with AI Tutor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
