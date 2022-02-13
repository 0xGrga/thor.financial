import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { Container } from "react-bootstrap";

import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";

import Dashboard from "./components/dashboard/Dashboard";
import Portfolio from "./components/portfolio/Portfolio";
import Buybacks from "./components/buybacks/Buybacks";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{display: "flex"}}>
        <Sidebar />
        <Container>
          {children}
        </Container>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Layout><Dashboard /></Layout>}></Route>
        <Route path="/buybacks" exact element={<Layout><Buybacks /></Layout>}></Route>
        <Route path="/portfolio" exact element={<Layout><Portfolio /></Layout>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
