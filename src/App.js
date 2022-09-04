import './App.css';
import { useState } from 'react'
import {
  HashRouter,
  Routes,
  Route
} from 'react-router-dom';
import Todo from './Todo';
import Login from './Login';
import Register from './Register';
import { AuthContext } from './Context'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  return (
    <HashRouter>
      <>
        <AuthContext.Provider value={{ token, setToken }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
            <Route path="/" element={<Todo />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
        </AuthContext.Provider>
      </>
    </HashRouter>
   
  );
}

export default App;
