'use client';

import React, { useState } from 'react';
import { Search, Calendar, Trophy, Bookmark, BookOpen, PenTool, AlertTriangle } from 'lucide-react';
import { Hackathon } from '@/app/actions';
import { HackathonCard } from './HackathonCard';
import { AddHackathonModal } from './AddHackathonModal';
import { EditHackathonModal } from './EditHackathonModal';
import { cn } from '@/lib/utils';

interface HackathonListProps {
    initialHackathons: Hackathon[];
}

export function HackathonList({ initialHackathons }: HackathonListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [sortBy, setSortBy] = useState<'DEADLINE' | 'PRIORITY' | 'STATUS'>('DEADLINE');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);

    // Smart sorting: non-expired first, then expired ones
    const sortedHackathons = [...initialHackathons].sort((a, b) => {
        // Always put expired hackathons at the end
        if (a.is_expired && !b.is_expired) return 1;
        if (!a.is_expired && b.is_expired) return -1;
        
        // Within same group (active or expired), sort by selected criteria
        switch (sortBy) {
            case 'DEADLINE':
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            case 'PRIORITY':
                const priorities = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
                return priorities[b.priority] - priorities[a.priority];
            case 'STATUS':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });

    const filteredHackathons = sortedHackathons
        .filter(h => filterStatus === 'ALL' || h.status === filterStatus)
        .filter(h => filterPriority === 'ALL' || h.priority === filterPriority)
        .filter(h => !searchTerm || h.title.toLowerCase().includes(searchTerm.toLowerCase()) || h.theme?.toLowerCase().includes(searchTerm.toLowerCase()));

    // Pagination
    const totalPages = Math.ceil(filteredHackathons.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHackathons = filteredHackathons.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus, filterPriority, sortBy]);

    // Stats
    const stats = {
        total: initialHackathons.length,
        planned: initialHackathons.filter(h => h.status === 'PLANNED').length,
        inProgress: initialHackathons.filter(h => h.status === 'IN_PROGRESS').length,
        submitted: initialHackathons.filter(h => h.status === 'SUBMITTED').length,
        won: initialHackathons.filter(h => h.status === 'WON').length,
    };

    return (
        <div className="min-h-screen w-full bg-paper-50 bg-paper-noise text-ink-900 font-sans selection:bg-accent-yellow/30 pb-20">

            {/* Decorative Top Border */}
            <div className="h-2 w-full bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 opacity-90"></div>

            {/* Navbar */}
            <nav className="sticky top-0 z-40 w-full border-b border-paper-300 bg-paper-50/95 backdrop-blur-sm shadow-sm transition-all md:h-20 h-auto py-4 md:py-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-ink-900 rounded-sm shadow-md transform -rotate-3 transition-transform hover:rotate-0">
                            <BookOpen size={24} className="text-paper-50" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-ink-900 tracking-tight leading-none">
                                Hack Pack
                            </h1>
                            <p className="text-xs font-serif italic text-ink-500">The Scholar's Strategy Journal</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="group relative flex items-center gap-2 bg-ink-900 text-paper-50 px-6 py-2.5 rounded-sm font-serif font-medium shadow-paper hover:shadow-lifted transition-all transform hover:-translate-y-0.5"
                    >
                        <span className="absolute inset-0 bg-white/10 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <PenTool size={16} />
                        <span className="relative">New Entry</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10 pb-6 border-b border-paper-300 border-dashed">
                    {[
                        { label: 'Total Entries', value: stats.total, icon: BookOpen, color: 'text-ink-900' },
                        { label: 'Planned', value: stats.planned, icon: Calendar, color: 'text-ink-500' },
                        { label: 'In Progress', value: stats.inProgress, icon: AlertTriangle, color: 'text-accent-yellow' },
                        { label: 'Submitted', value: stats.submitted, icon: Bookmark, color: 'text-accent-blue' },
                        { label: 'Victories', value: stats.won, icon: Trophy, color: 'text-green-700' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white/40 p-3 rounded-sm border border-paper-200 group hover:bg-white transition-colors">
                            <div className={`flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider ${stat.color}`}>
                                <stat.icon size={14} /> {stat.label}
                            </div>
                            <div className="text-2xl font-serif font-bold text-ink-900 pl-1">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-6 mb-10 items-end">
                    <div className="relative flex-1 group w-full">
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1 ml-1">Search Archives</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-ink-800 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Find a hackathon..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border-b-2 border-paper-300 focus:border-ink-900 px-4 py-3 pl-12 text-ink-900 placeholder-ink-400 focus:outline-none transition-all font-serif text-lg"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <div className="flex flex-col flex-1 md:flex-none">
                            <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1 ml-1">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-white border border-paper-300 px-4 py-2.5 rounded-sm text-ink-900 focus:ring-1 focus:ring-ink-900 focus:border-ink-900 focus:outline-none text-sm font-medium shadow-sm hover:border-ink-400 cursor-pointer"
                            >
                                <option value="ALL">All Status</option>
                                <option value="PLANNED">Planned</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="SUBMITTED">Submitted</option>
                                <option value="WON">Won</option>
                                <option value="LOST">Lost</option>

                            </select>
                        </div>

                        <div className="flex flex-col flex-1 md:flex-none">
                            <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1 ml-1">Priority</label>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="bg-white border border-paper-300 px-4 py-2.5 rounded-sm text-ink-900 focus:ring-1 focus:ring-ink-900 focus:border-ink-900 focus:outline-none text-sm font-medium shadow-sm hover:border-ink-400 cursor-pointer"
                            >
                                <option value="ALL">All Priority</option>
                                <option value="CRITICAL">Critical</option>
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>
                        </div>

                        <div className="flex flex-col flex-1 md:flex-none">
                            <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1 ml-1">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'DEADLINE' | 'PRIORITY' | 'STATUS')}
                                className="bg-white border border-paper-300 px-4 py-2.5 rounded-sm text-ink-900 focus:ring-1 focus:ring-ink-900 focus:border-ink-900 focus:outline-none text-sm font-medium shadow-sm hover:border-ink-400 cursor-pointer"
                            >
                                <option value="DEADLINE">Deadline</option>
                                <option value="PRIORITY">Priority</option>
                                <option value="STATUS">Status</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                {filteredHackathons.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed border-paper-300 rounded-lg">
                        <p className="text-2xl font-serif text-ink-900 mb-2">The pages are empty.</p>
                        <p className="text-ink-500 font-hand text-xl">Start a new chapter clearly...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedHackathons.map(hackathon => (
                                <HackathonCard
                                    key={hackathon.id}
                                    hackathon={hackathon}
                                    onEdit={setEditingHackathon}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12 pb-8">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-paper-200 text-ink-900 font-serif rounded-sm hover:bg-paper-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={cn(
                                                "w-10 h-10 font-serif font-bold rounded-sm transition-colors",
                                                currentPage === page
                                                    ? "bg-ink-900 text-paper-50"
                                                    : "bg-paper-200 text-ink-900 hover:bg-paper-300"
                                            )}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-paper-200 text-ink-900 font-serif rounded-sm hover:bg-paper-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Modals */}
            {isAddModalOpen && <AddHackathonModal onClose={() => setIsAddModalOpen(false)} />}
            {editingHackathon && <EditHackathonModal hackathon={editingHackathon} onClose={() => setEditingHackathon(null)} />}

        </div>
    );
}
