import "./login.scss";
import { useContext, useState, useRef } from "react";
import { auth, db } from "../../firebase";
import { collection, where, query, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Snakbar from "../../components/snackbar/Snakbar";
import logo from "../../components/assets/images/myogaIcon2.png";
import { Button } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const snackbarRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [sType, setType] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adminRef = collection(db, "Admin");
    const rolesRef = collection(db, "Roles");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        setMsg("Logged In Succesfully");
        setType("success");
        snackbarRef.current.show();
        navigate("/");
      })
      .catch((error) => {
        setError(true);
        setMsg("Incorrect email or password");
        setType("error");
        snackbarRef.current.show();
        setLoading(false);
      });
  };

  return (
    // <div className="login">
    //     <Snakbar ref={snackbarRef} message={msg} type={sType} />
    //     <h1 className="title">Welcome Admin, Sign In</h1>
    //     <form onSubmit={handleLogin}>
    //         <input type="email" placeholder="enter email address" onChange={e => setEmail(e.target.value)} />
    //         <input type="password" placeholder="enter password" onChange={e => setPassword(e.target.value)} />
    //         <button type="submit">Login</button>

    //         {error && <span>Wrong Email or Password</span>}
    //     </form>
    // </div>
    <>
      <Snakbar ref={snackbarRef} message={msg} type={sType} />

      <div className="login-page">

        <header>
          <span>MyOga Admin</span>
        </header>

        <img className="logo" src={logo} alt="Logo" />

        <form onSubmit={handleLogin}>
          <div className="email">
            <input
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="password">
            <input
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </Button>
          </div>

          {/* {error && <span className="error">Process Failed!!</span>} */}
          {/* {error && <span className="error">{Errormsg}</span>} */}

          <button
            type="submit"
            className={loading ? "spinner-btn" : ""}
            disabled={loading}
          >
            <span className={loading ? "hidden" : ""}>{"Login"}</span>
            <span className={loading ? "" : "hidden"}>
              <div className="spinner"></div>
            </span>
            {loading && <span>Logging In...</span>}
          </button>
          <button
          >
            Forgot Password?
          </button>
        </form>
      </div>
    </>


  );
};

export default Login;
