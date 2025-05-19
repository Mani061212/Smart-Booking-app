import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

function App() {
    const [user, setUser] = useState(null); // Store logged-in user info (username, role)
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerRole, setRegisterRole] = useState('student'); // Default role
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [newSlotTime, setNewSlotTime] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        if (storedToken && storedRole) {
            setToken(storedToken);
            setUser({ username: storedToken, role: storedRole });
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchSlots();
        }
    }, [token]);

    const fetchSlots = async () => {
        try {
            const res = await axios.get(`${API_BASE}/slots`, {
                headers: {
                    Authorization: token,
                },
            });
            setSlots(res.data);
        } catch (err) {
            setError('Failed to fetch slots.');
            autoClearNotification('error');
        }
    };

    const autoClearNotification = (type) => {
        setTimeout(() => {
            if (type === 'message') setMessage('');
            if (type === 'error') setError('');
        }, 3000);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE}/register`, {
                username: registerUsername,
                password: registerPassword,
                role: registerRole,
            });
            setMessage(response.data.message);
            setError('');
            setIsRegistering(false);
            setRegisterUsername('');
            setRegisterPassword('');
            autoClearNotification('message');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
            autoClearNotification('error');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE}/login`, {
                username: loginUsername,
                password: loginPassword,
            });
            setMessage(response.data.message);
            setError('');
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            setUser({ username: response.data.token, role: response.data.role });
            setLoginUsername('');
            setLoginPassword('');
            autoClearNotification('message');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed.');
            autoClearNotification('error');
        }
    };

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setMessage('Logged out successfully.');
        autoClearNotification('message');
    };

    const bookSlot = async () => {
        if (!selectedSlot) {
            setError('Please select a slot to book.');
            autoClearNotification('error');
            return;
        }
        try {
            const response = await axios.post(
                `${API_BASE}/book`,
                { time: selectedSlot },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            setMessage(response.data.message);
            setError('');
            setSelectedSlot(null);
            fetchSlots();
            autoClearNotification('message');
        } catch (err) {
            setError(err.response?.data?.error || 'Error booking the slot.');
            autoClearNotification('error');
        }
    };

    const cancelSlot = async (time) => {
        try {
            const response = await axios.post(
                `${API_BASE}/cancel`,
                { time },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            setMessage(response.data.message);
            setError('');
            fetchSlots();
            autoClearNotification('message');
        } catch (err) {
            setError(err.response?.data?.error || 'Error cancelling the slot.');
            autoClearNotification('error');
        }
    };

    const handleAddSlot = async () => {
        if (!newSlotTime.trim()) {
            setError('Time is required to add a slot.');
            autoClearNotification('error');
            return;
        }
        try {
            const response = await axios.post(
                `${API_BASE}/slots/add`,
                { time: newSlotTime },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            setMessage(response.data.message);
            setError('');
            setNewSlotTime('');
            fetchSlots();
            autoClearNotification('message');
        } catch (err) {
            setError(err.response?.data?.error || 'Error adding the slot.');
            autoClearNotification('error');
        }
    };

    const availableSlots = slots.filter((slot) => !slot.booked);
    const bookedSlots = slots.filter((slot) => slot.booked && slot.name === user?.username);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-sky-400 mb-6 text-center">
                        {isRegistering ? 'Register' : 'Login'}
                    </h2>
                    {error && (
                        <div className="mb-4 bg-red-600 border border-red-400 text-white px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="mb-4 bg-sky-600 border border-sky-400 text-white px-4 py-3 rounded-lg">
                            {message}
                        </div>
                    )}
                    {isRegistering ? (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label htmlFor="registerUsername" className="block text-gray-300 text-sm font-bold mb-2">
                                    Username:
                                </label>
                                <input
                                    type="text"
                                    id="registerUsername"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                                    value={registerUsername}
                                    onChange={(e) => setRegisterUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="registerPassword" className="block text-gray-300 text-sm font-bold mb-2">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    id="registerPassword"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="registerRole" className="block text-gray-300 text-sm font-bold mb-2">
                                    Role:
                                </label>
                                <select
                                    id="registerRole"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                                    value={registerRole}
                                    onChange={(e) => setRegisterRole(e.target.value)}
                                >
                                    <option value="student">Student</option>
                                    <option value="mentor">Mentor</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Register
                                </button>
                                <button
                                    type="button"
                                    className="inline-block align-baseline font-semibold text-sm text-sky-300 hover:text-sky-500"
                                    onClick={() => setIsRegistering(false)}
                                >
                                    Already have an account? Login
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="loginUsername" className="block text-gray-300 text-sm font-bold mb-2">
                                    Username:
                                </label>
                                <input
                                    type="text"
                                    id="loginUsername"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="loginPassword" className="block text-gray-300 text-sm font-bold mb-2">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    id="loginPassword"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    className="inline-block align-baseline font-semibold text-sm text-sky-300 hover:text-sky-500"
                                    onClick={() => setIsRegistering(true)}
                                >
                                    Need an account? Register
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6 animate-page-enter">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-sky-400">Schedulo Lite</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Logout ({user?.username})
                </button>
            </div>

            {/* Toast Notifications */}
            {message && (
                <div className="mb-6 max-w-2xl mx-auto bg-sky-600 border border-sky-400 text-white px-4 py-3 rounded-lg shadow-lg transition-opacity duration-500 opacity-100 animate-notification">
                    {message}
                </div>
            )}
            {error && (
                <div className="mb-6 max-w-2xl mx-auto bg-red-600 border border-red-400 text-white px-4 py-3 rounded-lg shadow-lg transition-opacity duration-500 opacity-100 animate-notification">
                    {error}
                </div>
            )}

            {user?.role === 'student' && (
                <>
                    {/* Available Slots Section */}
                    <div className="max-w-3xl mx-auto mb-8">
                        <h2 className="text-2xl font-semibold text-sky-300 mb-4">Available Slots</h2>
                        {availableSlots.length === 0 ? (
                            <p className="text-center text-gray-400">No available slots.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {availableSlots.map((slot) => (
                                    <div
                                        key={slot.time}
                                        className="p-4 bg-green-600 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 group"
                                    >
                                        <div className="font-semibold text-lg text-white">{slot.time}</div>
                                        <div className="text-sm text-gray-200">Available</div>
                                        <button
                                            onClick={() => setSelectedSlot(slot.time)}
                                            className="mt-3 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 hover:shadow-glow transform hover:scale-110 transition-all duration-200 disabled:opacity-50"
                                            disabled={selectedSlot !== null}
                                        >
                                            Book
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Booked Slots Section */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-semibold text-sky-300 mb-4">My Booked Slots</h2>
                        {bookedSlots.length === 0 ? (
                            <p className="text-center text-gray-400">No slots booked by you.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {bookedSlots.map((slot) => (
                                    <div
                                        key={slot.time}
                                        className="p-4 bg-red-600 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 group"
                                    >
                                        <div className="font-semibold text-lg text-white">{slot.time}</div>
                                        <div className="text-sm text-gray-200">Booked by: {slot.name}</div>
                                        <button
                                            onClick={() => cancelSlot(slot.time)}
                                            className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 hover:shadow-glow transform hover:scale-110 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {user?.role === 'mentor' && (
                <div className="max-w-3xl mx-auto mb-8">
                    <h2 className="text-2xl font-semibold text-sky-300 mb-4">Mentor Dashboard</h2>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-sky-300 mb-3">Add New Slot</h3>
                        <div className="flex items-center space-x-3 mb-4">
                            <input
                                type="text"
                                placeholder="Enter new slot time (e.g., 6:00 PM)"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                                value={newSlotTime}
                                onChange={(e) => setNewSlotTime(e.target.value)}
                            />
                            <button
                                onClick={handleAddSlot}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Add Slot
                            </button>
                        </div>
                        {slots.filter(slot => slot.createdBy === user?.username).length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-sky-300 mb-3">Your Added Slots</h3>
                                <ul className="list-disc list-inside text-gray-300">
                                    {slots.filter(slot => slot.createdBy === user?.username).map(slot => (
                                        <li key={slot.time}>{slot.time}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {selectedSlot && user?.role === 'student' && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-10">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm transform scale-95 animate-modal-enter">
                        <h2 className="text-xl font-semibold mb-4 text-sky-300">Booking for {selectedSlot}</h2>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedSlot(null)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:shadow-glow transform hover:scale-110 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={bookSlot}
                                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 hover:shadow-glow transform hover:scale-110 transition-all duration-200"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animations and Shadows */}
            <style>
                {`
          @keyframes notification {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }

          @keyframes pageEnter {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes modalEnter {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(0.95); }
          }

          .animate-notification {
            animation: notification 3s forwards;
          }

          .animate-page-enter {
            animation: pageEnter 0.5s ease-out;
          }

          .animate-modal-enter {
            animation: modalEnter 0.3s ease-out;
          }

          .group:hover {
            transform: perspective(600px) rotateX(3deg) rotateY(3deg) scale(1.05);
          }

          .hover\\:shadow-glow:hover {
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
          }
        `}
            </style>
        </div>
    );
}

export default App;
