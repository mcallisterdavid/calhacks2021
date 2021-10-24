## Inspiration
As music enthusiasts, our team is always on the lookout for new ways to discover and experience songs. 
We sought out to make one and ended up somewhere in the middle of Spotify Wrapped and the Windows XP 3D pipes screensaver. 

## What it does
Front-end authenticates and reads a user's Spotify data to let them select a playlist to visualize. Our backend then leverages unsupervised machine learning (t-SNE) to identify implicit similarity patterns in the playlist's songs. It analyzes tempo, energy, popularity, loudness, speechiness, valence, and more to embed songs in a three-dimensional plot for users to orbit and explore. This point cloud renders in-browser for a seamless experience, delivering an attractive and performant user experience. Each node in the cloud is interactive. By clicking on any single one, the user can listen to the the corresponding song seamlessly through the Spotify Web Playback SDK. The end result is a stunning and immersive listening experience that leverages the latest in machine learning and web experiences.

## How we built it
**⚙️ Data Collection** -> Spotify API (REST, OAuth)

**📊 Data Processing** -> t-SNE, Python, Pandas, NumPy

**🎮 3-D Rendering and Interface** -> ReactJS, Three.js (WebGL)

**🎵 Music Playback** -> Spotify Web Playback SDK, Flask

## Challenges we ran into
Developing a web app with so many moving parts and integrations proved to be a daunting logistical challenge. We solved it by maintaining open communication and splitting up the components into different responsibilities that matched our skillsets. Still, finishing the project came down to the last hours.

## Accomplishments that we're proud of
We are all proud of the end-product that we were able to build. It certainly surpassed all of our expectations and we are excited to see other people use it. Even though we lacked extensive frontend knowledge, we tackled a rather complex 3D rendering JS library while maintaining performance/scalability. In addition, being able to finally take our theoretical 189 knowledge into the real world was fulfilling and exciting.

## What we learned
**🖌️ 3D on the Web** -> Entering this project, none of us had experience implementing demanding graphics in-browser. 

**📈 ML Applications** -> Taking machine learning from the classroom to a real deployed backend was a new and exciting experience for us. Proving characteristics about different models is important, but feeling the impact of data size, hyperparameters, and runtime put it in context.

## What's next for Sonic Galaxy
The next step for Sonic Galaxy is to improve the visualization. This can be accomplished by improving our t-SNE algorithm or potentially utilizing others. Another area to explore is gathering more data features or our processing pipeline. Perhaps, we can also integrate with VR in the future. Eventually, we hope we can build a product that might be interesting to integrate with Spotify.
