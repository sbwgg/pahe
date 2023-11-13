import { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import Header from "./components/Header";

import Home from "./pages/Home";
import { AppContext, Context } from "./context/AppContext";
import Info from "./pages/Info";
import ScrollButton from "./components/ScrollButton";
import Watch from "./pages/Watch";
import PageNotFound from "./pages/PageNotFound";
import Footer from "./components/Footer";
import Dashboard from "./pages/user/Dashboard";
import Explore from "./pages/Explore";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { setShowMenu, setResultData } = useContext(Context);
  useEffect(() => {
    window.scrollTo(0, 0);
    setResultData(null);
    setShowMenu(false);
  }, [pathname]);
  return null;
};
function App() {
  return (
      <AppContext>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/anime" exact element={<Home />} />
            <Route path="/latest-episodes" exact element={<Explore />} />
            <Route path="/user/:tab" exact element={<Dashboard />} />
            <Route path="/anime/:id" exact element={<Info />} />
            <Route path="/watch/:id" exact element={<Watch />} />
            <Route path="*" exact element={<PageNotFound />} />
          </Routes>
          <Footer />
          <ScrollButton />
        </BrowserRouter>
      </AppContext>
  );
}

export default App;
