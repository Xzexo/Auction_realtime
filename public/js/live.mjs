import React from 'react';
import ReactHLS from 'react-hls';

function Live() {
  return (

      <ReactHLS url={"http://localhost:8000/live/test/index.m3u8"} width='700' height='500'/>

  );
}
