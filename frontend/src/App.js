import React from 'react';
import ParedaoVotacao from './components/ParedaoVotacao/ParedaoVotacao';
import Estatisticas from './components/Estatisticas/Estatisticas';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ParedaoVotacao />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
      </Routes>
    </Router>
  );
}

export default App;
