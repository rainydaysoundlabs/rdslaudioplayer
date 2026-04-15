import { useState, useRef, useEffect, useCallback } from "react";
import "@/App.css";
import { Play, Pause, Repeat, RotateCcw } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const RDSL_LOGO_URL = "https://cdn.shopify.com/s/files/1/0706/3191/5574/files/RDSL_Logo01.svg?v=1761855758";

function RDSLLogo() {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <svg className="rdsl-logo-svg" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="42" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="40" fill="#d62028">RDSL</text>
        <path d="M170 10 L185 30 L175 30 L185 50" stroke="#d62028" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  return (
    <img
      src={RDSL_LOGO_URL}
      alt="RDSL Logo"
      className="rdsl-logo-img"
      onError={() => setImgError(true)}
    />
  );
}

const POSITIONS = ["neck", "middle", "bridge"];

function AudioPlayer() {
  const [config, setConfig] = useState(null);
  const [trackSet, setTrackSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active selection: which pickup + which position
  const [activePickupId, setActivePickupId] = useState(null);
  const [activePosition, setActivePosition] = useState("neck");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [loopEnabled, setLoopEnabled] = useState(false);

  const audioRef = useRef(null);
  const savedTimeRef = useRef(0);

  useEffect(() => {
    fetch("/config.json")
      .then((r) => r.json())
      .then((data) => setConfig(data))
      .catch(() =>
        setConfig({
          logoUrl: null,
          defaultTitle: "Pickup Comparison Player",
          defaultSubtitle: "Coming Soon",
        })
      );

    const urlParams = new URLSearchParams(window.location.search);
    const setParam = urlParams.get("set");

    if (!setParam) {
      setLoading(false);
      return;
    }

    fetch(`/tracksets/${setParam}.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Track set "${setParam}" not found`);
        return response.json();
      })
      .then((data) => {
        setTrackSet(data);
        if (data.pickups && data.pickups.length > 0) {
          setActivePickupId(data.pickups[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get current audio URL
  const getActiveAudioUrl = useCallback(() => {
    if (!trackSet || !activePickupId) return null;
    const pickup = trackSet.pickups.find((p) => p.id === activePickupId);
    if (!pickup) return null;
    return pickup.positions[activePosition]?.audioUrl || null;
  }, [trackSet, activePickupId, activePosition]);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Switch pickup or position with synced playhead
  const switchAudio = useCallback(
    (pickupId, position) => {
      if (pickupId === activePickupId && position === activePosition) return;

      const wasPlaying = isPlaying;
      const savedTime = audioRef.current?.currentTime || 0;
      savedTimeRef.current = savedTime;

      setActivePickupId(pickupId);
      setActivePosition(position);

      if (audioRef.current) {
        const handleCanPlay = () => {
          if (audioRef.current) {
            audioRef.current.currentTime = savedTimeRef.current;
            if (wasPlaying) {
              audioRef.current.play();
            }
          }
          audioRef.current?.removeEventListener("canplay", handleCanPlay);
        };
        audioRef.current.addEventListener("canplay", handleCanPlay);
      }
    },
    [activePickupId, activePosition, isPlaying]
  );

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleProgressChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));

  const handleReset = useCallback(() => {
    setVolume(0.7);
    if (trackSet?.pickups?.length > 0) {
      setActivePickupId(trackSet.pickups[0].id);
      setActivePosition("neck");
    }
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, [trackSet]);

  const toggleLoop = useCallback(() => setLoopEnabled((prev) => !prev), []);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Set volume + loop on audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = loopEnabled;
  }, [loopEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!trackSet) return;

    const handleKeyPress = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const pickups = trackSet.pickups || [];
      const currentIndex = pickups.findIndex((p) => p.id === activePickupId);

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) switchAudio(pickups[currentIndex - 1].id, activePosition);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < pickups.length - 1) switchAudio(pickups[currentIndex + 1].id, activePosition);
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
          break;
        case "KeyL":
          e.preventDefault();
          toggleLoop();
          break;
        case "KeyR":
          e.preventDefault();
          handleReset();
          break;
        case "KeyN":
          e.preventDefault();
          if (activePickupId) switchAudio(activePickupId, "neck");
          break;
        case "KeyM":
          e.preventDefault();
          if (activePickupId) switchAudio(activePickupId, "middle");
          break;
        case "KeyB":
          e.preventDefault();
          if (activePickupId) switchAudio(activePickupId, "bridge");
          break;
        default: {
          const num = parseInt(e.code.replace("Digit", "")) - 1;
          if (!isNaN(num) && num >= 0 && num < pickups.length) {
            e.preventDefault();
            switchAudio(pickups[num].id, activePosition);
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [trackSet, activePickupId, activePosition, isPlaying, duration, togglePlayPause, switchAudio, toggleLoop, handleReset]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const audioUrl = getActiveAudioUrl();

  // --- RENDER STATES ---

  if (loading) {
    return (
      <div className="player-wrapper">
        <div className="player-container">
          <div className="state-message">Loading track set...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="player-wrapper">
        <div className="player-container">
          <div className="state-message">
            <h2 className="error-title">Track Set Not Found</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trackSet && config) {
    return (
      <div className="default-screen">
        <div className="default-inner">
          <div className="logo-wrap">
            <RDSLLogo />
          </div>
          <h1 className="default-title">{config.defaultTitle}</h1>
          <p className="default-subtitle">{config.defaultSubtitle}</p>
          <p className="default-hint">
            Add <code>?set=yourset</code> to the URL to load a track set
          </p>
        </div>
      </div>
    );
  }

  const pickups = trackSet?.pickups || [];

  if (pickups.length === 0) {
    return (
      <div className="player-wrapper">
        <div className="player-container">
          <div className="state-message">This track set is empty.</div>
        </div>
      </div>
    );
  }

  const activePickup = pickups.find((p) => p.id === activePickupId);

  return (
    <div className="player-wrapper">
      <div className="player-container">
        {/* Header: Logo + Set Name */}
        <div className="player-header">
          <div className="header-logo">
            <RDSLLogo />
          </div>
          <div className="header-text">
            <div className="set-label" data-testid="set-name">{trackSet.setName}</div>
          </div>
        </div>

        {/* Now Playing */}
        {activePickup && (
          <div className="now-playing" data-testid="now-playing">
            <span className="now-playing-label">Now Playing:</span>
            <span className="now-playing-title">{activePickup.title}</span>
            <span className="now-playing-pos">{activePosition}</span>
          </div>
        )}

        {/* Transport Controls */}
        <div className="transport">
          <button
            className={`transport-btn ${loopEnabled ? "active" : ""}`}
            onClick={toggleLoop}
            data-testid="loop-btn"
            title="Loop (L)"
          >
            <Repeat size={16} />
          </button>

          <button
            className="play-btn"
            onClick={togglePlayPause}
            data-testid="play-pause-btn"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>

          <button
            className={`transport-btn`}
            onClick={handleReset}
            data-testid="reset-btn"
            title="Reset (R)"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-area">
          <div className="progress-clickable" onClick={handleProgressChange} data-testid="progress-bar">
            <div className="progress-rail">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
              <div className="progress-thumb" style={{ left: `${progress}%` }} />
            </div>
          </div>
          <div className="time-row">
            <span data-testid="current-time">{formatTime(currentTime)}</span>
            <span data-testid="duration">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="volume-area">
          <span className="vol-label">Vol</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="vol-slider"
            data-testid="volume-slider"
          />
          <span className="vol-pct">{Math.round(volume * 100)}%</span>
        </div>

        {/* Shortcuts */}
        <div className="shortcuts-bar">
          <code>Space</code> Play
          <code>N</code><code>M</code><code>B</code> Position
          <code>&#8593;&#8595;</code> Pickup
          <code>&#8592;&#8594;</code> Seek
          <code>L</code> Loop
          <code>R</code> Reset
        </div>

        {/* Accordion Track List */}
        <div className="accordion-area" data-testid="accordion-area">
          <Accordion type="multiple" defaultValue={pickups.map((p) => p.id)}>
            {pickups.map((pickup) => {
              const isActivePickup = pickup.id === activePickupId;

              return (
                <AccordionItem
                  key={pickup.id}
                  value={pickup.id}
                  className={`accordion-item ${isActivePickup ? "is-active" : ""}`}
                  data-testid={`accordion-${pickup.id}`}
                >
                  <AccordionTrigger className="accordion-trigger" data-testid={`accordion-trigger-${pickup.id}`}>
                    <div className="accordion-header-content">
                      <div className="accordion-title">{pickup.title}</div>
                      <div className="accordion-desc">{pickup.description}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="accordion-body">
                    <div className="position-buttons">
                      {POSITIONS.map((pos) => {
                        const isActive = isActivePickup && activePosition === pos;
                        return (
                          <button
                            key={pos}
                            className={`pos-btn ${isActive ? "active" : ""}`}
                            onClick={() => switchAudio(pickup.id, pos)}
                            data-testid={`pos-btn-${pickup.id}-${pos}`}
                          >
                            {pos.charAt(0).toUpperCase() + pos.slice(1)}
                            {isActive && isPlaying && (
                              <span className="playing-dot" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            data-testid="audio-element"
          />
        )}
      </div>
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
