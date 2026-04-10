import { useState, useRef, useEffect } from "react";
import "@/App.css";
import { Play, Pause } from "lucide-react";

const tracks = [
  {
    title: "Midnight Sonata",
    artist: "Boutique Records",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Golden Hour Groove",
    artist: "Boutique Records",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Velvet Whispers",
    artist: "Boutique Records",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Obsidian Echoes",
    artist: "Boutique Records",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    title: "The Gilded Path",
    artist: "Boutique Records",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  }
];

function AudioWidget() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const savedTimeRef = useRef(0);

  const currentTrack = tracks[currentTrackIndex];

  // Handle play/pause
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

  // Handle track switching with sync
  const switchTrack = (index) => {
    if (index === currentTrackIndex) return;
    
    const wasPlaying = isPlaying;
    const savedTime = audioRef.current?.currentTime || 0;
    savedTimeRef.current = savedTime;
    
    setCurrentTrackIndex(index);
    
    // Wait for new track to load, then restore time
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

  // Update time as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Set duration when metadata loads
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle progress bar click/drag
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

  // Format time as mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="widget-container">
      {/* Album Art & Title */}
      <div className="widget-header">
        <img 
          src="https://images.unsplash.com/photo-1758883019110-04c79dc56a71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMGRhcmslMjBsdXh1cnklMjBnb2xkfGVufDB8fHx8MTc3NTc5MTk4NHww&ixlib=rb-4.1.0&q=85"
          alt="Album Art"
          className="album-art"
        />
        <div className="track-info">
          <h2 className="track-title" data-testid="current-track-title">{currentTrack.title}</h2>
          <p className="track-artist" data-testid="current-track-artist">{currentTrack.artist}</p>
        </div>
      </div>

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

      {/* Track List */}
      <div className="track-list">
        {tracks.map((track, index) => (
          <div
            key={index}
            className={`track-item ${index === currentTrackIndex ? 'active' : ''}`}
            onClick={() => switchTrack(index)}
            data-testid={`track-item-${index}`}
          >
            <div className="track-number">{String(index + 1).padStart(2, '0')}</div>
            <div className="track-details">
              <div className="track-item-title">{track.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        data-testid="audio-element"
      />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <AudioWidget />
    </div>
  );
}

export default App;
