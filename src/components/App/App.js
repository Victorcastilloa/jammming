import React from "react";
import "./App.css";
import SearchBar from "../SeachBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";
import Loading from '../Loading/Loading';
import Modal from 'react-modal';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      selectedTracks: [],
      playlistName: "My Playlist",
      playlistTracks: [],
      previewUrl: "",
      isLoading: false,
      isSaved: false,
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.searchTermUpdate = this.searchTermUpdate.bind(this)
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;

    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    } else {
      tracks.push(track);
      this.setState({ playlistTracks: tracks });
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter((currentTrack) => currentTrack.id !== track.id);
    this.setState({ playlistTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name,
    });
  }

  savePlaylist() {
    try {
      let trackers = this.state.playlistTracks;
      console.log(trackers);
      let trackUris = this.state.playlistTracks.map((track) => track.uri);
      this.setState({ isLoading: true });
      Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
        this.setState({
          playlistName: "New Playlist",
          playlistTracks: [],
          isLoading: false,
          isSaved: true,
        });

        setTimeout(() => {
          this.setState({ isSaved: false });
        }, 2000);
      });
    } catch (error) {
      console.log(error);
      alert("Add items first");
    }
  }

  search(term) {
    sessionStorage.setItem("searchTerm", term);
    Spotify.search(term).then((searchResults) => {
      this.setState({ searchResults: searchResults });
    });
  }

  searchTermUpdate() {
    const searchTerm = sessionStorage.getItem("searchTerm");
    if (searchTerm) {

      this.setState({ searchTerm });
      
      sessionStorage.removeItem("searchTerm");
    }
  }

  render() {
    return this.state.isLoading ? (
      <Loading />
    ) : (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} value={this.state.searchTerm} />
          <div className="App-playlist">
            <Modal
              isOpen={this.state.isSaved}
              style={{
                overlay: {
                  backgroundColor: "rgba(256, 256, 256, 0)",
                  width: "100%",
                  height: "100%",
                },
                content: {
                  color: "#white",
                  textAlign: "center",
                  padding: "0",
                  backgroundColor: "rgba(256, 256, 256, 0.3)",
                  position: "relative",
                  top: "50%",
                  right: "10%",
                  maxWidth: "100%",
                  float: "center",
                  margin: "5%",
                },
              }}
              contentLabel="Playlist Saved"
            >
              <div className="modal">
                <h2>Playlist saved</h2>
              </div>
            </Modal>

            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
};


export default App;
