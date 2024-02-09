import { useState } from 'react';
import './App.scss';
import { Nav } from './components/Nav';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Home } from './pages/home';
import { Gallery } from './pages/gallery';
import { Guide } from './pages/guide';
import { Contact } from './pages/contact';
import { About } from './pages/about';
import { Specialties } from './components/Guide/Specialties';
import { Progressions } from './components/Guide/Progressions';
import { Branches } from './components/Guide/Branches';
import { Button } from '@nextui-org/react';
import { NotFound } from './components/Errors/NotFound';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/gallery" element={<Gallery />} exact />
        <Route path="/about" element={<About />} exact />
        <Route path="/guide/" element={<Guide />} exact>
          <Route path="specialties" element={<Specialties />} />
          <Route path="progressions" element={<Progressions />} />
          <Route path="branches" element={<Branches />} />
        </Route>
        <Route path="/contact" element={<Contact />} exact />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
