import { useState } from 'react';

function AuthForm() {
    // State to toggle between registration and login modes
    const [isRegisterMode, setIsRegisterMode] = useState(true);

    // State to store user input for registration/login form fields
    const [username, setUsername] = useState('');
    const [confirmUsername, setConfirmUsername] = useState(''); // New state for confirming username
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState(''); // New state for confirming email
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Toggle between login and registration modes
    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setErrorMessage(''); // Clear any existing errors when toggling
    };

    // Basic email validation
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Basic username validation (at least 3 characters)
    const isValidUsername = (username) => {
        return username.length >= 3;
    };

    // Function to handle user registration
    const handleRegister = async (e) => {
        console.log("handleRegister")
        e.preventDefault();

        // Validation checks for email, username, password match, and confirmed values
        if (!isValidEmail(email)) {
            setErrorMessage('Invalid email format');
            return;
        }

        if (!isValidUsername(username)) {
            setErrorMessage('Username must be at least 3 characters');
            return;
        }

        if (username !== confirmUsername) {
            setErrorMessage('Usernames do not match');
            return;
        }

        if (email !== confirmEmail) {
            setErrorMessage('Emails do not match');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            console.log(JSON.stringify({ "username": username, "email": email, "password": password }));
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "username": username, "email": email, "password": password })
            });

            if (!response.ok) throw new Error('Registration failed');

            alert('Registration successful! Please log in.');
            clearForm();
        } catch (err) {
            console.error('Error during registration:', err);
            setErrorMessage('Error during registration. Please try again.');
        }
    };

    // Function to handle user login
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log(JSON.stringify({ email, password }));
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();

            // Store JWT in local storage
            localStorage.setItem('token', data.token);

            alert('Login successful!');
            clearForm();
        } catch (err) {
            console.error('Error during login:', err);
            setErrorMessage('Invalid email or password.');
        }
    };

    // Clear form fields after successful submission
    const clearForm = () => {
        setUsername('');
        setConfirmUsername(''); // Clear confirm username
        setEmail('');
        setConfirmEmail(''); // Clear confirm email
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
    };

    return (
        <div>
            <h2>{isRegisterMode ? 'Register' : 'Log In'}</h2>

            {/* Toggle between Register and Login */}
            <button class="login_register" onClick={toggleMode}>
                {isRegisterMode ? 'Switch to Login' : 'Switch to Register'}
            </button>

            {/* Display error message if present */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <form onSubmit={isRegisterMode ? handleRegister : handleLogin}>
                {/* Username input field for registration */}
                {isRegisterMode && (
                    <>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username (at least 3 characters)"
                            required
                        />
                        <input
                            type="text"
                            value={confirmUsername}
                            onChange={(e) => setConfirmUsername(e.target.value)}
                            placeholder="Confirm Username"
                            required
                        />
                    </>
                )}

                {/* Email input field, used in both registration and login */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />

                {/* Confirm Email input field, only for registration */}
                {isRegisterMode && (
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        placeholder="Confirm Email"
                        required
                    />
                )}

                {/* Password input field */}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />

                {/* Confirm Password input field, only for registration */}
                {isRegisterMode && (
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                )}

                {/* Submit button to either Register or Login */}
                <button type="submit">{isRegisterMode ? 'Register' : 'Login'}</button>
            </form>
        </div>
    );
}

export default AuthForm;
