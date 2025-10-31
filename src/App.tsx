import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './component/HomeScreen';
import CandidateListingView from './component/CandidateListingView';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen  />} />
        <Route path="/candidates" element={<CandidateListingView />} />
      </Routes>
    </Router>
  );
}