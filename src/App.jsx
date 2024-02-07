import { useState } from 'react';
import './App.scss';
import { Nav } from './components/Nav';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { Gallery } from './pages/gallery';
import { Guide } from './pages/guide';
import { Contact } from './pages/contact';
import { About } from './pages/about';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
