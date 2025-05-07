import React from 'react';
//import styles from './styles/App.module.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentProfile from './pages/StudentProfile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users/student_profile" element={<StudentProfile /> } />
      </Routes>
    </Router>
  );
}
export default App;