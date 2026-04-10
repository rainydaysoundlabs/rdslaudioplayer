import { useState, useRef, useEffect } from "react";
import "@/App.css";
import { Play, Pause } from "lucide-react";

function AudioPlayer() {
  const [config, setConfig] = useState(null);
  const [trackSet, setTrackSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7); // Default 70%
  const audioRef = useRef(null);
  const savedTimeRef = useRef(0);

  useEffect(() => {
    // Load config first
    fetch('/config.json')
      .then(response => response.json())
      .then(data => setConfig(data))
      .catch(() => {
        // Use defaults if config not found
        setConfig({
          logoUrl: null,
          defaultTitle: "Pickup Comparison Player",
          defaultSubtitle: "Coming Soon"
        });
      });

    // Check for track set parameter
    const urlParams = new URLSearchParams(window.location.search);
    const setParam = urlParams.get('set');

    if (!setParam) {
      setLoading(false);
      return;
    }

    fetch(`/tracksets/${setParam}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Track set "${setParam}" not found`);
        }
        return response.json();
      })
      .then(data => {
        setTrackSet(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading track set:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!trackSet) return; // Only enable shortcuts when track set is loaded

    const handleKeyPress = (e) => {
      // Ignore if typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const tracks = trackSet.tracks || [];
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          // Previous track
          if (currentTrackIndex > 0) {
            switchTrack(currentTrackIndex - 1);
          }
          break;
        
        case 'ArrowDown':
          e.preventDefault();
          // Next track
          if (currentTrackIndex < tracks.length - 1) {
            switchTrack(currentTrackIndex + 1);
          }
          break;
        
        case 'ArrowLeft':
          e.preventDefault();
          // Seek backward 5s
          if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
          }
          break;
        
        case 'ArrowRight':
          e.preventDefault();
          // Seek forward 5s
          if (audioRef.current) {
            audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
          }
          break;
        
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
          e.preventDefault();
          const trackNum = parseInt(e.code.replace('Digit', '')) - 1;
          if (trackNum < tracks.length) {
            switchTrack(trackNum);
          }
          break;
        
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [trackSet, currentTrackIndex, isPlaying, duration]);

  // Set volume on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Loading state
  if (loading) {
    return (
      <div className="viewer-container">
        <div className="loading-state">Loading track set...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="viewer-container">
        <div className="error-state">
          <h2>Track Set Not Found</h2>
          <p>{error}</p>
          <p className="hint">Check the URL parameter or contact support.</p>
        </div>
      </div>
    );
  }

  // Default state - no track set parameter
  if (!trackSet && config) {
    return (
      <div className="default-container">
        <div className="default-content">
          <div className="logo-container">
            {config.logoUrl ? (
              <img 
                src={config.logoUrl} 
                alt="Logo" 
                className="custom-logo"
                onError={(e) => {
                  // Fallback to SVG if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <svg 
              className="rdsl-logo" 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: config.logoUrl ? 'none' : 'block' }}
            >
              <circle cx="100" cy="100" r="80" stroke="#d62028" strokeWidth="4" fill="none"/>
              <path d="M60 100 L90 70 L90 130 Z" fill="#d62028"/>
              <circle cx="130" cy="100" r="20" fill="#d62028"/>
            </svg>
          </div>
          <h1 className="default-title">{config.defaultTitle}</h1>
          <p className="default-subtitle">{config.defaultSubtitle}</p>
          <p className="default-hint">Add <code>?set=yourset</code> to the URL to load a track set</p>
        </div>
      </div>
    );
  }

  const tracks = trackSet?.tracks || [];
  const currentTrack = tracks[currentTrackIndex];

  if (tracks.length === 0) {
    return (
      <div className="viewer-container">
        <div className="empty-state">
          <p>This track set is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="viewer-container">
      {/* Set Name */}
      <div className="set-name" data-testid="set-name">
        {trackSet.setName}
      </div>

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

      {/* Volume Control */}
      <div className="volume-section">
        <div className="volume-label">Volume</div>
        <div className="volume-control">
          <span className="volume-icon">🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            data-testid="volume-slider"
          />
          <span className="volume-icon">🔊</span>
          <span className="volume-percentage">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="shortcuts-hint">
        <span>⌨️ Shortcuts: </span>
        <code>Space</code> Play/Pause · 
        <code>↑↓</code> Switch Tracks · 
        <code>←→</code> Seek · 
        <code>1-9</code> Jump to Track
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

function App() {
  return (
    <div className="App">
      <AudioPlayer />
    </div>
  );
}

export default App;
