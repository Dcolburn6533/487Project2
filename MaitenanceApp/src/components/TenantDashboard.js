
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './TenantDashboard.css';  // Import the CSS file

const TenantDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        apartmentNumber: '',
        problemArea: '',
        description: '',
        photo: null,
    });
    const [comments, setComments] = useState({});
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [showRequests, setShowRequests] = useState(false);
    const [success, setSuccess] = useState(false);

    const fetchRequests = async (apartmentNumber) => {
        try {
            const q = query(collection(db, 'requests'), where('apartmentNumber', '==', apartmentNumber));
            const querySnapshot = await getDocs(q);
            setRequests(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setShowRequests(true);
        } catch (error) {
            console.error('Error fetching requests', error);
        }
    };

    useEffect(() => {
        if (apartmentNumber) fetchRequests(apartmentNumber);
    }, [apartmentNumber]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let photoUrl = null;

        if (formData.photo) {
            const photoRef = ref(storage, `photos/${formData.photo.name}`);
            await uploadBytes(photoRef, formData.photo);
            photoUrl = await getDownloadURL(photoRef);
        }

        try {
            await addDoc(collection(db, 'requests'), {
                apartmentNumber: formData.apartmentNumber,
                problemArea: formData.problemArea,
                description: formData.description,
                photoUrl,
                status: 'pending',
                timestamp: serverTimestamp(),
            });
            setSuccess(true);
            fetchRequests(formData.apartmentNumber);
        } catch (error) {
            console.error('Error submitting request', error);
        }
    };

    const handleCommentChange = (requestId, comment) => {
        setComments({ ...comments, [requestId]: comment });
    };

    const handleAddComment = async (requestId) => {
        try {
            await updateDoc(doc(db, 'requests', requestId), { comments: comments[requestId] });
            fetchRequests(apartmentNumber);
        } catch (error) {
            console.error('Error adding comments', error);
        }
    };

    return (
        <div className="tenant-dashboard">
            <h2>Maintenance Request Dashboard</h2>
            <form onSubmit={handleSubmit}>
                <label>Submit a Maintenance Request</label>
                <input type="text" name="apartmentNumber" placeholder="Apartment Number" value={formData.apartmentNumber} onChange={handleChange} required />
                <input type="text" name="problemArea" placeholder="Problem Area" value={formData.problemArea} onChange={handleChange} required />
                <textarea name="description" placeholder="Describe the problem" value={formData.description} onChange={handleChange} required />
                <input type="file" name="photo" onChange={handleFileChange} />
                <button type="submit">Submit Request</button>
            </form>
            {success && <p>Request submitted successfully!</p>}

            <div className="view-requests">
                <label>View Your Maintenance Requests</label>
                <input
                    type="text"
                    placeholder="Enter your apartment number"
                    value={apartmentNumber}
                    onChange={(e) => setApartmentNumber(e.target.value)}
                />
                {showRequests && (
                    <ul>
                        {requests.map((request) => (
                            <li key={request.id}>
                                <p><strong>Request ID:</strong> {request.id}</p>
                                <p><strong>Apartment Number:</strong> {request.apartmentNumber}</p>
                                <p><strong>Problem Area:</strong> {request.problemArea}</p>
                                <p><strong>Description:</strong> {request.description}</p>
                                <p><strong>Status:</strong> {request.status}</p>
                                {request.comments && <p><strong>Comments:</strong> {request.comments}</p>}
                                {request.photoUrl && <img src={request.photoUrl} alt="Request Photo" />}
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    value={comments[request.id] || ''}
                                    onChange={(e) => handleCommentChange(request.id, e.target.value)}
                                />
                                <button onClick={() => handleAddComment(request.id)}>Add Comment</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TenantDashboard;
