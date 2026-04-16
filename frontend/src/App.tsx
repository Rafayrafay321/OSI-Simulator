import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage';
import { SimulationContainer } from './components/simulationPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/simulation" element={<SimulationContainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
