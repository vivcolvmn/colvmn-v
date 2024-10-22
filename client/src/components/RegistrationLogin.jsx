// Registration/Login Component

// State:
// - username, email, password, confirmPassword

// Functions:
// - handleRegister: POST to /api/registered to save user data.
// - handleLogin: POST to /api/login for Auth0 login and redirect.

function AuthForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
      e.preventDefault();
      // Validation and POST to register route
    };

    const handleLogin = async (e) => {
      e.preventDefault();
      // POST to login route
    };

    return (
      <div>
        {/* Registration/Login form with inputs */}
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  export default AuthForm;
