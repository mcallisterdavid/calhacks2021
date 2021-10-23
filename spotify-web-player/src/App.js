import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import PlaylistPicker from './PlaylistPicker';
import './App.css';

function App() {

  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [userData, setUserData] = useState({});
  const [loadingData, setLoadingData] = useState('false');

  useEffect(() => {
    if (selectedPlaylist) {
        // Make API call for data
    }
  }, [selectedPlaylist])

  let token = new URLSearchParams(window.location.search).get('access_token');
  if (token) {
    window.localStorage.setItem('token', token);
  }

  if (loadingData) {
    return (

    )
  }

  if (!selectedPlaylist) {
    return (
      <>
          { (!token) ? <Login/> : 
          <div>
            <WebPlayback token={token} /> 
            <PlaylistPicker token={token} setSelectedPlaylist={setSelectedPlaylist} />
          </div>
          }
      </>
    );
  } else {
    return (

    )
  }
}

export default App;