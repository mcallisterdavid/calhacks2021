import React from 'react';
import { Image, Col } from "react-bootstrap"

function PlaylistPicker({ data }) {
    return (
        <>
            <Image style={{width: 200}} src={data.images[0]['url']} rounded fluid />
            <Col className="text-justify">
                <h1>{data.name}</h1>
                <h2>{data.description}</h2>
            </Col>
        </>
    )
}

export default PlaylistPicker;