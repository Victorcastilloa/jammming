

let userAccessToken;
let expiresInMatch;
const clientID = "bce7953733c640668816dceaada69755";
const redirectURI = "http://localhost:3000/";

const Spotify = {
  getAccessToken() {
    
    if (userAccessToken) {
      const currentTime = new Date().getTime() / 1000; // in seconds
      if (currentTime >= expiresInMatch) {
        userAccessToken = null;
      } else {
        return userAccessToken;
      }
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expirationTimeMatch =
      window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expirationTimeMatch) {
      userAccessToken = accessTokenMatch[1];
      const expiresIn = new Date().getTime() / 1000 + Number(expiresInMatch[1]);

      window.setTimeout(() => (userAccessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return userAccessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location.replace(accessUrl);
    }
  },

  search(term) {
    const access_token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { Authorization: `Bearer ${access_token}` },
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists[0].name,
          album: track.album.name,
          preview_url: track.preview_url,
          uri: track.uri,
        }));
      });
  },

  savePlaylist(name, trackUri) {
    if (!name || !trackUri.length) {
      return;
    }

    const access_token = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-type": "application/json",
    };
    let userId;

    return fetch(`https://api.spotify.com/v1/me`, {
      headers: headers,
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({
            name: name,
          }),
        });
      })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        let playlistId = jsonResponse.id;
        console.log(playlistId);
        return fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks/`,
          {
            headers: headers,
            method: "POST",
            body: JSON.stringify({
              uris: trackUri,
            }),
          }
        );
      })
      .then(console.log(trackUri));
  },
};

export default Spotify;