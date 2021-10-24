import React, { useState, useEffect } from 'react';
import { Container, Col, ListGroup, ListGroupItem, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlaylistItem from './PlaylistItem'
import demoData from './tsne400Dataset.json'

function PlaylistPicker({ token, setSelectedPlaylist, setTsneData }) {

    const [playlists, setPlaylists] = useState([]);
    const [userData, setUserData] = useState({});


    const grabTsneData = (selectedPlaylist) => {
        setSelectedPlaylist(selectedPlaylist);
        const queryTSNE = async () => {
          if (selectedPlaylist) {
            console.log(userData)
              // Make API call for data
              let body = JSON.stringify({
                access_token: token,
                userId: userData.id,
                playlistId: selectedPlaylist,
              })
              let res = await fetch("/data/tsne", {
                body: body,
                headers: {
                  "Content-Type": "application/json"
                },
                method: "POST"

              })
              console.log(res)
            let json = await res.json()
            console.log(json)
            setTsneData(json)
          }

        }
        console.log("TSNE")
        queryTSNE()
    }

    useEffect(() => {

        let getData = async () => {
            console.log(token)
            let res = await fetch("https://api.spotify.com/v1/me", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                }
            });
            let userData = await res.json();
            let playlistRes = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`,
                { headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            })
            let playlistJson = await playlistRes.json()
            setUserData(userData);
            setPlaylists(playlistJson.items);
        }
        getData();
    }, [token])

    if (token) {
        if (playlists) {
            return (
                <Container style={{overflowY: "scroll", height: "100vh"}}>
                    <h1>Pick a Playlist to visualize or enter the demo. We ran into some compute-time issues when hosting so the demo uses a pre-computed data mapping.</h1>
                    <Button onClick={() => {
                        setSelectedPlaylist("demo");
                        setUserData({id: "Demo User"});
                        setTsneData(demoData);
                    }}>Enter Demo!</Button>
                    <Col>
                        <ListGroup>
                            {playlists.map(playlist => <ListGroupItem key={playlist.id} onClick={grabTsneData.bind(this, playlist.id)} className="py-3 sm" action ><PlaylistItem data={playlist} /></ListGroupItem>)}
                        </ListGroup>
                    </Col>
                </Container>
            )
        } else {
            return <h1>Playlist Picker</h1>
        }
    } else {
        return <h1>Need to authenticate!</h1>
    }
}

export default PlaylistPicker;