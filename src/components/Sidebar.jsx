import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaBook,
  FaUserCog,
  FaWarehouse,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";

const Sidebar = ({
  collapsed,
  toggled,
  handleToggleSidebar,
  handleCollapsedChange,
}) => {
  const { user, setting, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutButtonHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      onToggle={handleToggleSidebar}
      breakPoint="md"
    >
      {/* Header */}
      <SidebarHeader>
        <Menu iconShape="circle">
          {collapsed ? (
            <MenuItem
              icon={<FaAngleDoubleRight />}
              onClick={handleCollapsedChange}
            ></MenuItem>
          ) : (
            <MenuItem
              suffix={<FaAngleDoubleLeft />}
              onClick={handleCollapsedChange}
            >
              <div
                style={{
                  padding: "9px",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 15,
                  letterSpacing: "1px",
                }}
              >
                {setting.namaProgram} {setting.namaJenisProgram}
              </div>
            </MenuItem>
          )}
        </Menu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent>
        <Menu iconShape="circle">
          <SubMenu title={"Master"} icon={<FaBook />}>
            {user.akses.kategori === true && (
              <MenuItem>
                Kategori <NavLink to="/kategori" />
              </MenuItem>
            )}
            {user.akses.barang === true && (
              <MenuItem>
                Barang <NavLink to="/barang" />
              </MenuItem>
            )}
            {user.akses.supplier === true && (
              <MenuItem>
                Supplier <NavLink to="/supplier" />
              </MenuItem>
            )}
            {user.akses.pelanggan === true && (
              <MenuItem>
                Pelanggan <NavLink to="/pelanggan" />
              </MenuItem>
            )}
            {user.akses.cabang === true && (
              <MenuItem>
                Cabang <NavLink to="/cabang" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Stok"} icon={<FaWarehouse />}>
            <SubMenu title={"Gudang"}>
              <MenuItem>
                Daftar Stok <NavLink to="/stokGudang" />
              </MenuItem>
              <MenuItem>
                Koreksi Stok <NavLink to="/koreksiStokGudang" />
              </MenuItem>
            </SubMenu>
            <SubMenu title={"Toko"}>
              <MenuItem>
                Daftar Stok <NavLink to="/stokToko" />
              </MenuItem>
              <MenuItem>
                Koreksi Stok <NavLink to="/koreksiStokToko" />
              </MenuItem>
            </SubMenu>
            {user.akses.transferStok === true && (
              <MenuItem>
                Transfer Stok <NavLink to="/transferStok" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Pembelian"} icon={<FaShoppingCart />}>
            {user.akses.profilUser === true && (
              <MenuItem>
                Beli <NavLink to="/pembelian" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Utility"} icon={<FaUserCog />}>
            {user.akses.profilUser === true && (
              <MenuItem>
                Profil User <NavLink to="/profilUser" />
              </MenuItem>
            )}
            {user.akses.daftarUser === true && (
              <MenuItem>
                Daftar User <NavLink to="/daftarUser" />
              </MenuItem>
            )}
            {user.akses.tutupPeriode === true && (
              <MenuItem>
                Tutup Periode
                <NavLink to="/tutupPeriode" />
              </MenuItem>
            )}
            {user.akses.gantiPeriode === true && (
              <MenuItem>
                Ganti Periode <NavLink to="/gantiPeriode" />
              </MenuItem>
            )}
            {user.akses.setting === true && (
              <MenuItem>
                Setting <NavLink to="/setting" />
              </MenuItem>
            )}
          </SubMenu>
        </Menu>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter style={{ textAlign: "center" }}>
        <p style={{ fontSize: "12px", marginTop: "10px" }}>{user.username}</p>
        <p
          style={{ fontSize: "12px", marginTop: "-10px" }}
        >{`${user.cabang.id} - ${user.cabang.namaCabang}`}</p>
        <div className="sidebar-btn-wrapper" style={{ paddingBottom: "10px" }}>
          <Link
            className="sidebar-btn"
            style={{ cursor: "pointer" }}
            to="/"
            onClick={logoutButtonHandler}
          >
            <span style={{ marginRight: "6px" }}>Logout</span>
            <FaSignOutAlt />
          </Link>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Sidebar;
