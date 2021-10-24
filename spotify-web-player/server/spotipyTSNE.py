import numpy as np
import pandas as pd
from sklearn.manifold import TSNE
import spotipy
import spotipy.util as util
import time


def tsne_spotify(token, username, playlistID):
    # dataframe of the songs in playlistID
	playlistSongs = getPlaylistSongs(username, playlistID, token)

    # adds three columns to prev df, with TSNE coords
	data = generate_TSNE(playlistSongs) 

	return data[['artist', 'album', 'track_name', 'album_cover_url', 
                    'danceability', 'popularity', 'energy', 'loudness', 'duration_ms',
                    'speechiness', 'instrumentalness', 'liveness', 'tempo', 
                    'tsne-one', 'tsne-two', 'tsne-three']].to_json(orient='index')

# get the playlists for the username and token; not needed for current implementation
def getUserPlaylists(username, token):
    if token: 
        sp = spotipy.Spotify(auth=token)
        results = sp.user_playlists(username)
        
        names = [playlist['name'] for playlist in results['items']]
        ids = [playlist['id'] for playlist in results['items']]
        return pd.DataFrame({'Playlist Name': names, 'Playlist ID': ids})
    
    else:
        return ("Can't get token")
    

def getPlaylistSongs(username, playlistID, token):
    
    # playlist = getUserPlaylists(username, token)
    # playlistID = list(playlist[playlist['Playlist Name'] == playlistName]['Playlist ID'])[0]

    features_list = ["artist", "album", "album_release_date", "album_cover_url", "track_name", "track_id", 
                         "explicit", "popularity", "danceability", "energy", "key", 
                         "loudness", "mode", "speechiness","instrumentalness","liveness",
                         "valence","tempo", "duration_ms","time_signature"]
    df = pd.DataFrame(columns = features_list[:7])
    
    if token:
        sp = spotipy.Spotify(auth=token)
        results = sp.user_playlist_tracks(username, playlistID, limit=70)
        tracks = results['items']
        while results['next']:
            results = sp.next(results)
            tracks.extend(results['items'])
        
        for item in tracks:
            track = item['track']
            if track == None or track['id'] == None:
                continue
            features = {}
            
            # get metadata
            features['added_time'] = item['added_at']
            if len(track['album']['artists']) > 0:
                features['artist'] = track['album']['artists'][0]['name']
            else: 
                features['artist'] = None
            features['album_release_date'] = track['album']['release_date']
            features['album'] = track['album']['name']
            features['album_cover_url'] = track['album']['images'][0]['url']
            features['track_name'] = track['name']
            features['track_id'] = track['id']
            features['explicit'] = track['explicit']
            features['popularity'] = track['popularity']
            
            # concat dataframes
            track_df = pd.DataFrame(features, index=[0])
            df = pd.concat([df, track_df], ignore_index=True)
            
        track_ids = df['track_id']
        audio_features = []
        while len(track_ids) > 100:
            audio_features += sp.audio_features(','.join(track_ids[0:100]))
            track_ids = track_ids[100:]
        audio_features += sp.audio_features(','.join(track_ids))
        
        for feature in features_list[8:]:
            df[feature] = [track[feature] for track in audio_features]
        
        return df
    else:
        return ("Can't get token for", username)


def cleanData(df):
    
    # getting only month of release date and added time
    df = df.drop_duplicates()
    df['album_release_date'] = df['album_release_date'].str.slice(0, 4)
    df['added_time'] = df['added_time'].str.slice(0, 4)
    
    # setting index and dropping irrelevant columns
    df.index = df['track_id']
    df = df[~df.index.duplicated(keep='first')]

    ohe = df.drop(['artist', 'album', 'track_name', 'track_id', 'album_cover_url'], axis=1)
    
    # add a few columns as categorical features
    ohe['key'] = ohe['key'].astype(str)
    ohe['mode'] = ohe['mode'].astype(str)
    ohe['time_signature'] = ohe['time_signature'].astype(str)
    ohe['popularity'] = ohe['popularity'].astype(int)
        
    # getting dummies
    ohe = pd.get_dummies(ohe)
        
    # normalization
    columns_to_normalize = ['popularity', 'danceability', 'energy', 
                                'loudness', 'speechiness', 'instrumentalness', 
                                'liveness', 'valence', 'tempo', 'duration_ms']
    for column in columns_to_normalize:
        ohe[column] = (ohe[column] - ohe[column].mean()) / ohe[column].std()
    
    ohe['artist'] = df['artist']
    ohe['album'] = df['album']
    ohe['track_name'] = df['track_name']
#     ohe['track_id'] = df['track_id']
    ohe['album_cover_url'] = df['album_cover_url']
    
    return ohe

def generate_TSNE(df: pd.DataFrame()):
    normed_df = cleanData(df)
    
    # np.random.seed(42)
    time_start = time.time()
    tsne = TSNE(n_components=3, verbose=1, perplexity=40, n_iter=300)
    tsne_results = tsne.fit_transform(normed_df[normed_df.columns.difference(['artist', 'album', 'track_name', 'album_cover_url'])])
    print('t-SNE done! Time elapsed: {} seconds'.format(time.time()-time_start))

    normed_df['tsne-one'] = tsne_results[:,0]
    normed_df['tsne-two'] = tsne_results[:,1]
    normed_df['tsne-three'] = tsne_results[:,2]
    
    return normed_df
