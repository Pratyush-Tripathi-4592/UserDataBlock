import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Routes } from 'react-router-dom';
import Seller from './Seller';
import Government from './Government';
import CreditedPerson from './CreditedPerson';

function App() {
    return (
        <Router>
            <div>
                <h1>Transaction Manager DApp</h1>
                <nav>
                    <Link to="/">Seller</Link>
                    <Link to="/government">Government</Link>
                    <Link to="/credited-person">Credited Person</Link>
                </nav>
                <Routes>
                    <Route path="/" exact element={<Seller />} />
                    <Route path="/government" element={<Government />} />
                    <Route path="/credited-person" element={<CreditedPerson />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
