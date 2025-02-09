import Home from "./pages/Home"
import NavBar from "./component/NavBar"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css';
import { PageProvider } from "./context/PageContext";

function App() {
  return (
    <BrowserRouter>
      <PageProvider>
        <NavBar/>
              <Routes>
                <Route path="/">
                  <Route
                    index
                    element={
                      <Home/>
                    }
                  />
                </Route>
              </Routes>
      </PageProvider>
    </BrowserRouter>
  );
}

export default App;
