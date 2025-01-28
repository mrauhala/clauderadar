import { format } from 'date-fns';
import './Timeline.css';

interface TimelineProps {
  currentTime: string;
  availableTimes: string[];
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onTimeChange: (time: string) => void;
  onSpeedChange: (speed: number) => void;
}

export default function Timeline({
  currentTime,
  availableTimes,
  isPlaying,
  speed,
  onPlayPause,
  onTimeChange,
  onSpeedChange,
}: TimelineProps) {
  const currentIndex = availableTimes.indexOf(currentTime);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onTimeChange(availableTimes[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < availableTimes.length - 1) {
      onTimeChange(availableTimes[currentIndex + 1]);
    }
  };

  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;
    const index = Math.floor(position * availableTimes.length);
    if (index >= 0 && index < availableTimes.length) {
      onTimeChange(availableTimes[index]);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [500, 1000, 2000]; // milliseconds
    const currentSpeedIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentSpeedIndex + 1) % speeds.length];
    onSpeedChange(nextSpeed);
  };

  return (
    <div className="timeline">
      <div className="timeline-controls">
        <button 
          onClick={handleSpeedChange}
          title="Change Animation Speed (A)"
          className="control-button"
        >
          {speed === 500 ? '3' : speed === 1000 ? '2' : '1'}
        </button>
        <button 
          onClick={handlePrevious}
          title="Previous Frame (Left Arrow)"
          className="control-button"
        >
          
        </button>
        <button 
          onClick={onPlayPause}
          title="Play/Pause (Space)"
          className="control-button"
        >
          {isPlaying ? '' : ''}
        </button>
        <button 
          onClick={handleNext}
          title="Next Frame (Right Arrow)"
          className="control-button"
        >
          
        </button>
        <div className="timestamp">
          <div className="time">
            {currentTime ? format(new Date(currentTime), 'HH:mm') : '--:--'}
          </div>
          <div className="date">
            {currentTime ? format(new Date(currentTime), 'dd.MM.yyyy') : '--.--.----'}
          </div>
        </div>
      </div>
      
      <div className="timeline-slider" onClick={handleTimelineClick}>
        <div className="timeline-progress">
          {availableTimes.map((time, index) => (
            <div
              key={time}
              className={`timeline-marker ${index === currentIndex ? 'active' : ''}`}
              style={{
                left: `${(index / (availableTimes.length - 1)) * 100}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onTimeChange(time);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

