import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import MaintenanceDashboard from './components/MaintenanceDashboard';
import ManagementDashboard from './components/ManagementDashboard';
import TenantDashboard  from "./components/TenantDashboard";
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <div className="navbar">
                    <ul>
                        <li><Link to="/maintenance-dashboard">Maintenance Dashboard</Link></li>
                        <li><Link to="/management-dashboard">Management Dashboard</Link></li> {/* New Link */}
                        <li><Link to="/tenant-dashboard">Tenant Dashboard</Link></li>
                    </ul>
                </div>
                <div className="container">
                    <Routes>
                        <Route path="/maintenance-dashboard" element={<MaintenanceDashboard />} />
                        <Route path="/management-dashboard" element={<ManagementDashboard />} /> {/* New Route */}
                        <Route path="/tenant-dashboard" element={<TenantDashboard />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
