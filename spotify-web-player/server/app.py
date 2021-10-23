from flask import Flask, request, redirect, send_from_directory
from urllib.parse import urlencode
import requests
from requests.auth import HTTPBasicAuth
import base64

from random import random
import math
import os

app = Flask(__name__)

spotify_client_id = os.environ.get('SPOTIFY_CLIENT_ID')
spotify_client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')

static_folder='build'

if os.environ.get('PRODUCTION') == True:
    BASE_URL = ''
else:
    BASE_URL = 'http://localhost:3000'


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
                user-read-private"

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
