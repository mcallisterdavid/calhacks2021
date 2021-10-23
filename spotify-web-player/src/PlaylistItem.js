import React from 'react';
import { Image, Col } from "react-bootstrap"

function PlaylistPicker({ data }) {
    return (
        <>
            <Image style={{width: 200}} src={data.images[0]['url']} rounded fluid />
            <Col className="text-justify">
                {data.name}
                {data.description}
            </Col>
        </>
    )
}

export default PlaylistPicker;