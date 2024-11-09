import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import './MaintenanceDashboard.css';

const MaintenanceDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [filters, setFilters] = useState({
        apartmentNumber: '',
        problemArea: '',
        status: '',
        dateFrom: '',
        dateTo: '',
    });

    const fetchRequests = async () => {
        try {
            let q = collection(db, 'requests');

            // Apply filters
            if (filters.apartmentNumber) q = query(q, where('apartmentNumber', '==', filters.apartmentNumber));
            if (filters.problemArea) q = query(q, where('problemArea', '==', filters.problemArea));
            if (filters.status) q = query(q, where('status', '==', filters.status));

            // Date range filter
            if (filters.dateFrom && filters.dateTo) {
                q = query(q, where('timestamp', '>=', new Date(filters.dateFrom)));
                q = query(q, where('timestamp', '<=', new Date(filters.dateTo)));
            }

            const querySnapshot = await getDocs(q);
            setRequests(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching requests', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleCompleteRequest = async (requestId) => {
        const currentDate = new Date().toISOString();
        try {
            await updateDoc(doc(db, 'requests', requestId), { status: 'completed', dateCompleted: currentDate });
            fetchRequests();
        } catch (error) {
            console.error('Error completing request', error);
        }
    };

    return (
        <div className="maintenance-dashboard">
            <h2>Maintenance Dashboard</h2>
            <div className="filter-inputs">
                <input type="text" name="apartmentNumber" placeholder="Apartment Number" onChange={handleFilterChange} />
                <input type="text" name="problemArea" placeholder="Problem Area" onChange={handleFilterChange} />
                <select name="status" onChange={handleFilterChange}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
                <input type="date" name="dateFrom" placeholder="From Date" onChange={handleFilterChange} />
                <input type="date" name="dateTo" placeholder="To Date" onChange={handleFilterChange} />
            </div>
            <ul>
                {requests.map((request) => (
                    <li key={request.id}>
                        <div className="request-category"><strong>Apt:</strong> {request.apartmentNumber}</div>
                        <div className="request-category"><strong>Problem Area:</strong> {request.problemArea}</div>
                        <div className="request-category"><strong>Description:</strong> {request.description}</div>
                        <div className="request-category"><strong>Status:</strong> {request.status}</div>
                        <div className="request-category"><strong>Date Created:</strong> {new Date(request.timestamp.seconds * 1000).toLocaleString()}</div>
                        {request.dateCompleted && <div className="request-category"><strong>Date Completed:</strong> {new Date(request.dateCompleted).toLocaleString()}</div>}
                        {request.comments && <div className="request-category"><strong>Comments:</strong> {request.comments}</div>}
                        <button onClick={() => handleCompleteRequest(request.id)}>Mark as Complete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MaintenanceDashboard;
