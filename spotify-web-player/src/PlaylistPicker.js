import React, { useState, useEffect } from 'react';
import { Container, Col, ListGroup, ListGroupItem} from 'react-bootstrap';

import PlaylistItem from './PlaylistItem'

function PlaylistPicker({ token, setSelectedPlaylist, setUserData }) {

    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        let getData = async () => {
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
                <Container>
                    <Col>
                        <ListGroup>
                            {playlists.map(playlist => <ListGroupItem onClick={() => setSelectedPlaylist(playlist.id)} className="py-3 sm" action ><PlaylistItem data={playlist} key={playlist.id} /></ListGroupItem>)}
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