import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import PlaylistPicker from './PlaylistPicker';
import './App.css';
import Visualization from './Visualization';

function App() {

  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [userData, setUserData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [token, setToken] = useState('')

  useEffect(() => {
    if (selectedPlaylist) {
        // Make API call for data
    }
  }, [selectedPlaylist])

  // Grab the token
  let potential_token = new URLSearchParams(window.location.search).get('access_token');
  if (potential_token && potential_token !== token) {
    setToken(potential_token);
  }

  if (loadingData) {
    return (
      <h1>Hi</h1>
    );
  }

  if (!selectedPlaylist) {
    return (
      <>
          { (!token) ? <Login/> : 
          <div>
            <PlaylistPicker token={token} setSelectedPlaylist={setSelectedPlaylist} setUserData={setUserData} />
          </div>
          }
      </>
    );
  } else {
    return (
      <Visualization token={token} className="p-0 m-0"/>
    )
  }
}

export default App;