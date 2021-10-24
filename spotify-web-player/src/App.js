import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import PlaylistPicker from './PlaylistPicker';
import './App.css';
import Visualization from './Visualization';

function App() {

  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [tsneData, setTsneData] = useState({})
  const [token, setToken] = useState('')
  console.log("Selected:", selectedPlaylist)
  // useEffect(() => {
  //   console.log('Use Effect')
  //   const queryTSNE = async () => {
  //     if (selectedPlaylist) {
  //         // Make API call for data
  //         let body = {
  //           access_token: token,
  //           userId: userData.userId,
  //           playlistId: selectedPlaylist,
  //         }
  //         fetch("/data/tsne", {
  //           body: body,
  //           headers: {
  //             "Content-Type": "application/json"
  //           },
  //           method: "POST"
  //         })
  //     }
  //     let res = await queryTSNE()
  //     let json = await res.json()
  //     console.log(json)
  //   }
  //   // queryTSNE()
  // }, [])

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
            <PlaylistPicker token={token} setTsneData={setTsneData} setSelectedPlaylist={setSelectedPlaylist} />
          </div>
          }
      </>
    );
  } else {
    return (
      <Visualization token={token} className="p-0 m-0" tsneData={tsneData} />
    )
  }
}

export default App;