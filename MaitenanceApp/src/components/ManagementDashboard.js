import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import './ManagementDashboard.css';

const ManagementDashboard = () => {
    const [tenants, setTenants] = useState([]);
    const [newTenant, setNewTenant] = useState({
        name: '', phone: '', email: '', checkIn: '', checkOut: '', apartmentNumber: ''
    });
    const [editTenant, setEditTenant] = useState(null);

    const fetchTenants = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'tenants'));
            setTenants(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching tenants', error);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const handleAddTenant = async () => {
        try {
            const docRef = await addDoc(collection(db, 'tenants'), newTenant);
            fetchTenants();
        } catch (error) {
            console.error('Error adding tenant', error);
        }
    };

    const handleMoveOutTenant = async (tenantId) => {
        const currentDate = new Date().toISOString().split('T')[0];
        try {
            await updateDoc(doc(db, 'tenants', tenantId), { checkOut: currentDate });
            fetchTenants();
        } catch (error) {
            console.error('Error moving out tenant', error);
        }
    };

    const handleUpdateTenant = async () => {
        try {
            await updateDoc(doc(db, 'tenants', editTenant.id), { apartmentNumber: editTenant.apartmentNumber });
            setEditTenant(null);
            fetchTenants();
        } catch (error) {
            console.error('Error updating tenant', error);
        }
    };

    return (
        <div className="management-dashboard">
            <h2>Tenant Management</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddTenant(); }}>
                <label>Add Tenant</label>
                <input name="name" placeholder="Name" onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })} />
                <input name="phone" placeholder="Phone" onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })} />
                <input name="email" placeholder="Email" onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })} />
                <input name="checkIn" type="date" onChange={(e) => setNewTenant({ ...newTenant, checkIn: e.target.value })} />
                <input name="apartmentNumber" placeholder="Apartment Number" onChange={(e) => setNewTenant({ ...newTenant, apartmentNumber: e.target.value })} />
                <button type="submit">Add Tenant</button>
            </form>
            <h3>Update/Move Out Tenant</h3>
            <ul>
                {tenants.map((tenant) => (
                    <li key={tenant.id} className="tenant-card">
                        <div><strong>ID:</strong> {tenant.id}</div>
                        <div><strong>Name:</strong> {tenant.name}</div>
                        <div><strong>Phone:</strong> {tenant.phone}</div>
                        <div><strong>Email:</strong> {tenant.email}</div>
                        <div><strong>Move-in:</strong> {tenant.checkIn}</div>
                        <div><strong>Move-out:</strong> {tenant.checkOut}</div>
                        <div><strong>Apt:</strong> {tenant.apartmentNumber}</div>
                        <div className="tenant-buttons">
                            <button className="btn-move-out" onClick={() => handleMoveOutTenant(tenant.id)}>Move Out</button>
                            <button className="btn-update" onClick={() => setEditTenant(tenant)}>Update</button>
                        </div>
                    </li>
                ))}
            </ul>
            {editTenant && (
                <div className="update-form">
                    <h3>Update Tenant Apartment Number</h3>
                    <input name="apartmentNumber" placeholder="Apartment Number" value={editTenant.apartmentNumber} onChange={(e) => setEditTenant({ ...editTenant, apartmentNumber: e.target.value })} />
                    <button onClick={handleUpdateTenant}>Save</button>
                </div>
            )}
        </div>
    );
};

export default ManagementDashboard;
