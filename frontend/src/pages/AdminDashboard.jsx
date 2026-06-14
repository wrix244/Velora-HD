import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, Edit, Trash2, Users, Download, Image, DollarSign, Loader2, X, Sparkles, AlertTriangle } from 'lucide-react';
import {
  useAdminAnalytics,
  useAdminUsers,
  useAdminPurchases,
  useAdminDownloads,
  useCreateWallpaper,
  useUpdateWallpaper,
  useDeleteWallpaper,
  useAdminWallpapers,
  useDeleteUser,
  useBanUser,
} from '../hooks/useAdmin';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

const categories = ['Nature', 'Space', 'Cyberpunk', 'Anime', 'Cars', 'Gaming', 'Minimal', 'Abstract', 'Fantasy', 'Technology', 'Architecture'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const addToast = useUIStore((state) => state.addToast);

  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWallpaper, setEditingWallpaper] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Nature');
  const [type, setType] = useState('static');
  const [deviceType, setDeviceType] = useState('desktop');
  const [resolution, setResolution] = useState('1920x1080');
  const [price, setPrice] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [tags, setTags] = useState('');
  
  // File upload states (either files or URL links)
  const [previewImageFile, setPreviewImageFile] = useState(null);
  const [downloadFileFile, setDownloadFileFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [downloadFileUrl, setDownloadFileUrl] = useState('');

  // Router protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'admin') {
      addToast('Access denied. Admin permissions required.', 'error');
      navigate('/');
    }
  }, [isAuthenticated, user, navigate, addToast]);

  // Queries
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const { data: usersList } = useAdminUsers();
  const { data: purchasesList } = useAdminPurchases();
  const { data: downloadsList } = useAdminDownloads();
  const { data: wallpapersList } = useAdminWallpapers();

  // Mutations
  const createMutation = useCreateWallpaper();
  const updateMutation = useUpdateWallpaper();
  const deleteMutation = useDeleteWallpaper();
  const deleteUserMutation = useDeleteUser();
  const banUserMutation = useBanUser();

  const handleOpenAddModal = () => {
    setEditingWallpaper(null);
    setTitle('');
    setDescription('');
    setCategory('Nature');
    setType('static');
    setDeviceType('desktop');
    setResolution(deviceType === 'desktop' ? '1920x1080' : '1080x1920');
    setPrice(0);
    setIsPremium(false);
    setTags('');
    setPreviewImageFile(null);
    setDownloadFileFile(null);
    setPreviewImageUrl('');
    setDownloadFileUrl('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (wp) => {
    setEditingWallpaper(wp);
    setTitle(wp.title);
    setDescription(wp.description || '');
    setCategory(wp.category);
    setType(wp.type);
    setDeviceType(wp.deviceType);
    setResolution(wp.resolution);
    setPrice(wp.price || 0);
    setIsPremium(wp.isPremium);
    setTags(wp.tags ? wp.tags.join(', ') : '');
    setPreviewImageFile(null);
    setDownloadFileFile(null);
    setPreviewImageUrl(wp.previewImage || '');
    setDownloadFileUrl(wp.downloadFile || '');
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Prepare payload. We can send Multipart Form Data if files are uploaded,
    // otherwise send JSON.
    const isMultipart = !!previewImageFile || !!downloadFileFile;
    let payload;

    if (isMultipart) {
      payload = new FormData();
      payload.append('title', title);
      payload.append('description', description);
      payload.append('category', category);
      payload.append('type', type);
      payload.append('deviceType', deviceType);
      payload.append('resolution', resolution);
      payload.append('price', price.toString());
      payload.append('isPremium', isPremium.toString());
      payload.append('tags', tags);

      if (previewImageFile) payload.append('previewImage', previewImageFile);
      else if (previewImageUrl) payload.append('previewImage', previewImageUrl);

      if (downloadFileFile) payload.append('downloadFile', downloadFileFile);
      else if (downloadFileUrl) payload.append('downloadFile', downloadFileUrl);
    } else {
      payload = {
        title,
        description,
        category,
        type,
        deviceType,
        resolution,
        price,
        isPremium,
        tags,
        previewImage: previewImageUrl,
        downloadFile: downloadFileUrl,
      };
    }

    if (editingWallpaper) {
      updateMutation.mutate(
        { id: editingWallpaper._id, formData: payload },
        {
          onSuccess: () => setModalOpen(false),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this wallpaper?')) {
      deleteMutation.mutate(id);
    }
  };

  useEffect(() => {
    if (location.state?.editWallpaper) {
      handleOpenEditModal(location.state.editWallpaper);
      // Clean up state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleToggleBan = (id, currentBannedStatus) => {
    const action = currentBannedStatus ? 'unban' : 'ban';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      banUserMutation.mutate({ id, isBanned: !currentBannedStatus });
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(id);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="pt-24 pb-16 text-center max-w-sm mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-display font-bold text-xl text-white">Access Denied</h2>
        <p className="text-xs text-gray-400">Admin credentials required to view this panel.</p>
      </div>
    );
  }

  if (analyticsLoading) {
    return (
      <div className="pt-24 pb-16 text-center max-w-sm mx-auto space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
        <p className="text-xs text-gray-400">Loading admin metrics...</p>
      </div>
    );
  }

  // Draw simple SVG line chart
  const renderSVGChart = (data, labels, strokeColor = '#7C3AED', fillColor = 'rgba(124,58,237,0.1)') => {
    if (!data || data.length === 0) return null;
    const maxVal = Math.max(...data) || 100;
    const padding = 40;
    const width = 500;
    const height = 180;

    const points = data
      .map((val, idx) => {
        const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
        const y = height - padding - (val * (height - padding * 2)) / maxVal;
        return `${x},${y}`;
      })
      .join(' ');

    const fillPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Y Axis Grid lines */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = padding + ratio * (height - padding * 2);
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4"
            />
          );
        })}
        {/* Area fill */}
        <polygon points={fillPoints} fill="url(#grad)" />
        {/* Path line */}
        <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="2.5" />
        {/* Value Nodes */}
        {data.map((val, idx) => {
          const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
          const y = height - padding - (val * (height - padding * 2)) / maxVal;
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r="4" fill={strokeColor} stroke="#121212" strokeWidth="2" />
              <text x={x} y={y - 8} fontSize="9" fill="#F9FAFB" textAnchor="middle" fontWeight="bold">
                {val}
              </text>
            </g>
          );
        })}
        {/* X labels */}
        {labels.map((lbl, idx) => {
          const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
          return (
            <text key={idx} x={x} y={height - 10} fontSize="9" fill="#6B7280" textAnchor="middle">
              {lbl}
            </text>
          );
        })}
      </svg>
    );
  };

  const overviewCards = [
    { label: 'Total Users', value: analytics?.stats?.totalUsers || 0, icon: <Users className="w-5 h-5 text-primary" /> },
    { label: 'Total Downloads', value: analytics?.stats?.totalDownloads || 0, icon: <Download className="w-5 h-5 text-accent" /> },
    { label: 'Total Assets', value: analytics?.stats?.totalWallpapers || 0, icon: <Image className="w-5 h-5 text-secondary" /> },
    { label: 'Total Revenue', value: `$${(analytics?.stats?.revenue || 0).toFixed(2)}`, icon: <DollarSign className="w-5 h-5 text-amber-400" /> },
  ];

  return (
    <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
            <LayoutDashboard className="w-3.5 h-3.5" /> Administrator Workspace
          </span>
          <h1 className="font-display font-black text-3xl text-white">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab switches */}
          {['overview', 'wallpapers', 'users', 'purchases'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === tab
                  ? 'bg-primary text-white font-bold'
                  : 'text-gray-400 hover:text-white bg-[#1A1A1A]/50 hover:bg-[#1A1A1A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((c) => (
          <div key={c.label} className="p-6 rounded-2xl glass-panel flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl">{c.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{c.label}</p>
              <h3 className="font-display font-black text-xl text-white mt-0.5">{c.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* TAB CONTENTS */}
      
      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-primary" /> Monthly Revenue Trend
            </h3>
            <div className="h-52 flex items-center justify-center pt-2">
              {analytics?.charts && renderSVGChart(analytics.charts.revenue, analytics.charts.labels, '#FF2D6F', 'rgba(255,45,111,0.1)')}
            </div>
          </div>

          {/* Downloads Chart */}
          <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-1">
              <Download className="w-4 h-4 text-accent" /> Monthly Downloads Trend
            </h3>
            <div className="h-52 flex items-center justify-center pt-2">
              {analytics?.charts && renderSVGChart(analytics.charts.downloads, analytics.charts.labels, '#00E5FF', 'rgba(0,229,255,0.1)')}
            </div>
          </div>

          {/* Popular Wallpapers & Recent Feed */}
          <div className="lg:col-span-5 p-6 rounded-3xl glass-panel space-y-4">
            <h3 className="font-display font-bold text-sm text-white">Popular Wallpapers</h3>
            <div className="space-y-3">
              {analytics?.popularWallpapers?.map((wp) => (
                <div key={wp._id} className="flex items-center gap-3 border-b border-white/5 pb-2">
                  <img src={wp.previewImage} alt="" className="w-10 h-12 rounded object-cover" />
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{wp.title}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{wp.category} • {wp.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{wp.downloads} downloads</p>
                    <p className="text-[10px] text-gray-500">{wp.likes} likes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-3xl glass-panel space-y-4">
            <h3 className="font-display font-bold text-sm text-white">Recent Log Activity</h3>
            <div className="space-y-3 h-80 overflow-y-auto pr-1">
              {analytics?.recentActivity?.map((act) => (
                <div key={act._id} className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase mr-2 ${
                      act.type === 'purchase' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      act.type === 'signup' ? 'bg-primary/10 text-primary border border-primary/20' :
                      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {act.type}
                    </span>
                    <span className="font-semibold text-white">{act.user}</span>
                    <span className="text-gray-400"> - {act.item}</span>
                  </div>
                  <div className="text-right text-gray-500">
                    <p className="font-medium text-white">{act.details}</p>
                    <p className="text-[9px]">{new Date(act.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WALLPAPERS MANAGEMENT */}
      {activeTab === 'wallpapers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold text-lg text-white">Wallpaper Library</h2>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Wallpaper
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Simple table/list of wallpapers */}
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs select-none">
                <thead>
                  <tr className="bg-white/2 text-gray-400 font-semibold border-b border-white/5">
                    <th className="p-4">Artwork</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Format</th>
                    <th className="p-4">Device</th>
                    <th className="p-4">Access</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {wallpapersList?.map((wp) => (
                    <tr key={wp._id} className="hover:bg-white/2 transition">
                      <td className="p-4 flex items-center gap-3">
                        <img src={wp.previewImage} alt="" className="w-8 h-10 rounded object-cover" />
                        <span className="font-semibold text-white">{wp.title}</span>
                      </td>
                      <td className="p-4">{wp.category}</td>
                      <td className="p-4 capitalize">{wp.type}</td>
                      <td className="p-4 capitalize">{wp.deviceType}</td>
                      <td className="p-4">
                        {wp.isPremium ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold">
                            Premium
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-gray-400 border border-white/5 text-[9px] font-bold">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {wp.isPremium ? `$${wp.price.toFixed(2)}` : 'FREE'}
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(wp)}
                          className="p-1.5 rounded bg-slate-900 border border-white/5 hover:border-white/15 text-gray-300 hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(wp._id)}
                          className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-gray-500 italic text-center">
              Showing all uploaded wallpapers. Click Edit or Delete to manage any item.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: USERS LIST */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-white">Registered Users</h2>
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr className="bg-white/2 text-gray-400 font-semibold border-b border-white/5">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registered On</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {usersList?.map((u) => (
                  <tr key={u._id} className="hover:bg-white/2 transition">
                    <td className="p-4 font-semibold text-white">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      {u.isBanned ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-bold">
                          Banned
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleString()}</td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => handleToggleBan(u._id, u.isBanned)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                          u.isBanned
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white'
                        }`}
                        title={u.isBanned ? 'Unban User' : 'Ban User'}
                      >
                        {u.isBanned ? 'Unban' : 'Ban'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1 rounded bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline align-middle" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PURCHASES TRANSACTION LIST */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-white">Sales Logs</h2>
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr className="bg-white/2 text-gray-400 font-semibold border-b border-white/5">
                  <th className="p-4">User</th>
                  <th className="p-4">Wallpaper Purchased</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {purchasesList?.map((p) => (
                  <tr key={p._id} className="hover:bg-white/2 transition">
                    <td className="p-4">
                      <p className="font-semibold text-white">{p.userId?.name || 'Deleted User'}</p>
                      <p className="text-[10px] text-gray-500">{p.userId?.email || 'N/A'}</p>
                    </td>
                    <td className="p-4 font-semibold text-white">{p.wallpaperId?.title || 'Deleted Wallpaper'}</td>
                    <td className="p-4 font-bold text-emerald-400">${p.amount.toFixed(2)}</td>
                    <td className="p-4 text-gray-500">{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#121212]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#1A1A1A] border border-white/10 rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-black text-xl text-white">
              {editingWallpaper ? 'Edit Wallpaper' : 'Add New Wallpaper'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input focus:bg-[#121212]"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input focus:bg-[#121212] h-20"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input focus:bg-[#121212]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#121212] text-white">{c}</option>
                    ))}
                  </select>
                </div>

                {/* Device Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Device Type</label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input focus:bg-[#121212]"
                  >
                    <option value="desktop" className="bg-[#121212] text-white">Desktop (PC)</option>
                    <option value="mobile" className="bg-[#121212] text-white">Mobile</option>
                  </select>
                </div>

                {/* Format (Static/Live) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Format</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input focus:bg-[#121212]"
                  >
                    <option value="static" className="bg-[#121212] text-white">Static Image</option>
                    <option value="live" className="bg-[#121212] text-white">Live Wallpaper (Video)</option>
                  </select>
                </div>

                {/* Resolution */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Resolution</label>
                  <input
                    type="text"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input focus:bg-[#121212]"
                    placeholder="3840x2160"
                    required
                  />
                </div>

                {/* Premium toggle */}
                <div className="space-y-1.5 flex items-center justify-between border border-white/5 rounded-xl px-4 py-2 col-span-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-white">Premium Wallpaper</p>
                    <p className="text-[10px] text-gray-400">Require checkout simulated payment to download</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                </div>

                {/* Price (Only enabled if premium) */}
                {isPremium && (
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Price ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.99"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs glass-input focus:bg-[#121212]"
                      required={isPremium}
                    />
                  </div>
                )}

                {/* Tags */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input focus:bg-[#121212]"
                    placeholder="cinematic, dark, minimal"
                  />
                </div>

                {/* File Upload / Link Inputs */}
                <div className="space-y-2 col-span-2 border-t border-white/5 pt-4">
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">Asset Source</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Preview Image */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Preview Image</label>
                      <input
                        type="file"
                        onChange={(e) => setPreviewImageFile(e.target.files[0])}
                        className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:hover:bg-white/10"
                      />
                      <input
                        type="text"
                        placeholder="Or paste URL link"
                        value={previewImageUrl}
                        onChange={(e) => setPreviewImageUrl(e.target.value)}
                        className="w-full px-3 py-2 text-xs glass-input focus:bg-[#121212]"
                      />
                    </div>

                    {/* Download File */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">High-Res Asset File</label>
                      <input
                        type="file"
                        onChange={(e) => setDownloadFileFile(e.target.files[0])}
                        className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:hover:bg-white/10"
                      />
                      <input
                        type="text"
                        placeholder="Or paste URL link (mp4 for Live)"
                        value={downloadFileUrl}
                        onChange={(e) => setDownloadFileUrl(e.target.value)}
                        className="w-full px-3 py-2 text-xs glass-input focus:bg-[#121212]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/5 bg-[#1A1A1A]/50 hover:bg-[#1A1A1A] text-gray-300 font-semibold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg transition"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Wallpaper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
