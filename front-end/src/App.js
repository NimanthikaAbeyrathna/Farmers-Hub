import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home";
import LogIn from "./pages/Log-in/Log-in";
import SignIn from "./pages/Sign-in/Sign-in";
import NewPost from "./pages/New-post/new_post";

function App() {
  return (
      <Router>

        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path="/" element={<LogIn/>}/>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/newPost" element={<NewPost/>}/>
        </Routes>
      </Router>
  );
}

export default App;
