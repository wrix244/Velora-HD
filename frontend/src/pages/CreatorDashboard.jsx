import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Edit, Trash2, LayoutDashboard, Clock, CheckCircle2, XCircle, Info, Image, Tag, DollarSign, Loader2, Sparkles, AlertTriangle, ShieldCheck, Mail, History } from 'lucide-react';
import {
  useCreatorWallpapers,
  useCreatorUpload,
  useUpdateCreatorWallpaper,
  useDeleteCreatorWallpaper,
  useNotifications,
  useMarkNotificationRead
} from '../hooks/useCreator';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

const categories = ['Nature', 'Space', 'Cyberpunk', 'Anime', 'Cars', 'Gaming', 'Minimal', 'Abstract', 'Fantasy', 'Technology', 'Architecture'];

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const addToast = useUIStore((state) => state.addToast);

  // Protected route check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/creator-dashboard');
    } else if (user?.role !== 'creator' && user?.role !== 'admin') {
      addToast('You are not authorized to view the Creator Dashboard.', 'error');
      navigate('/become-creator');
    }
  }, [isAuthenticated, user, navigate, addToast]);

  // Queries & Mutations
  const { data: uploads, isLoading: uploadsLoading } = useCreatorWallpapers();
  const { data: notifications } = useNotifications();

  const uploadMutation = useCreatorUpload();
  const updateMutation = useUpdateCreatorWallpaper();
  const deleteMutation = useDeleteCreatorWallpaper();
  const markReadMutation = useMarkNotificationRead();

  // Dashboard state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWallpaper, setEditingWallpaper] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Nature');
  const [type, setType] = useState('static');
  const [deviceType, setDeviceType] = useState('desktop');
  const [resolution, setResolution] = useState('1920x1080');
  const [price, setPrice] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [tags, setTags] = useState('');
  
  // Upload states
  const [previewImageFile, setPreviewImageFile] = useState(null);
  const [downloadFileFile, setDownloadFileFile] = useState(null);
  const [copyrightAccepted, setCopyrightAccepted] = useState(false);

  // Confirm delete states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Nature');
    setType('static');
    setDeviceType('desktop');
    setResolution('1920x1080');
    setPrice(0);
    setIsPremium(false);
    setTags('');
    setPreviewImageFile(null);
    setDownloadFileFile(null);
    setCopyrightAccepted(false);
    setEditingWallpaper(null);
  };

  const handleEditClick = (wp) => {
    setEditingWallpaper(wp);
    setTitle(wp.title);
    setDescription(wp.description || '');
    setCategory(wp.category);
    setType(wp.type || 'static');
    setDeviceType(wp.deviceType || 'desktop');
    setResolution(wp.resolution || '1920x1080');
    setPrice(wp.price || 0);
    setIsPremium(wp.isPremium || false);
    setTags(wp.tags ? wp.tags.join(', ') : '');
    setPreviewImageFile(null);
    setDownloadFileFile(null);
    setCopyrightAccepted(true); // already accepted originally
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeletingId(null);
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !category || !resolution) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!editingWallpaper && !downloadFileFile) {
      addToast('Please upload a high-resolution wallpaper file.', 'error');
      return;
    }

    if (!copyrightAccepted) {
      addToast('You must accept the copyright terms.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('type', type);
    formData.append('deviceType', deviceType);
    formData.append('resolution', resolution);
    formData.append('price', isPremium ? price : 0);
    formData.append('isPremium', isPremium);
    formData.append('tags', tags);
    formData.append('copyrightConfirmed', copyrightAccepted);

    if (previewImageFile) {
      formData.append('previewImage', previewImageFile);
    }
    if (downloadFileFile) {
      formData.append('downloadFile', downloadFileFile);
    }

    if (editingWallpaper) {
      updateMutation.mutate({ id: editingWallpaper._id, formData }, {
        onSuccess: () => {
          setModalOpen(false);
          resetForm();
        }
      });
    } else {
      uploadMutation.mutate(formData, {
        onSuccess: () => {
          setModalOpen(false);
          resetForm();
        }
      });
    }
  };

  const unreadNotifications = notifications?.filter(n => !n.isRead) || [];

  return (
    <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
            <LayoutDashboard className="w-3.5 h-3.5" /> Creator Workspace
          </span>
          <h1 className="font-display font-black text-3xl text-white">Creator Dashboard</h1>
          <p className="text-xs text-gray-400">Welcome, {user?.name}. Manage your uploads and keep track of reviews.</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 self-start md:self-auto btn-glow cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Upload Wallpaper
        </button>
      </div>

      {/* Notifications Section */}
      {unreadNotifications.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" /> Unread Notifications ({unreadNotifications.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unreadNotifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-4 rounded-2xl glass-panel-glow border-l-4 flex justify-between items-start gap-4 transition ${
                  notif.type === 'success' ? 'border-emerald-500' : 'border-rose-500'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{notif.message}</p>
                  <span className="text-[9px] text-gray-500 mt-2 block">{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => markReadMutation.mutate(notif._id)}
                  className="text-[10px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploads List */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg text-white">Your Uploaded Wallpapers</h2>
        
        {uploadsLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-gray-400">Loading your gallery...</p>
          </div>
        ) : !uploads || uploads.length === 0 ? (
          <div className="p-16 rounded-2xl glass-panel text-center flex flex-col items-center justify-center space-y-4">
            <Image className="w-10 h-10 text-gray-600" />
            <h3 className="font-display font-bold text-base text-white">No wallpapers uploaded yet</h3>
            <p className="text-xs text-gray-400 max-w-sm">
              Start sharing your creations! Click "Upload Wallpaper" above to list your first design.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {uploads.map((wp) => (
              <div key={wp._id} className="glass-panel rounded-2xl overflow-hidden border-white/5 flex flex-col group relative">
                
                {/* Preview Image */}
                <div className="aspect-video sm:aspect-square relative overflow-hidden bg-black/20">
                  <img
                    src={wp.previewImage}
                    alt={wp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Status Overlay Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    {wp.status === 'pending' && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full backdrop-blur-md">
                        <Clock className="w-3 h-3" /> Reviewing
                      </span>
                    )}
                    {wp.status === 'approved' && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full backdrop-blur-md">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    )}
                    {wp.status === 'rejected' && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-full backdrop-blur-md">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </div>

                  {/* Premium Badge */}
                  {wp.isPremium && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full backdrop-blur-md uppercase tracking-wider">
                        <Sparkles className="w-2.5 h-2.5" /> Premium
                      </span>
                    </div>
                  )}
                </div>

                {/* Info & Metadata */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-white truncate">{wp.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 capitalize">{wp.category} • {wp.deviceType} • {wp.type}</p>
                    <p className="text-xs font-semibold text-gray-400 mt-2">{wp.isPremium ? `$${wp.price.toFixed(2)}` : 'Free'}</p>
                  </div>

                  {wp.status === 'rejected' && wp.rejectionNotes && (
                    <div className="p-2 bg-rose-500/5 border border-rose-500/10 rounded-lg text-[10px] text-rose-300">
                      <strong className="text-white">Reason:</strong> "{wp.rejectionNotes}"
                    </div>
                  )}

                  {/* Edit/Delete Actions */}
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleEditClick(wp)}
                      className="flex-grow flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(wp._id)}
                      className="py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPLOAD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#1A1A1A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 my-8">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-xl font-display font-black text-white">
                {editingWallpaper ? 'Edit Wallpaper Details' : 'Upload New Wallpaper'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Title <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyber Cityscape"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category <span className="text-rose-500">*</span></label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="Tell users what makes this wallpaper special..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary transition"
                />
              </div>

              {/* Specs: Type, DeviceType, Resolution, Tags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="static">Static Image</option>
                    <option value="live">Live Video</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Device</label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="desktop">Desktop PC</option>
                    <option value="mobile">Mobile Phone</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Resolution <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1920x1080"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tags <span className="text-gray-500">(Commas)</span></label>
                  <input
                    type="text"
                    placeholder="neon, city, rain"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing section */}
              <div className="p-4 bg-white/2 border border-white/5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="rounded border-white/10 text-primary bg-white/5"
                  />
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Premium Wallpaper License
                  </span>
                </label>

                {isPremium && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-0.5">
                      <DollarSign className="w-3 h-3 text-primary" /> Price (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Upload fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {editingWallpaper ? 'Replace Preview Image' : 'Preview Image'} <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative border border-dashed border-white/10 hover:border-primary/40 rounded-xl p-4 text-center bg-white/2 cursor-pointer transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPreviewImageFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-300 truncate">
                      {previewImageFile ? previewImageFile.name : 'Upload crop preview'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {editingWallpaper ? 'Replace Wallpaper File' : 'Wallpaper File'} {!editingWallpaper && <span className="text-rose-500">*</span>}
                  </label>
                  <div className="relative border border-dashed border-white/10 hover:border-primary/40 rounded-xl p-4 text-center bg-white/2 cursor-pointer transition">
                    <input
                      type="file"
                      required={!editingWallpaper}
                      accept={type === 'live' ? 'video/*' : 'image/*'}
                      onChange={(e) => setDownloadFileFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-300 truncate">
                      {downloadFileFile ? downloadFileFile.name : 'Upload high-resolution source'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Copyright warning banner */}
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-3">
                <div className="flex gap-2 text-amber-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Copyright Protection Declaration</span>
                </div>
                <p className="text-[10px] text-gray-300 leading-relaxed">
                  "By uploading content, you confirm that you own the rights to distribute these wallpapers. Copyright infringement may result in content removal and account suspension."
                </p>
                <label className="flex items-start gap-2.5 mt-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={copyrightAccepted}
                    onChange={(e) => setCopyrightAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-white/10 text-primary bg-white/5"
                  />
                  <span className="text-[11px] text-white font-semibold group-hover:text-primary transition-colors">
                    I confirm and accept these copyright terms. <span className="text-rose-500">*</span>
                  </span>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!copyrightAccepted || uploadMutation.isPending || updateMutation.isPending}
                className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-center transition-all ${
                  copyrightAccepted && !(uploadMutation.isPending || updateMutation.isPending)
                    ? 'bg-primary hover:bg-primary-hover text-white shadow-lg btn-glow cursor-pointer'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                }`}
              >
                {uploadMutation.isPending || updateMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing upload...</span>
                  </div>
                ) : (
                  editingWallpaper ? 'Save Modifications' : 'Publish Wallpaper'
                )}
              </button>

            </form>

          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Confirm Deletion
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Are you sure you want to permanently delete this wallpaper? This action is irreversible and will remove all metadata and files from Cloudinary and our database.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase text-gray-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold uppercase text-white transition cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
