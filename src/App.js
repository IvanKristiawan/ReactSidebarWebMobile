import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles.scss";
import { Sidebar, Footer, ScrollToTop } from "./components";
import { AuthContext } from "./contexts/AuthContext";
import { useStateContext } from "./contexts/ContextProvider";
import {
  Login,
  ProfilUser,
  UbahProfilUser,
  DaftarUser,
  TambahUser,
  UbahUser,
  TampilSetting,
  UbahSetting,
  TutupPeriode,
  TampilGantiPeriode,
  TampilKategori,
  UbahKategori,
  TambahKategori,
  TampilBarang,
  UbahBarang,
  TambahBarang,
  TampilSupplier,
  UbahSupplier,
  TambahSupplier,
  TampilPelanggan,
  UbahPelanggan,
  TambahPelanggan,
  TampilCabang,
  UbahCabang,
  TambahCabang,
} from "./pages/index";
import { FaBars } from "react-icons/fa";

const App = () => {
  const { screenSize, setScreenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const USERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user) {
      return children;
    }

    return <Navigate to="/login" />;
  };

  const PROFILUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.profilUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const DAFTARUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.daftarUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const SETTINGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.setting) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const TUTUPPERIODERoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.tutupPeriode) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const GANTIPERIODERoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.gantiPeriode) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const KATEGORIRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.kategori) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const BARANGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.barang) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const SUPPLIERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.supplier) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const PELANGGANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.pelanggan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const CABANGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.cabang) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`app ${toggled ? "toggled" : ""}`}>
      {user && (
        <Sidebar
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
          handleCollapsedChange={handleCollapsedChange}
        />
      )}

      <main>
        <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
          <FaBars />
        </div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* Profil User */}
          <Route
            path="/profilUser"
            element={
              <PROFILUSERRoute>
                <ProfilUser />
              </PROFILUSERRoute>
            }
          />
          <Route
            path="/profilUser/:id/edit"
            element={
              <PROFILUSERRoute>
                <UbahProfilUser />
              </PROFILUSERRoute>
            }
          />
          {/* Daftar User */}
          <Route
            path="/daftarUser"
            element={
              <DAFTARUSERRoute>
                <DaftarUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/:id"
            element={
              <DAFTARUSERRoute>
                <DaftarUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/:id/edit"
            element={
              <DAFTARUSERRoute>
                <UbahUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/tambahUser"
            element={
              <DAFTARUSERRoute>
                <TambahUser />
              </DAFTARUSERRoute>
            }
          />
          {/* Setting */}
          <Route
            path="/setting"
            element={
              <SETTINGRoute>
                <TampilSetting />
              </SETTINGRoute>
            }
          />
          <Route
            path="/setting/:id/edit"
            element={
              <SETTINGRoute>
                <UbahSetting />
              </SETTINGRoute>
            }
          />
          {/* Tutup Periode */}
          <Route
            path="/tutupPeriode"
            element={
              <TUTUPPERIODERoute>
                <TutupPeriode />
              </TUTUPPERIODERoute>
            }
          />
          {/* Ganti Periode */}
          <Route
            path="/gantiPeriode"
            element={
              <GANTIPERIODERoute>
                <TampilGantiPeriode />
              </GANTIPERIODERoute>
            }
          />
          <Route
            path="/gantiPeriode/:id"
            element={
              <GANTIPERIODERoute>
                <TampilGantiPeriode />
              </GANTIPERIODERoute>
            }
          />
          {/* Kategori */}
          <Route
            path="/kategori"
            element={
              <KATEGORIRoute>
                <TampilKategori />
              </KATEGORIRoute>
            }
          />
          <Route
            path="/kategori/:id"
            element={
              <KATEGORIRoute>
                <TampilKategori />
              </KATEGORIRoute>
            }
          />
          <Route
            path="/kategori/:id/edit"
            element={
              <KATEGORIRoute>
                <UbahKategori />
              </KATEGORIRoute>
            }
          />
          <Route
            path="/kategori/tambahKategori"
            element={
              <KATEGORIRoute>
                <TambahKategori />
              </KATEGORIRoute>
            }
          />
          {/* Barang */}
          <Route
            path="/barang"
            element={
              <BARANGRoute>
                <TampilBarang />
              </BARANGRoute>
            }
          />
          <Route
            path="/barang/:id"
            element={
              <BARANGRoute>
                <TampilBarang />
              </BARANGRoute>
            }
          />
          <Route
            path="/barang/:id/edit"
            element={
              <BARANGRoute>
                <UbahBarang />
              </BARANGRoute>
            }
          />
          <Route
            path="/barang/tambahBarang"
            element={
              <BARANGRoute>
                <TambahBarang />
              </BARANGRoute>
            }
          />
          {/* Supplier */}
          <Route
            path="/supplier"
            element={
              <SUPPLIERRoute>
                <TampilSupplier />
              </SUPPLIERRoute>
            }
          />
          <Route
            path="/supplier/:id"
            element={
              <SUPPLIERRoute>
                <TampilSupplier />
              </SUPPLIERRoute>
            }
          />
          <Route
            path="/supplier/:id/edit"
            element={
              <SUPPLIERRoute>
                <UbahSupplier />
              </SUPPLIERRoute>
            }
          />
          <Route
            path="/supplier/tambahSupplier"
            element={
              <SUPPLIERRoute>
                <TambahSupplier />
              </SUPPLIERRoute>
            }
          />
          {/* Pelanggan */}
          <Route
            path="/pelanggan"
            element={
              <PELANGGANRoute>
                <TampilPelanggan />
              </PELANGGANRoute>
            }
          />
          <Route
            path="/pelanggan/:id"
            element={
              <PELANGGANRoute>
                <TampilPelanggan />
              </PELANGGANRoute>
            }
          />
          <Route
            path="/pelanggan/:id/edit"
            element={
              <PELANGGANRoute>
                <UbahPelanggan />
              </PELANGGANRoute>
            }
          />
          <Route
            path="/pelanggan/tambahPelanggan"
            element={
              <PELANGGANRoute>
                <TambahPelanggan />
              </PELANGGANRoute>
            }
          />
          {/* Cabang */}
          <Route
            path="/cabang"
            element={
              <CABANGRoute>
                <TampilCabang />
              </CABANGRoute>
            }
          />
          <Route
            path="/cabang/:id"
            element={
              <CABANGRoute>
                <TampilCabang />
              </CABANGRoute>
            }
          />
          <Route
            path="/cabang/:id/edit"
            element={
              <CABANGRoute>
                <UbahCabang />
              </CABANGRoute>
            }
          />
          <Route
            path="/cabang/tambahCabang"
            element={
              <CABANGRoute>
                <TambahCabang />
              </CABANGRoute>
            }
          />
        </Routes>
        <Footer />
      </main>
    </div>
  );
};

export default App;
