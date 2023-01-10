import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction() {
    if (this.props.isRemoval) {
      return (
        <button
          className="Track-action"
          onClick={this.removeTrack}
        >
          -
        </button>
      );
    } else {
      return (
        <button
          className="Track-action"
          onClick={this.addTrack}
        >
          +
        </button>
      );
    }
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <div className="audio">
            <audio
              src={this.props.track.preview_url}
              controls
              type= 'audio/mpeg'
              aria-roledescription={`${this.props.track.name} by ${this.props.track.artists}`}
            />
          </div>
          <p>
            {this.props.track.artists} | {this.props.track.album}
          </p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;