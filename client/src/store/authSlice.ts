import { createSlice } from '@reduxjs/toolkit';

const initState = {
  isAuthenticated: false,
  token: '',
  user: {
    profileImageUrl: ''
  }
};

export const slice = createSlice({
  name: 'auth',
  initialState: initState,
  reducers: {
    registerUser: () => {},
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    logout: state => {
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    resetAuth: state => initState
  }
});

export const { login, logout, setUser, setIsAuthenticated, resetAuth } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = amount => dispatch => {};
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectAuth = (state: any) => state;

export default slice.reducer;
