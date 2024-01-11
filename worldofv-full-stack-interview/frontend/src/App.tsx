import React from 'react';
import TracksList from './components/TracksList';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Tracks List</h1>
      <TracksList pageSize={25} />
    </div>
  );
};

export default App;
