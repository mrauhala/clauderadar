import './KeyboardHelp.css';

export default function KeyboardHelp() {
  return (
    <div className="keyboard-help">
      <h2>Keyboard Shortcuts</h2>
      <div className="shortcuts-grid">
        <div className="shortcut">
          <kbd>Space</kbd>
          <span>Play/Pause Animation</span>
        </div>
        <div className="shortcut">
          <kbd></kbd>
          <span>Previous Frame</span>
        </div>
        <div className="shortcut">
          <kbd></kbd>
          <span>Next Frame</span>
        </div>
        <div className="shortcut">
          <kbd>A</kbd>
          <span>Change Animation Speed</span>
        </div>
        <div className="shortcut">
          <kbd>G</kbd>
          <span>Toggle Geolocation</span>
        </div>
        <div className="shortcut">
          <kbd>S</kbd>
          <span>Toggle Satellite Layer</span>
        </div>
        <div className="shortcut">
          <kbd>R</kbd>
          <span>Toggle Radar Layer</span>
        </div>
        <div className="shortcut">
          <kbd>L</kbd>
          <span>Toggle Lightning Layer</span>
        </div>
        <div className="shortcut">
          <kbd>O</kbd>
          <span>Toggle Observations</span>
        </div>
        <div className="shortcut">
          <kbd>+</kbd>
          <span>Zoom In</span>
        </div>
        <div className="shortcut">
          <kbd>-</kbd>
          <span>Zoom Out</span>
        </div>
        <div className="shortcut">
          <kbd>Ctrl</kbd>
          <span>Show/Hide This Help</span>
        </div>
      </div>
    </div>
  );
}

