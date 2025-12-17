import React, { useState } from 'react';
import { Priority, Status, Hackathon } from '../types';
import { X } from 'lucide-react';

interface AddHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (hackathon: Omit<Hackathon, 'id' | 'createdAt' | 'status'>) => void;
}

const AddHackathonModal: React.FC<AddHackathonModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      url,
      deadline,
      priority,
    });
    // Reset
    setTitle('');
    setUrl('');
    setDeadline('');
    setPriority(Priority.MEDIUM);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Add Hackathon</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    placeholder="e.g. Global AI Challenge"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Website URL</label>
                <input 
                    type="url" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    placeholder="https://devpost.com/..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Deadline</label>
                    <input 
                        type="date" 
                        required 
                        value={deadline} 
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                    <select 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none"
                    >
                        {Object.values(Priority).map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button 
                type="submit" 
                className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform active:scale-[0.98]"
            >
                Create Hackathon
            </button>
        </form>
      </div>
    </div>
  );
};

export default AddHackathonModal;