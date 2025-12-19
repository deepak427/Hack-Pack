'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Hackathon, updateHackathon } from '@/app/actions';

interface EditModalProps {
    hackathon: Hackathon;
    onClose: () => void;
}

export function EditHackathonModal({ hackathon, onClose }: EditModalProps) {
    return (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-paper-50 w-full max-w-lg shadow-2xl relative transform rotate-1 border-4 border-double border-paper-300">
                {/* Paper texture overlay */}
                <div className="absolute inset-0 bg-paper-noise opacity-30 pointer-events-none"></div>

                <div className="relative p-8 md:p-10">
                    <button onClick={onClose} className="absolute top-4 right-4 text-ink-400 hover:text-ink-900 transition-colors">
                        <X size={24} />
                    </button>

                    <div className="mb-6 text-center border-b-2 border-ink-900 pb-2">
                        <h2 className="text-2xl font-serif font-bold text-ink-900 uppercase tracking-widest">Edit Entry</h2>
                    </div>

                    <form action={async (formData) => {
                        const data = {
                            title: formData.get('title') as string,
                            url: formData.get('url') as string,
                            deadline: new Date(formData.get('deadline') as string).toISOString(),
                            priority: formData.get('priority') as Hackathon['priority'],
                            theme: formData.get('theme') as string,
                            prize_pool: formData.get('prize_pool') as string,
                            notes: formData.get('notes') as string,
                        };
                        await updateHackathon(hackathon.id, data);
                        onClose();
                    }} className="space-y-4 font-serif">

                        <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Event Title</label>
                            <input
                                name="title"
                                defaultValue={hackathon.title}
                                type="text"
                                required
                                className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-xl font-bold text-ink-900 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Date Due</label>
                                <input
                                    name="deadline"
                                    defaultValue={new Date(hackathon.deadline).toISOString().split('T')[0]}
                                    type="date"
                                    required
                                    className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-ink-900 focus:outline-none font-mono"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Urgency</label>
                                <select
                                    name="priority"
                                    defaultValue={hackathon.priority}
                                    className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-ink-900 focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="LOW">Low Priority</option>
                                    <option value="MEDIUM">Medium Priority</option>
                                    <option value="HIGH">High Priority</option>
                                    <option value="CRITICAL">CRITICAL</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Official Website</label>
                            <input
                                name="url"
                                defaultValue={hackathon.url}
                                type="url"
                                className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-ink-900 focus:outline-none font-mono text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Theme</label>
                                <input
                                    name="theme"
                                    defaultValue={hackathon.theme}
                                    type="text"
                                    className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-ink-900 focus:outline-none italic"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Bounty</label>
                                <input
                                    name="prize_pool"
                                    defaultValue={hackathon.prize_pool}
                                    type="text"
                                    className="w-full bg-transparent border-b border-ink-400 focus:border-ink-900 py-2 text-ink-900 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1 pt-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Scribed Notes</label>
                            <textarea
                                name="notes"
                                defaultValue={hackathon.notes}
                                className="w-full bg-paper-100/50 border border-paper-300 focus:border-ink-900 rounded-sm p-4 text-ink-800 focus:outline-none h-32 resize-none font-hand text-xl leading-relaxed"
                                style={{ backgroundImage: 'linear-gradient(transparent, transparent 31px, #e5e5e5 31px)', backgroundSize: '100% 32px', lineHeight: '32px' }}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-3 bg-ink-900 text-paper-50 font-bold uppercase tracking-widest hover:bg-ink-800 transition-all shadow-lg hover:shadow-xl"
                            >
                                Update Record
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
