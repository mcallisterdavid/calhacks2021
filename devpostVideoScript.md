# CalHacks 2021 DevPost Video Script

### Rough Structure:

1. explain main idea briefly + process at a high level (30 seconds)
2. Demo of product with certain data set / playlist (1 min 30 seconds)
    a. walk through authentication process, explain token generation through API call (20 seconds)
    b. walk through playlist selection process, (5 seconds)
    c. show visualization + explain what we're seeing (20 seconds)
    d. click on song, explain how it plays, explain clustering / reduction of high dimensionality (25 seconds)
    e. demonstrate controls in visualization (20 seconds)

### Actual Script

Our goal with this project was to create a web application that would allow users to explore their
music taste visually, that they could then share with their friends using blockchain technology. 

Specifically, we created integrations with spotify that allows users to create a 3d rendering of any
playlist they have, and navigate this music world visually and auditorily. 

** here we demo along with explanation
** pull up the website, starting with user auth

Our web app is hosted on Heroku, with a flask backend. When visiting our website, users first 
authorize spotify to read specific parts of their data, granting us access to an oauth token. 
The authorization allows us to pull data from the spotify web API, like the list of playlists they have

** accept auth and go to playlists

Here, the user chooses a specific playlist whose songs will be rendered. 

** choose a playlist and talk while it loads

When we fetch data from spotify, each song has many features that spotify tracks behind the scenes, 
such as tempo, danceability, energy, speechiness, etc. With this high-dimensional feature space, we 
want to reduce the dimensionality to something that it comprehendible to humans, i.e. in 3D. We accomplish this
reduction by using TSNE. 

This 3d world shown here is rendered using react and 3js. Each dot here represents a song, and its coordinates are 
given by the TSNE vectors. This means that songs that are closer together have features that are more highly correlated
or similar to the other. 

** demo world controls

We can control how we orbit the world in many ways; 's' and 'f' keys speed up the orbit, 'z' toggles the zoom. 
'r' reverses the orbit, and space bar pauses the orbit. 
