import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import Login from './Login';
import Events from './Admin/Events';
import Horinav from './Components/Horinav';
import Sidenav from './Components/Sidenav';
import EventUploadForm from './Admin/EventUploadForm';
import EventDetails from './Admin/EventDetails';

function App() {
  const [role, setRole] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1370);
  const navigate = useNavigate();
  const location = useLocation();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(res => {
        if (res.data.valid) {
          setRole(res.data.role);
        } else {
          navigate('/login');
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);

  const handleLogout = () => {
    axios.get('http://localhost:8081/logout')
      .then(res => {
        if (res.data.message) {
          setRole('');
          navigate('/login');
        }
      })
      .catch(err => console.log(err));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  useEffect(() => {
    function handleResize() {
      const newSize = window.innerWidth;
      setIsSidebarOpen(newSize >= 1370);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldApplyLayout = location.pathname !== '/login';

  return (
    <div className="App">
      {(role === 'admin' || role === 'student') && (
        <>
          <Horinav toggleSidebar={toggleSidebar} />
          <Sidenav isOpen={isSidebarOpen} role={role} handleLogout={handleLogout} />
        </>
      )}
      <div className={shouldApplyLayout ? (isSidebarOpen ? "content" : "content-collapsed") : ""}>
        <Routes>
          <Route path='/' element={<Home role={role} />}></Route>
          <Route path='/events' element={<Events />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/upload" element={<EventUploadForm />} />
          <Route path="/details/:id" element={<EventDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
