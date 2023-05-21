import App from './export';

function App() {
  return (
    <div>
      <ReactHLS url={"http://localhost:8000/live/test/index.m3u8"} width='700' height='500'/>
    </div>
  );
}

export default App;