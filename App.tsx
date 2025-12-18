import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, Trophy, Calendar, AlertTriangle, Search, X } from 'lucide-react';
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
    if (!confirm('Delete this hackathon?')) return;
    
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
      CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
      HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      LOW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return colors[priority as keyof typeof colors] || colors.LOW;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      WON: 'bg-green-500/20 text-green-400',
      IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400',
      REGISTERED: 'bg-blue-500/20 text-blue-400',
      SUBMITTED: 'bg-purple-500/20 text-purple-400',
      LOST: 'bg-red-500/20 text-red-400',
      PLANNED: 'bg-gray-500/20 text-gray-400',
    };
    return colors[status as keyof typeof colors] || colors.PLANNED;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <LayoutGrid size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              HackTrack AI
            </h1>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            Add Hackathon
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 p-4 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3 text-slate-400 mb-2 text-sm font-medium">
              <LayoutGrid size={16} /> Total
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-4 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-3 text-blue-400 mb-2 text-sm font-medium">
              <Calendar size={16} /> Planned
            </div>
            <div className="text-2xl font-bold text-white">{stats.planned}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-4 rounded-xl border border-yellow-500/20">
            <div className="flex items-center gap-3 text-yellow-400 mb-2 text-sm font-medium">
              <AlertTriangle size={16} /> In Progress
            </div>
            <div className="text-2xl font-bold text-white">{stats.inProgress}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-4 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3 text-purple-400 mb-2 text-sm font-medium">
              <Calendar size={16} /> Registered
            </div>
            <div className="text-2xl font-bold text-white">{stats.registered}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-4 rounded-xl border border-green-500/20">
            <div className="flex items-center gap-3 text-green-400 mb-2 text-sm font-medium">
              <Trophy size={16} /> Won
            </div>
            <div className="text-2xl font-bold text-white">{stats.won}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search hackathons..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="PLANNED">Planned</option>
              <option value="REGISTERED">Registered</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>

            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            >
              <option value="ALL">All Priority</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {filteredHackathons.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="inline-block p-4 rounded-full bg-slate-800/50 mb-4">
              <LayoutGrid size={32} />
            </div>
            <p className="text-lg">No hackathons yet.</p>
            <p className="text-sm">Click "Add Hackathon" to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map(hackathon => {
              const daysLeft = Math.ceil((new Date(hackathon.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={hackathon.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {hackathon.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(hackathon.priority)}`}>
                          {hackathon.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hackathon.status)}`}>
                          {hackathon.status}
                        </span>
                        {hackathon.theme && (
                          <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">
                            {hackathon.theme}
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteHackathon(hackathon.id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-sm">
                    <Calendar size={16} className={daysLeft < 3 && daysLeft > 0 ? "text-red-400" : "text-slate-400"} />
                    <span className={daysLeft < 3 && daysLeft > 0 ? "text-red-300 font-medium" : "text-slate-300"}>
                      {new Date(hackathon.deadline).toLocaleDateString()}
                    </span>
                    <span className={`ml-auto text-xs font-mono px-2 py-1 rounded ${daysLeft < 0 ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'}`}>
                      {daysLeft < 0 ? 'Ended' : `${daysLeft} days left`}
                    </span>
                  </div>

                  {hackathon.prize_pool && (
                    <div className="mb-4 text-sm text-slate-400">
                      💰 {hackathon.prize_pool}
                    </div>
                  )}

                  {hackathon.notes && (
                    <div className="mb-4 text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg line-clamp-2">
                      {hackathon.notes}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {hackathon.status === 'PLANNED' && (
                      <button 
                        onClick={() => updateStatus(hackathon.id, 'IN_PROGRESS')}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        Start
                      </button>
                    )}
                    {hackathon.status === 'IN_PROGRESS' && (
                      <button 
                        onClick={() => updateStatus(hackathon.id, 'SUBMITTED')}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        Submit
                      </button>
                    )}
                    {hackathon.status === 'SUBMITTED' && (
                      <>
                        <button 
                          onClick={() => updateStatus(hackathon.id, 'WON')}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                        >
                          Won 🎉
                        </button>
                        <button 
                          onClick={() => updateStatus(hackathon.id, 'LOST')}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                        >
                          Lost
                        </button>
                      </>
                    )}
                    {hackathon.url && (
                      <a 
                        href={hackathon.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        Visit
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add Hackathon</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
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
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
                <input 
                  name="title"
                  type="text" 
                  required 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. AI Innovation Challenge"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Website URL</label>
                <input 
                  name="url"
                  type="url" 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Deadline *</label>
                  <input 
                    name="deadline"
                    type="date" 
                    required 
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select 
                    name="priority"
                    defaultValue="MEDIUM"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Theme</label>
                <input 
                  name="theme"
                  type="text" 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. AI for Social Good"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Prize Pool</label>
                <input 
                  name="prize_pool"
                  type="text" 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. $10,000 total prizes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                <textarea 
                  name="notes"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20 resize-none"
                  placeholder="Add your notes..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
              >
                Create Hackathon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;