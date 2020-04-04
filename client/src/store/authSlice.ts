import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  user: {};
}

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: true,
    user: {
      profileUrl: 'https://lh3.googleusercontent.com/a-/AOh14GiwM_y4MyoxBsEApgd9Qf2__s3mEL74mgbFERZA=s96-c'
    }
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      action.payload.history.push('/');
    },
    logout: state => {
      state.isAuthenticated = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const { login, logout, setUser } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectAuth = (state: any) => state;

export default slice.reducer;
