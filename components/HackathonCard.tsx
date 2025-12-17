import React, { useState } from 'react';
import { Hackathon, Priority, Status } from '../types';
import { 
  Calendar, 
  ExternalLink, 
  Trophy, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BrainCircuit, 
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateHackathonIdeas } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface HackathonCardProps {
  hackathon: Hackathon;
  onUpdateStatus: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  onSaveIdeas: (id: string, ideas: string) => void;
}

const HackathonCard: React.FC<HackathonCardProps> = ({ hackathon, onUpdateStatus, onDelete, onSaveIdeas }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);

  const timeLeft = new Date(hackathon.deadline).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'text-red-400 bg-red-400/10 border-red-400/20';
      case Priority.MEDIUM: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case Priority.LOW: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const getStatusColor = (s: Status) => {
    switch (s) {
      case Status.WON: return 'text-green-400 border-green-500/50';
      case Status.LOST: return 'text-gray-400 border-gray-600/50';
      case Status.ABANDONED: return 'text-slate-500 border-slate-700/50';
      case Status.EXPIRED: return 'text-red-500 border-red-900/50';
      case Status.SUBMITTED: return 'text-purple-400 border-purple-500/50';
      default: return 'text-slate-200 border-slate-700';
    }
  };

  const handleGenerateIdeas = async () => {
    if (hackathon.aiIdeas) {
        setShowIdeas(!showIdeas);
        return;
    }
    
    setIsGenerating(true);
    try {
      const ideas = await generateHackathonIdeas(hackathon);
      onSaveIdeas(hackathon.id, ideas);
      setShowIdeas(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`relative group flex flex-col p-6 rounded-2xl border bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 ${getStatusColor(hackathon.status)}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1" title={hackathon.title}>
            {hackathon.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(hackathon.priority)}`}>
              {hackathon.priority}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
               {hackathon.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
            {hackathon.url && (
                <a 
                    href={hackathon.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-700"
                >
                    <ExternalLink size={18} />
                </a>
            )}
            <button 
                onClick={() => onDelete(hackathon.id)}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700"
            >
                <Trash2 size={18} />
            </button>
        </div>
      </div>

      {/* Deadline Info */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Calendar size={16} className={daysLeft < 3 && daysLeft > 0 ? "text-red-400" : "text-slate-400"} />
        <span className={daysLeft < 3 && daysLeft > 0 ? "text-red-300 font-medium" : "text-slate-300"}>
          {new Date(hackathon.deadline).toLocaleDateString()} 
        </span>
        {hackathon.status === Status.PLANNED || hackathon.status === Status.REGISTERED ? (
            <span className={`ml-auto text-xs font-mono px-2 py-1 rounded ${daysLeft < 0 ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'}`}>
            {daysLeft < 0 ? 'Ended' : `${daysLeft} days left`}
            </span>
        ) : null}
      </div>

      {/* Actions / Status Control */}
      <div className="mt-auto grid grid-cols-2 gap-2">
        {hackathon.status !== Status.WON && hackathon.status !== Status.LOST && hackathon.status !== Status.EXPIRED && hackathon.status !== Status.ABANDONED && (
            <>
                 <button 
                    onClick={() => onUpdateStatus(hackathon.id, Status.SUBMITTED)}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                 >
                    <CheckCircle size={16} /> Submit
                 </button>
                 <button 
                     onClick={() => onUpdateStatus(hackathon.id, Status.ABANDONED)}
                     className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-colors"
                 >
                    <XCircle size={16} /> Drop
                 </button>
            </>
        )}
        
        {hackathon.status === Status.SUBMITTED && (
            <>
                 <button 
                    onClick={() => onUpdateStatus(hackathon.id, Status.WON)}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors"
                 >
                    <Trophy size={16} /> Won
                 </button>
                 <button 
                     onClick={() => onUpdateStatus(hackathon.id, Status.LOST)}
                     className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-colors"
                 >
                    <AlertCircle size={16} /> Lost
                 </button>
            </>
        )}
      </div>

      {/* AI Feature */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <button 
            onClick={handleGenerateIdeas}
            disabled={isGenerating}
            className="w-full flex items-center justify-between text-xs font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
        >
            <span className="flex items-center gap-2">
                <BrainCircuit size={14} />
                {hackathon.aiIdeas ? "View AI Ideas" : "Generate Ideas with AI"}
            </span>
            {isGenerating ? <span className="animate-pulse">Thinking...</span> : (showIdeas ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
        </button>

        {showIdeas && hackathon.aiIdeas && (
            <div className="mt-3 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg overflow-y-auto max-h-48 border border-slate-700/50 prose prose-invert prose-sm">
                 <ReactMarkdown>{hackathon.aiIdeas}</ReactMarkdown>
            </div>
        )}
      </div>
    </div>
  );
};

export default HackathonCard;