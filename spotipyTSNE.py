import numpy as np
import pandas as pd
import spotipy
import spotipy.util as util
from sklearn.manifold import TSNE
import time


def main():

	# configure token

	SPOTIPY_CLIENT_ID="70c49e55eae64f0a82b313830c6cebf3"
	SPOTIPY_CLIENT_SECRET="cb5063c70a514acebca3481a37f15e01"
	SPOTIPY_REDIRECT_URI = "http://localhost"
	username='axw2001d'
	scope="playlist-read-private"
	token = util.prompt_for_user_token(username, 
	                                   scope, 
	                                   client_id=SPOTIPY_CLIENT_ID, 
	                                   client_secret=SPOTIPY_CLIENT_SECRET, 
	                                   redirect_uri=SPOTIPY_REDIRECT_URI
	                                  )

	playlistID = '2NQemdvdAfjpxKymXLilBK' # test playlistID input
	playlistSongs = getPlaylistSongs(username, playlistID, token) # dataframe of the songs in playlistID
	data = generate_TSNE(playlistSongs) # adds three columns to prev df, with TSNE coords
	tsneCoords = data[['tsne-one', 'tsne-two', 'tsne-three']]
	return tsneCoords

# get the playlists for the username and token; can print this intermediately
# also gets the playlist IDs; might want dictionary of playlist name to playlistID

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
    
    features_list = ["artist", "album", "album_release_date", "track_name", "track_id", 
                         "explicit", "popularity", "danceability", "energy", "key", 
                         "loudness", "mode", "speechiness","instrumentalness","liveness",
                         "valence","tempo", "duration_ms","time_signature"]
    df = pd.DataFrame(columns = features_list[:7])
    
    if token:
        sp = spotipy.Spotify(auth=token)
        results = sp.user_playlist_tracks(username, playlistID)
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
        
        for feature in features_list[7:]:
            df[feature] = [track[feature] for track in audio_features]
        
        return df
    else:
        return ("Can't get token for", username)

def cleanData(df):
    
    # getting only month of release date and added time
    df['album_release_date'] = df['album_release_date'].str.slice(0, 4)
    df['added_time'] = df['added_time'].str.slice(0, 4)
    
    # setting index and dropping irrelevant columns
    df.index = df['track_id']
    df = df.drop(['artist', 'album', 'track_name', 'track_id'], axis=1)
        
    # add a few columns as categorical features
    df['key'] = df['key'].astype(str)
    df['mode'] = df['mode'].astype(str)
    df['time_signature'] = df['time_signature'].astype(str)
    df['popularity'] = df['popularity'].astype(int)
        
    # getting dummies
    df = pd.get_dummies(df)
        
    # normalization
    columns_to_normalize = ['popularity', 'danceability', 'energy', 'loudness', 
    						'speechiness', 'instrumentalness', 'liveness', 
    						'valence', 'tempo', 'duration_ms']
    for column in columns_to_normalize:
        df[column] = (df[column] - df[column].mean()) / df[column].std()
    
    return df

def generate_TSNE(df):
    # df = pd.read_csv(path).iloc[:, 1:]
    normed_df = cleanData(df)
    
    # np.random.seed(42)
    time_start = time.time()
    tsne = TSNE(n_components=3, verbose=1, perplexity=40, n_iter=300)
    tsne_results = tsne.fit_transform(normed_df)
    print('t-SNE done! Time elapsed: {} seconds'.format(time.time()-time_start))

    normed_df['tsne-one'] = tsne_results[:,0]
    normed_df['tsne-two'] = tsne_results[:,1]
    normed_df['tsne-three'] = tsne_results[:,2]
    
    return normed_df

main()