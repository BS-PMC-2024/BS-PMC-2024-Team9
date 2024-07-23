import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/authSlice";
import { StyledForm } from "./StyledForm";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    initial_balance: "",  // הוספת שדה initial_balance
  });

  useEffect(() => {
    if (auth._id) {
      navigate("/stockdata");
    }
  }, [auth._id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const initialBalance = parseFloat(user.initial_balance);
    if (isNaN(initialBalance) || initialBalance <= 0) {
      toast.error("Initial balance must be greater than zero.");
      return;
    }
    dispatch(registerUser(user));
  };

  const handleInitialBalanceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 0) {
      setUser({ ...user, initial_balance: e.target.value });
    } else {
      toast.error("Initial balance must be greater than zero.");
    }
  };

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="name"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <input
          type="number"
          placeholder="Initial Balance"
          min="0"
          value={user.initial_balance}
          onChange={handleInitialBalanceChange}
        />
        <button>
          {auth.registerStatus === "pending" ? "Submitting..." : "Register"}
        </button>
        {auth.registerStatus === "rejected" ? (
          <p>{auth.registerError}</p>
        ) : null}
      </StyledForm>
    </>
  );
};

export default Register;
