import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, Trophy, Calendar, AlertTriangle, Search, X, Feather, PenTool, BookOpen, Bookmark } from 'lucide-react';
import type { Hackathon } from './types';

const App: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Load hackathons from database
  useEffect(() => {
    loadHackathons();
  }, []);

  const loadHackathons = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/hackathons');
      const data = await response.json();
      setHackathons(data);
    } catch (error) {
      console.error('Failed to load hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHackathon = async (data: Omit<Hackathon, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await fetch('http://localhost:3002/api/hackathons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      await loadHackathons();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add hackathon:', error);
    }
  };

  const updateStatus = async (id: string, status: Hackathon['status']) => {
    try {
      await fetch(`http://localhost:3002/api/hackathons/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      await loadHackathons();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const deleteHackathon = async (id: string) => {
    if (!confirm('Tear this page from your journal?')) return;
    
    try {
      await fetch(`http://localhost:3002/api/hackathons/${id}`, {
        method: 'DELETE'
      });
      await loadHackathons();
    } catch (error) {
      console.error('Failed to delete hackathon:', error);
    }
  };

  const filteredHackathons = hackathons
    .filter(h => filterStatus === 'ALL' || h.status === filterStatus)
    .filter(h => filterPriority === 'ALL' || h.priority === filterPriority)
    .filter(h => !searchTerm || h.title.toLowerCase().includes(searchTerm.toLowerCase()) || h.theme?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const stats = {
    total: hackathons.length,
    planned: hackathons.filter(h => h.status === 'PLANNED').length,
    inProgress: hackathons.filter(h => h.status === 'IN_PROGRESS').length,
    registered: hackathons.filter(h => h.status === 'REGISTERED').length,
    won: hackathons.filter(h => h.status === 'WON').length,
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      CRITICAL: 'text-accent-red border-accent-red bg-accent-red/5',
      HIGH: 'text-orange-700 border-orange-700 bg-orange-50',
      MEDIUM: 'text-accent-yellow border-accent-yellow bg-yellow-50',
      LOW: 'text-accent-cyan border-accent-cyan bg-cyan-50',
    };
    return colors[priority as keyof typeof colors] || colors.LOW;
  };

  const getStatusStamp = (status: string) => {
    const styles = {
      WON: 'text-green-700 border-green-700 rotate-[-12deg]',
      IN_PROGRESS: 'text-accent-yellow border-accent-yellow rotate-[-5deg]',
      REGISTERED: 'text-accent-blue border-accent-blue rotate-[8deg]',
      SUBMITTED: 'text-purple-700 border-purple-700 rotate-[-8deg]',
      LOST: 'text-red-700 border-red-700 rotate-[12deg]',
      PLANNED: 'text-ink-400 border-ink-400 rotate-[-2deg]',
    };
    return styles[status as keyof typeof styles] || styles.PLANNED;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center">
        <div className="animate-bounce font-serif text-2xl text-ink-900">
          <Feather className="inline-block mr-2 animate-pulse" /> Scribing...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-paper-50 bg-paper-noise text-ink-900 font-sans selection:bg-accent-yellow/30">
      
      {/* Decorative Top Border */}
      <div className="h-2 w-full bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 opacity-90"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-paper-300 bg-paper-50/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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
            onClick={() => setIsModalOpen(true)}
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
        
        {/* Stats Row - Styled as "Field Notes" */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10 pb-6 border-b border-paper-300 border-dashed">
          {[
            { label: 'Total Entries', value: stats.total, icon: BookOpen, color: 'text-ink-900' },
            { label: 'Planned', value: stats.planned, icon: Calendar, color: 'text-ink-500' },
            { label: 'Tracking', value: stats.inProgress, icon: AlertTriangle, color: 'text-accent-yellow' },
            { label: 'Registered', value: stats.registered, icon: Bookmark, color: 'text-accent-blue' },
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
          <div className="relative flex-1 group">
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
          
          <div className="flex gap-4">
            <div className="flex flex-col">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1 ml-1">Status</label>
                <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-paper-300 px-4 py-2.5 rounded-sm text-ink-900 focus:ring-1 focus:ring-ink-900 focus:border-ink-900 focus:outline-none text-sm font-medium shadow-sm hover:border-ink-400 cursor-pointer min-w-[140px]"
                >
                <option value="ALL">All Status</option>
                <option value="PLANNED">Planned</option>
                <option value="REGISTERED">Registered</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1 ml-1">Priority</label>
                <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-white border border-paper-300 px-4 py-2.5 rounded-sm text-ink-900 focus:ring-1 focus:ring-ink-900 focus:border-ink-900 focus:outline-none text-sm font-medium shadow-sm hover:border-ink-400 cursor-pointer min-w-[120px]"
                >
                <option value="ALL">All Priority</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                </select>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {filteredHackathons.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-paper-300 rounded-lg">
            <div className="inline-block p-6 rounded-full bg-paper-200/50 mb-6">
              <Feather size={48} className="text-ink-400" />
            </div>
            <p className="text-2xl font-serif text-ink-900 mb-2">The pages are empty.</p>
            <p className="text-ink-500 font-hand text-xl">Start a new chapter clearly...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHackathons.map(hackathon => {
              const daysLeft = Math.ceil((new Date(hackathon.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const isUrgent = daysLeft < 3 && daysLeft > 0;
              
              return (
                <div key={hackathon.id} className="group relative bg-white p-6 md:p-8 shadow-paper hover:shadow-lifted transition-all duration-500 ease-out transform hover:-translate-y-1 hover:rotate-[0.5deg]">
                  {/* Card Tape Effect (Visual Only) */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-paper-100/90 shadow-sm rotate-[-1deg] opacity-80 backdrop-blur-[1px] border-l border-r border-white/50"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 pr-4">
                      <h3 className="text-2xl font-serif font-bold text-ink-900 leading-tight mb-2 group-hover:text-accent-blue transition-colors">
                        {hackathon.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase border ${getPriorityColor(hackathon.priority)}`}>
                          {hackathon.priority}
                        </span>
                        {hackathon.theme && (
                          <span className="text-xs font-serif italic text-ink-500 border-b border-paper-300">
                            {hackathon.theme}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Stamp */}
                    <div className={`
                      border-2 px-3 py-1 font-black uppercase text-xs tracking-widest opacity-80 mix-blend-multiply
                      ${getStatusStamp(hackathon.status)}
                    `}>
                      {hackathon.status}
                    </div>
                  </div>

                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm border-b border-paper-200 pb-2">
                        <Calendar size={16} className={isUrgent ? "text-accent-red" : "text-ink-400"} />
                        <span className={`font-serif ${isUrgent ? "text-accent-red font-bold" : "text-ink-800"}`}>
                            {new Date(hackathon.deadline).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className={`font-mono text-xs ${daysLeft < 0 ? 'text-ink-400' : 'text-ink-500'}`}>
                            {daysLeft < 0 ? 'Archive' : `${daysLeft} days remaining`}
                        </span>
                        {hackathon.prize_pool && (
                            <span className="font-bold text-ink-900 bg-accent-yellow/10 px-2 py-0.5 rounded-sm">
                                💰 {hackathon.prize_pool}
                            </span>
                        )}
                    </div>
                  </div>

                  {hackathon.notes && (
                    <div className="mb-6 relative">
                        <div className="absolute -left-3 top-0 bottom-0 w-1 bg-accent-blue/20 rounded-full"></div>
                        <p className="font-hand text-xl text-ink-800 leading-relaxed opacity-90 pl-3">
                            "{hackathon.notes}"
                        </p>
                    </div>
                  )}

                  {/* Action Footer */}
                  <div className="pt-4 border-t border-paper-200 flex items-center justify-between gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2 flex-1">
                        {hackathon.status === 'PLANNED' && (
                        <button onClick={() => updateStatus(hackathon.id, 'IN_PROGRESS')} className="text-xs font-bold uppercase tracking-wider text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-sm transition-colors border border-transparent hover:border-green-200">
                            Begin
                        </button>
                        )}
                        {hackathon.status === 'IN_PROGRESS' && (
                        <button onClick={() => updateStatus(hackathon.id, 'SUBMITTED')} className="text-xs font-bold uppercase tracking-wider text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-sm transition-colors border border-transparent hover:border-indigo-200">
                            Finalize
                        </button>
                        )}
                        {hackathon.status === 'SUBMITTED' && (
                          <>
                            <button onClick={() => updateStatus(hackathon.id, 'WON')} className="text-xs font-bold uppercase tracking-wider text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-sm transition-colors">Won</button>
                            <button onClick={() => updateStatus(hackathon.id, 'LOST')} className="text-xs font-bold uppercase tracking-wider text-ink-500 hover:bg-ink-100 px-3 py-1.5 rounded-sm transition-colors">Lost</button>
                          </>
                        )}
                         {hackathon.url && (
                        <a href={hackathon.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wider text-ink-500 hover:text-ink-900 px-3 py-1.5 transition-colors">
                            Link ↗
                        </a>
                        )}
                    </div>
                    
                    <button 
                      onClick={() => deleteHackathon(hackathon.id)}
                      className="text-ink-300 hover:text-accent-red transition-colors p-1"
                      title="Discard"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Modal - Styled as a "Form" */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-paper-50 w-full max-w-lg shadow-2xl relative transform rotate-1 border-4 border-double border-paper-300">
             {/* Paper texture overlay for modal */}
            <div className="absolute inset-0 bg-paper-noise opacity-30 pointer-events-none"></div>

            <div className="relative p-8 md:p-10">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-ink-400 hover:text-ink-900 transition-colors">
                    <X size={24} />
                </button>

                <div className="mb-8 text-center border-b-2 border-ink-900 pb-4">
                    <h2 className="text-3xl font-serif font-bold text-ink-900 uppercase tracking-widest">Hackathon Registration Form</h2>
                    <p className="font-mono text-xs text-ink-500 mt-2">OFFICIAL ENTRY DOC. #{(Math.random() * 10000).toFixed(0)}</p>
                </div>

                <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                addHackathon({
                    title: formData.get('title') as string,
                    url: formData.get('url') as string || '',
                    deadline: new Date(formData.get('deadline') as string).toISOString(),
                    priority: formData.get('priority') as Hackathon['priority'],
                    status: 'PLANNED',
                    theme: formData.get('theme') as string || undefined,
                    prize_pool: formData.get('prize_pool') as string || undefined,
                    notes: formData.get('notes') as string || undefined,
                });
                }} className="space-y-6 font-serif">
                
                <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Event Title</label>
                    <input 
                    name="title"
                    type="text" 
                    required 
                    className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-xl font-bold text-ink-900 focus:outline-none placeholder-ink-300"
                    placeholder="Enter Title Here..."
                    autoFocus
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Date Due</label>
                        <input 
                        name="deadline"
                        type="date" 
                        required 
                        className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-ink-900 focus:outline-none font-mono"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Urgency</label>
                        <div className="relative">
                            <select 
                            name="priority"
                            defaultValue="MEDIUM"
                            className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-ink-900 focus:outline-none appearance-none cursor-pointer"
                            >
                            <option value="LOW">Low Priority</option>
                            <option value="MEDIUM">Medium Priority</option>
                            <option value="HIGH">High Priority</option>
                            <option value="CRITICAL">CRITICAL</option>
                            </select>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ink-400 text-xs">▼</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Official Website</label>
                    <input 
                    name="url"
                    type="url" 
                    className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-ink-900 focus:outline-none font-mono text-sm"
                    placeholder="https://"
                    />
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Theme/Topic</label>
                        <input 
                        name="theme"
                        type="text" 
                        className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-ink-900 focus:outline-none italic"
                        placeholder="e.g. GenAI"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Bounty / Prize</label>
                        <input 
                        name="prize_pool"
                        type="text" 
                        className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-ink-900 focus:outline-none"
                        placeholder="$..."
                        />
                    </div>
                </div>

                <div className="space-y-1 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Scribed Notes</label>
                    <textarea 
                    name="notes"
                    className="w-full bg-paper-100/50 border border-paper-300 focus:border-ink-900 rounded-sm p-4 text-ink-800 focus:outline-none h-32 resize-none font-hand text-xl leading-relaxed"
                    placeholder="Initial thoughts, strategies, team members..."
                    style={{ backgroundImage: 'linear-gradient(transparent, transparent 31px, #e5e5e5 31px)', backgroundSize: '100% 32px', lineHeight: '32px' }}
                    />
                </div>

                <div className="pt-6">
                    <button 
                    type="submit" 
                    className="w-full py-4 bg-ink-900 text-paper-50 font-bold uppercase tracking-widest hover:bg-ink-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                    Stamp & Approve
                    </button>
                </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;