
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  Activity, 
  Database, 
  ShieldCheck, 
  Trash2, 
  Search, 
  BarChart3,
  RefreshCw,
  MoreVertical,
  UserCheck,
  UserX,
  Lock,
  Eye
} from 'lucide-react';
import { storage, UserProfile } from '../lib/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Logo } from './Logo';

export const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'stats' | 'users' | 'feedback' | 'settings'>('stats');
  const [users, setUsers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [activeView]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeView === 'users' && isSupabaseConfigured()) {
        const { data } = await supabase.from('profiles').select('*').order('join_date', { ascending: false });
        setUsers(data || []);
      } else if (activeView === 'feedback' && isSupabaseConfigured()) {
        const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
        setFeedback(data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[80vh] flex flex-col gap-8 animate-fade-in pb-20">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-3xl bg-white text-black flex items-center justify-center shadow-glow">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">System Administration</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Root Node Control Active</p>
            </div>
          </div>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl">
          {[
            { id: 'stats', icon: Activity, label: 'Stats' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'feedback', icon: MessageSquare, label: 'Reports' },
            { id: 'settings', icon: Settings, label: 'Core' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`h-11 px-6 rounded-xl flex items-center gap-3 transition-all text-[9px] font-black uppercase tracking-widest ${activeView === item.id ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              <item.icon size={14} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'stats' && (
          <motion.div 
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Users" value={users.length || '---'} icon={Users} color="#00f2ff" />
              <StatCard label="Active Sessions" value="2.4k" icon={Activity} color="#00ff88" />
              <StatCard label="DB Latency" value="12ms" icon={Database} color="#ff7700" />
              <StatCard label="Feedback" value={feedback.length || '---'} icon={MessageSquare} color="#ff33cc" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="cyber-panel p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Growth Analysis</h3>
                    <BarChart3 size={16} className="text-white/20" />
                  </div>
                  <div className="h-64 flex items-end gap-3 px-4">
                     {[30, 45, 60, 40, 80, 95, 70, 85, 60, 50].map((h, i) => (
                       <div key={i} className="flex-1 bg-white/5 rounded-t-xl relative group" style={{ height: `${h}%` }}>
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl shadow-glow" />
                       </div>
                     ))}
                  </div>
               </div>

               <div className="cyber-panel p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">System Integrity</h3>
                    <RefreshCw size={16} className="text-white/20" />
                  </div>
                  <div className="space-y-4">
                     {[
                       { label: 'Supabase Auth Gateway', status: 'Optimal', val: 99 },
                       { label: 'Cloud Storage Sync', status: 'Healthy', val: 92 },
                       { label: 'Local IDB Synchronization', status: 'Active', val: 100 },
                       { label: 'Neural Engine Core', status: 'Running', val: 85 }
                     ].map(log => (
                       <div key={log.label} className="space-y-2">
                          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                             <span className="text-white/60">{log.label}</span>
                             <span className={log.val > 90 ? 'text-green-500' : 'text-orange-500'}>{log.status}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${log.val}%` }}
                               className={`h-full ${log.val > 90 ? 'bg-green-500' : 'bg-orange-500'} shadow-glow`}
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeView === 'users' && (
          <motion.div 
            key="users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 h-14">
              <Search size={18} className="text-white/20" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-white/10"
              />
            </div>

            <div className="cyber-panel overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">User ID</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">Profile</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">Email</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">Level</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">Joined</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        [1,2,3,4,5].map(i => (
                          <tr key={i} className="animate-pulse">
                            <td colSpan={6} className="px-8 py-6 h-16 bg-white/[0.01]" />
                          </tr>
                        ))
                      ) : filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-5 text-[10px] font-mono text-white/20">#{user.id.substring(0, 8)}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20"><Users size={16} /></div>}
                               </div>
                               <span className="text-xs font-black uppercase tracking-tight">{user.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-xs font-bold text-white/40">{user.email}</td>
                          <td className="px-8 py-5">
                             <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/60">{user.level}</span>
                          </td>
                          <td className="px-8 py-5 text-[10px] font-black text-white/20 uppercase">{new Date(user.join_date).toLocaleDateString()}</td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white hover:text-black transition-all"><Eye size={14} /></button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        )}

        {activeView === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
             <div className="cyber-panel p-8 space-y-8">
                <div className="flex items-center gap-4">
                   <Lock className="text-white/20" size={20} />
                   <h3 className="text-[10px] font-black uppercase tracking-widest">Access Control</h3>
                </div>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-xs font-black uppercase italic">Maintenance Mode</p>
                         <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Disable public access for updates</p>
                      </div>
                      <div className="h-6 w-12 bg-white/5 rounded-full border border-white/10" />
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-xs font-black uppercase italic">Public Registration</p>
                         <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Allow new user signups</p>
                      </div>
                      <div className="h-6 w-12 bg-green-500 rounded-full border border-white/10 flex items-center justify-end px-1"><div className="h-4 w-4 bg-white rounded-full" /></div>
                   </div>
                </div>
             </div>

             <div className="cyber-panel p-8 space-y-8">
                <div className="flex items-center gap-4">
                   <RefreshCw className="text-white/20" size={20} />
                   <h3 className="text-[10px] font-black uppercase tracking-widest">Cache Management</h3>
                </div>
                <div className="space-y-4">
                   <button className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Clear Session Vault</button>
                   <button className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Flush Neural Cache</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function StatCard({ label, value, icon: Icon, color }: { label: string, value: any, icon: any, color: string }) {
  return (
    <div className="cyber-panel p-8 space-y-6 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-[2.5] pointer-events-none group-hover:scale-[3] transition-transform duration-700">
        <Icon size={40} />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center" style={{ color }}>
          <Icon size={20} />
        </div>
        <MoreVertical size={14} className="text-white/10" />
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-black italic tracking-tighter">{value}</p>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">{label}</p>
      </div>
    </div>
  );
}
