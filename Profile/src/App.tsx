import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './components/pages/Home';
import { Profile } from './components/pages/Profile';
import { Chatbox } from './components/pages/Chatbox';

export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chatbox" element={<Chatbox />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
