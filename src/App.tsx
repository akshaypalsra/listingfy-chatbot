// App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './component/HomeScreen';
import CandidateListingView from './component/CandidateListingView';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/candidates" element={<CandidateListingView darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Routes>
    </Router>
  );
}