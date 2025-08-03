import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
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
                <Switch>
                    <Route path="/" exact component={Seller} />
                    <Route path="/government" component={Government} />
                    <Route path="/credited-person" component={CreditedPerson} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
