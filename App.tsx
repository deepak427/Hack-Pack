import React, { useState, useEffect, useMemo } from 'react';
import { Hackathon, Priority, Status, SortOption } from './types';
import HackathonCard from './components/HackathonCard';
import AddHackathonModal from './components/AddHackathonModal';
import { Plus, LayoutGrid, ListFilter, Trophy, Calendar, AlertTriangle, Search } from 'lucide-react';

const App: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>(() => {
    const saved = localStorage.getItem('hackathons');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('DEADLINE_ASC');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('hackathons', JSON.stringify(hackathons));
  }, [hackathons]);

  // Check for expiration
  useEffect(() => {
    const checkExpiration = () => {
      const now = new Date();
      setHackathons(prev => prev.map(h => {
        const deadline = new Date(h.deadline);
        // End of day deadline assumption
        deadline.setHours(23, 59, 59, 999);
        
        if (now > deadline && (h.status === Status.PLANNED || h.status === Status.REGISTERED)) {
          return { ...h, status: Status.EXPIRED };
        }
        return h;
      }));
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const addHackathon = (data: Omit<Hackathon, 'id' | 'createdAt' | 'status'>) => {
    const newHackathon: Hackathon = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: Status.PLANNED,
    };
    setHackathons(prev => [...prev, newHackathon]);
  };

  const updateHackathonStatus = (id: string, status: Status) => {
    setHackathons(prev => prev.map(h => h.id === id ? { ...h, status } : h));
  };

  const deleteHackathon = (id: string) => {
    if (confirm('Are you sure you want to delete this hackathon?')) {
        setHackathons(prev => prev.filter(h => h.id !== id));
    }
  };

  const saveIdeas = (id: string, ideas: string) => {
    setHackathons(prev => prev.map(h => h.id === id ? { ...h, aiIdeas: ideas } : h));
  };

  const sortedAndFilteredHackathons = useMemo(() => {
    let result = [...hackathons];

    // Filter
    if (filterStatus !== 'ALL') {
      result = result.filter(h => h.status === filterStatus);
    }
    
    // Search
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter(h => h.title.toLowerCase().includes(lower));
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === 'DEADLINE_ASC') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortOption === 'DEADLINE_DESC') return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      
      const priorityWeight = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
      if (sortOption === 'PRIORITY_HIGH') return priorityWeight[b.priority] - priorityWeight[a.priority];
      if (sortOption === 'PRIORITY_LOW') return priorityWeight[a.priority] - priorityWeight[b.priority];
      
      return 0;
    });

    return result;
  }, [hackathons, sortOption, filterStatus, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: hackathons.length,
      won: hackathons.filter(h => h.status === Status.WON).length,
      upcoming: hackathons.filter(h => h.status === Status.PLANNED || h.status === Status.REGISTERED).length,
      expired: hackathons.filter(h => h.status === Status.EXPIRED).length
    };
  }, [hackathons]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md">
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
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus size={18} />
            Add Hackathon
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3 text-slate-400 mb-2 text-sm font-medium">
                    <ListFilter size={16} /> Total
                </div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3 text-green-400 mb-2 text-sm font-medium">
                    <Trophy size={16} /> Won
                </div>
                <div className="text-2xl font-bold text-white">{stats.won}</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3 text-blue-400 mb-2 text-sm font-medium">
                    <Calendar size={16} /> Upcoming
                </div>
                <div className="text-2xl font-bold text-white">{stats.upcoming}</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3 text-red-400 mb-2 text-sm font-medium">
                    <AlertTriangle size={16} /> Expired
                </div>
                <div className="text-2xl font-bold text-white">{stats.expired}</div>
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
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                >
                    <option value="DEADLINE_ASC">Deadline: Soonest</option>
                    <option value="DEADLINE_DESC">Deadline: Latest</option>
                    <option value="PRIORITY_HIGH">Priority: High to Low</option>
                    <option value="PRIORITY_LOW">Priority: Low to High</option>
                </select>

                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                >
                    <option value="ALL">All Status</option>
                    {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>

        {/* Grid */}
        {sortedAndFilteredHackathons.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
                <div className="inline-block p-4 rounded-full bg-slate-800/50 mb-4">
                    <LayoutGrid size={32} />
                </div>
                <p className="text-lg">No hackathons found.</p>
                <p className="text-sm">Add one to get started!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedAndFilteredHackathons.map(hackathon => (
                    <HackathonCard 
                        key={hackathon.id} 
                        hackathon={hackathon} 
                        onUpdateStatus={updateHackathonStatus}
                        onDelete={deleteHackathon}
                        onSaveIdeas={saveIdeas}
                    />
                ))}
            </div>
        )}

      </main>

      <AddHackathonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addHackathon}
      />
    </div>
  );
};

export default App;