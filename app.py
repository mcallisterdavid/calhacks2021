from flask import Flask, request, redirect, send_from_directory, jsonify
from urllib.parse import urlencode
import requests
from requests.auth import HTTPBasicAuth
import base64

from random import random
import math
import os

from spotipyTSNE import tsne_spotify

app = Flask(__name__, static_folder='./client/build', static_url_path='/')

spotify_client_id = os.environ.get('SPOTIFY_CLIENT_ID')
spotify_client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')

# if os.environ.get('PRODUCTION') == 'TRUE':
#     BASE_URL = ''
# else:
#     BASE_URL = 'http://127.0.0.1:5000/'
BASE_URL = 'https://spotify-visualization-calhacks.herokuapp.com'


def gen_random_string(length):
    text = ''
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for _ in range(length):
        text += possible[math.floor(random() * len(possible))]
    return text

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')



@app.route("/auth/login", methods=['GET'])
def login():
    scope = "streaming \
                user-read-email \
                user-read-private \
                playlist-read-private \
                app-remote-control \
                "

    state = gen_random_string(16);

    auth_query_parameters = urlencode({
        'response_type': "code",
        'client_id': spotify_client_id,
        'scope': scope,
        'redirect_uri': BASE_URL + "/auth/callback",
        'state': state
    })

    return redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters);

@app.route('/auth/callback', methods=['GET'])
def auth_callback():
    code = request.args.get('code');

    auth_options = {
        'url': 'https://accounts.spotify.com/api/token',
        'form': {
        'code': code,
        'redirect_uri': BASE_URL + "/auth/callback",
        'grant_type': 'authorization_code'
        },
        'headers': {
        'Authorization': 'Basic ' + str(base64.b64encode(bytes(spotify_client_id + ':' + spotify_client_secret, 'utf-8'))),
        'Content-Type' : 'application/x-www-form-urlencoded'
        },
        'json': True
    }

    auth_obj = HTTPBasicAuth(spotify_client_id, spotify_client_secret)
    headers = auth_options['headers']
    data = auth_options['form']

    r = requests.post('https://accounts.spotify.com/api/token', auth=auth_obj, data=data, headers=headers)
    print(r)
    data = r.json()
    if r.status_code == 200:
        access_token = data['access_token']
        print(access_token)
        return redirect('/?' + urlencode({'access_token': access_token}))

@app.route('/data/tsne', methods=['POST'])
def tsne_data():
    data = request.json
    print(data)
    token = data['access_token']
    username = data['userId']
    playlistID = data['playlistId']
    return tsne_spotify(token, username, playlistID)

if __name__ == '__main__':
    app.run(port=(os.getenv('PORT') if os.getenv('PORT') else 8000), debug=False)