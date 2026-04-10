import { useState, useRef, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Play, Pause, Plus, Edit2, Trash2, Settings } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Viewer Widget Component
function ViewerWidget() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);
  const savedTimeRef = useRef(0);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await axios.get(`${API}/tracks`);
      setTracks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setLoading(false);
    }
  };

  const currentTrack = tracks[currentTrackIndex];

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const switchTrack = (index) => {
    if (index === currentTrackIndex) return;
    
    const wasPlaying = isPlaying;
    const savedTime = audioRef.current?.currentTime || 0;
    savedTimeRef.current = savedTime;
    
    setCurrentTrackIndex(index);
    
    if (audioRef.current) {
      const handleCanPlay = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = savedTimeRef.current;
          if (wasPlaying) {
            audioRef.current.play();
          }
        }
        audioRef.current?.removeEventListener('canplay', handleCanPlay);
      };
      
      audioRef.current.addEventListener('canplay', handleCanPlay);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (loading) {
    return (
      <div className="viewer-container">
        <div className="loading-state">Loading tracks...</div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="viewer-container">
        <div className="empty-state">
          <p>No tracks available yet.</p>
          <Link to="/admin" className="admin-link">Go to Admin Panel</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="viewer-container">
      {/* Header with current track */}
      {currentTrack && (
        <div className="viewer-header">
          <img 
            src={currentTrack.imageUrl}
            alt={currentTrack.title}
            className="current-track-image"
          />
          <div className="current-track-info">
            <h2 className="current-track-title" data-testid="current-track-title">
              {currentTrack.title}
            </h2>
            <p className="current-track-description" data-testid="current-track-description">
              {currentTrack.description}
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-section">
        <div 
          className="progress-bar-container" 
          onClick={handleProgressChange}
          data-testid="progress-bar"
        >
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            />
            <div 
              className="progress-bar-thumb" 
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>
        <div className="time-display">
          <span data-testid="current-time">{formatTime(currentTime)}</span>
          <span data-testid="duration">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play/Pause Button */}
      <div className="controls-section">
        <button 
          className="play-pause-btn"
          onClick={togglePlayPause}
          data-testid="play-pause-btn"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>

      {/* Scrollable Track List */}
      <div className="track-list-scrollable">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`track-item ${index === currentTrackIndex ? 'active' : ''}`}
            onClick={() => switchTrack(index)}
            data-testid={`track-item-${index}`}
          >
            <img 
              src={track.imageUrl}
              alt={track.title}
              className="track-thumbnail"
            />
            <div className="track-details">
              <div className="track-item-title">{track.title}</div>
              <div className="track-item-description">{track.description}</div>
            </div>
            {index === currentTrackIndex && isPlaying && (
              <div className="playing-indicator" data-testid="playing-indicator">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Admin link */}
      <div className="viewer-footer">
        <Link to="/admin" className="settings-link" data-testid="admin-link">
          <Settings size={16} />
          Admin Panel
        </Link>
      </div>

      {/* Hidden Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          data-testid="audio-element"
        />
      )}
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audioUrl: "",
    imageUrl: ""
  });

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await axios.get(`${API}/tracks`);
      setTracks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      toast.error("Failed to load tracks");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTrack) {
        await axios.put(`${API}/tracks/${editingTrack.id}`, formData);
        toast.success("Track updated successfully");
      } else {
        await axios.post(`${API}/tracks`, formData);
        toast.success("Track created successfully");
      }
      
      setDialogOpen(false);
      resetForm();
      fetchTracks();
    } catch (error) {
      console.error("Error saving track:", error);
      toast.error("Failed to save track");
    }
  };

  const handleEdit = (track) => {
    setEditingTrack(track);
    setFormData({
      title: track.title,
      description: track.description,
      audioUrl: track.audioUrl,
      imageUrl: track.imageUrl
    });
    setDialogOpen(true);
  };

  const handleDelete = async (trackId) => {
    if (!window.confirm("Are you sure you want to delete this track?")) return;
    
    try {
      await axios.delete(`${API}/tracks/${trackId}`);
      toast.success("Track deleted successfully");
      fetchTracks();
    } catch (error) {
      console.error("Error deleting track:", error);
      toast.error("Failed to delete track");
    }
  };

  const resetForm = () => {
    setEditingTrack(null);
    setFormData({
      title: "",
      description: "",
      audioUrl: "",
      imageUrl: ""
    });
  };

  const handleDialogChange = (open) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Guitar Pickup Comparison</h1>
          <p className="admin-subtitle">Manage your pickup sample tracks</p>
        </div>
        <div className="admin-actions">
          <Link to="/" data-testid="view-widget-link">
            <Button variant="outline" className="view-widget-btn">
              View Widget
            </Button>
          </Link>
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button className="add-track-btn" data-testid="add-track-btn">
                <Plus size={16} className="mr-2" />
                Add Track
              </Button>
            </DialogTrigger>
            <DialogContent className="dialog-content">
              <DialogHeader>
                <DialogTitle>{editingTrack ? "Edit Track" : "Add New Track"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="track-form">
                <div className="form-field">
                  <Label htmlFor="title">Track Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Humbucker Bridge Position"
                    required
                    data-testid="track-title-input"
                  />
                </div>
                <div className="form-field">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="e.g., Gibson 498T - Warm tone with clarity"
                    required
                    data-testid="track-description-input"
                  />
                </div>
                <div className="form-field">
                  <Label htmlFor="audioUrl">Audio URL</Label>
                  <Input
                    id="audioUrl"
                    value={formData.audioUrl}
                    onChange={(e) => setFormData({...formData, audioUrl: e.target.value})}
                    placeholder="https://cdn.shopify.com/audio/pickup-sample.mp3"
                    required
                    data-testid="track-audio-url-input"
                  />
                </div>
                <div className="form-field">
                  <Label htmlFor="imageUrl">Image URL (square)</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://cdn.shopify.com/images/pickup.jpg"
                    required
                    data-testid="track-image-url-input"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" data-testid="save-track-btn">
                    {editingTrack ? "Update Track" : "Create Track"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading-state">Loading tracks...</div>
        ) : tracks.length === 0 ? (
          <div className="empty-state">
            <p>No tracks yet. Add your first pickup sample!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((track) => (
                <TableRow key={track.id} data-testid={`track-row-${track.id}`}>
                  <TableCell>
                    <img 
                      src={track.imageUrl} 
                      alt={track.title}
                      className="admin-track-thumbnail"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{track.title}</TableCell>
                  <TableCell className="text-muted">{track.description}</TableCell>
                  <TableCell>
                    <div className="action-buttons">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(track)}
                        data-testid={`edit-track-${track.id}`}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(track.id)}
                        data-testid={`delete-track-${track.id}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ViewerWidget />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
