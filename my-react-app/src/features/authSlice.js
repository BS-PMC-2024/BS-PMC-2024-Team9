import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { url, setHeaders } from "./api";
import { clearStockData } from "./stockSlice";

const initialState = {
  token: localStorage.getItem("token"),
  name: "",
  email: "",
  _id: "",
  isAdmin:false,
  registerStatus: "",
  registerError: "",
  loginStatus: "",
  loginError: "",
  userLoaded: false,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (values, { rejectWithValue }) => {
    try {
      const token = await axios.post(`${url}/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
        initial_balance: values.initial_balance,
      });

      localStorage.setItem("token", token.data);

      return token.data;
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const token = await axios.post(`${url}/login`, {
        email: values.email,
        password: values.password,
      });

      localStorage.setItem("token", token.data);
      return token.data;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);


export const getUser = createAsyncThunk(
  "auth/getUser",
  async (id, { rejectWithValue }) => {
    try {
      const token = await axios.get(`${url}/user/${id}`, setHeaders());

      localStorage.setItem("token", token.data);

      return token.data;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUser(state, action) {
      const token = state.token;

      if (token) {
        const user = jwtDecode(token);
        return {
          ...state,
          token,
          name: user.name,
          email: user.email,
          _id: user._id,
          isAdmin: user.isAdmin,
          userLoaded: true,
        };
      } else return { ...state, userLoaded: true };
    },
    logoutUser(state, action) {
      localStorage.removeItem("token");
      
      return {
        ...state,
        token: "",
        name: "",
        email: "",
        _id: "",
        registerStatus: "",
        registerError: "",
        loginStatus: "",
        loginError: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "pending";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const user = jwtDecode(action.payload);
        state.token = action.payload;
        state.name = user.name;
        state.email = user.email;
        state._id = user._id;
        state.isAdmin = user.isAdmin;
        state.registerStatus = "success";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "rejected";
        state.registerError = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "pending";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const user = jwtDecode(action.payload);
        state.token = action.payload;
        state.name = user.name;
        state.email = user.email;
        state._id = user._id;
        state.isAdmin = user.isAdmin;
        state.loginStatus = "success";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "rejected";
        state.loginError = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.getUserStatus = "pending";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        const user = jwtDecode(action.payload);
        state.token = action.payload;
        state.name = user.name;
        state.email = user.email;
        state._id = user._id;
        state.isAdmin = user.isAdmin;
        state.getUserStatus = "success";
      })
      .addCase(getUser.rejected, (state, action) => {
        state.getUserStatus = "rejected";
        state.getUserError = action.payload;
      });
  },
});

export const { loadUser, logoutUser } = authSlice.actions;

export const userLogout = () => (dispatch) => {
  dispatch(logoutUser());
  dispatch(clearStockData());
}

export default authSlice.reducer;