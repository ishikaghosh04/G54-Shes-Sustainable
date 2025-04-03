

import{
  BrowserRouter,
  Routes,
  Route,
}from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/SignUp";





function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>    
          <Route path="/Signup" element={<Signup/>}/>            
        </Routes> 
      </BrowserRouter>
    </div>
  );
}

export default App;
