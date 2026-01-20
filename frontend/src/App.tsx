import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UIModeProvider } from './contexts/UIModeContext';
import { Dashboard } from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <UIModeProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </UIModeProvider>
    </BrowserRouter>
  );
}

export default App;
