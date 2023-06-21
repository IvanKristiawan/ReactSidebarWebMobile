import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableSupplier } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { SearchBar, Loader, ButtonModifier } from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Box, Pagination, Button, ButtonGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilSupplier = () => {
  const tableRef = useRef(null);
  const { user, dispatch, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeSupplier, setKodeSupplier] = useState("");
  const [namaSupplier, setNamaSupplier] = useState("");
  const [alamatSupplier, setAlamatSupplier] = useState("");
  const [kotaSupplier, setKotaSupplier] = useState("");
  const [teleponSupplier, setTeleponSupplier] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersPagination, setSuppliersPagination] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [query, setQuery] = useState("");
  const PER_PAGE = 20;

  const handleChange = (e, p) => {
    setPage(p - 1);
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setSearchTerm(query);
  };

  useEffect(() => {
    getSuppliersPagination();
    id && getSupplierById();
  }, [id, page, searchTerm]);

  const getSuppliersPagination = async () => {
    try {
      const response = await axios.post(
        `${tempUrl}/suppliersPagination?search_query=${searchTerm}&page=${page}&limit=${limit}`,
        {
          _id: user.id,
          token: user.token,
        }
      );
      setSuppliersPagination(response.data.suppliers);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/suppliers`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id,
      });
      setSuppliers(response.data);
    } catch (error) {
      if (error.response.status == 401) {
        dispatch({ type: "LOGOUT" });
        navigate("/");
      }
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getSupplierById = async () => {
    if (id) {
      setLoading(true);
      const response = await axios.post(`${tempUrl}/suppliers/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setNamaSupplier(response.data.namaSupplier);
      setKodeSupplier(response.data.kodeSupplier);
      setAlamatSupplier(response.data.alamatSupplier);
      setKotaSupplier(response.data.kotaSupplier);
      setTeleponSupplier(response.data.teleponSupplier);
      setLoading(false);
    }
  };

  const deleteSupplier = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteSupplier/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setSearchTerm("");
      setNamaSupplier("");
      setKodeSupplier("");
      setAlamatSupplier("");
      setKotaSupplier("");
      setTeleponSupplier("");
      navigate("/supplier");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${namaSupplier} tidak bisa dihapus karena sudah ada data!`);
      }
    }
    setLoading(false);
  };

  const downloadPdf = () => {
    var date = new Date();
    var current_date =
      date.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      "-" +
      (date.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      "-" +
      date.getFullYear();
    var current_time =
      date.getHours().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ":" +
      date.getMinutes().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ":" +
      date.getSeconds().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.alamatPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Daftar Supplier`, 85, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.autoTable({
      html: "#table",
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0],
      },
    });
    doc.save("daftarSupplier.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Supplier",
    sheet: "DaftarSupplier",
  });

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Supplier</h5>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              getSuppliers();
              setPreviewPdf(!previewPdf);
              setPreviewExcel(false);
            }}
          >
            PDF
          </Button>
          <Button
            color="secondary"
            startIcon={<SearchIcon />}
            onClick={() => {
              getSuppliers();
              setPreviewExcel(!previewExcel);
              setPreviewPdf(false);
            }}
          >
            Excel
          </Button>
        </ButtonGroup>
      </Box>
      {previewPdf && (
        <div>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => downloadPdf()}
          >
            CETAK
          </Button>
          <table class="styled-table" id="table" style={{ fontSize: "10px" }}>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Kota</th>
                <th>Telepon</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.kodeSupplier}</td>
                  <td>{user.namaSupplier}</td>
                  <td>{user.alamatSupplier}</td>
                  <td>{user.kotaSupplier}</td>
                  <td>{user.teleponSupplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        {previewExcel && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
          >
            EXCEL
          </Button>
        )}
        <table
          class="styled-table"
          id="table"
          style={{ fontSize: "10px" }}
          ref={tableRef}
        >
          {previewExcel && (
            <tbody>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Kota</th>
                <th>Telepon</th>
              </tr>
              {suppliers.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.kodeSupplier}</td>
                  <td>{user.namaSupplier}</td>
                  <td>{user.alamatSupplier}</td>
                  <td>{user.kotaSupplier}</td>
                  <td>{user.teleponSupplier}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/supplier/tambahSupplier`}
          editLink={`/supplier/${id}/edit`}
          deleteUser={deleteSupplier}
          nameUser={namaSupplier}
        />
      </Box>
      {id && (
        <Container>
          <hr />
          <Form>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Kode :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kodeSupplier} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Nama :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={namaSupplier} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Alamat :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={alamatSupplier} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Kota :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kotaSupplier} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Telepon :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={teleponSupplier} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
      <hr />
      <Form onSubmit={searchData}>
        <Box sx={searchBarContainer}>
          <SearchBar value={query} setSearchTerm={setQuery} />
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disableElevation
          >
            Cari
          </Button>
        </Box>
      </Form>
      <Box sx={tableContainer}>
        <ShowTableSupplier currentPosts={suppliersPagination} />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={Math.min(10, pages)}
          page={page + 1}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Container>
  );
};

export default TampilSupplier;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center",
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center",
};
