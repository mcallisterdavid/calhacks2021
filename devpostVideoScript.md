# CalHacks 2021 DevPost Video Script

## Rough Structure:

1. explain main idea briefly + process at a high level (30 seconds)
2. Demo of product with certain data set / playlist (1 min 30 seconds)
    a. walk through authentication process, explain token generation through API call (20 seconds)
    b. walk through playlist selection process, (5 seconds)
    c. show visualization + explain what we're seeing (20 seconds)
    d. click on song, explain how it plays, explain clustering / reduction of high dimensionality (25 seconds)
    e. demonstrate controls in visualization (20 seconds)

### Explain Main Idea

goal: we wanted to create a web app that would allow users to explore their music taste visually, 
    which is shareable via blockchain technology
process: 
    1. user authentication, spotify oauth token
    2. fetch feature space via spotify web api
    3. reduce dimensionality with tSNE
    4. create a world rendered based on the reduced data in react 3js
    5. users inputs create iteractions with the 3js world that can start and stop audio
    6. use IPFS to create shareable json structure that can be used to explore friends' worlds
    7. poggers