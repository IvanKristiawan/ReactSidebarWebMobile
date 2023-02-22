// import "./styles.css";
import React, { useContext, useState, useEffect } from "react";
// import { Route, Switch, Redirect } from 'react-router-dom';
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import FormInput from "./pages/FormInput";
import Login from "./pages/Login";
import "./styles.scss";
// import { Link } from "react-router-dom";
// import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
// import { ErrorBoundary } from "react-error-boundary";
// import { Colors } from "./constants/styles";
// import { AuthContext } from "./contexts/AuthContext";
import { useStateContext } from "./contexts/ContextProvider";

const App = () => {
  const { screenSize, setScreenSize } = useStateContext();
  // const { collapseSidebar } = useProSidebar();
  // const { user } = useContext(AuthContext);
  // const [open, setOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [image, setImage] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const handleImageChange = (checked) => {
    setImage(checked);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`app ${toggled ? "toggled" : ""}`}>
      <Sidebar
        image={image}
        collapsed={collapsed}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
        handleCollapsedChange={handleCollapsedChange}
      />

      <main>
        <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
          <FaBars />
        </div>
        {/* <BrowserRouter> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/formInput" element={<FormInput />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        {/* </BrowserRouter> */}
        {/* <Switch>
          <Route path="/components" component={Components} />
          <Route path="/profile" component={Profile} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/" exact>
            <Home image={image} handleImageChange={handleImageChange} />
          </Route>
          <Redirect to="/not-found" />
        </Switch> */}
        <Footer />
      </main>
    </div>
  );
};

export default App;
