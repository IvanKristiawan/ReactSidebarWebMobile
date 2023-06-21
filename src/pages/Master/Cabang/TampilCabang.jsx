import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableCabang } from "../../../components/ShowTable";
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

const TampilCabang = () => {
  const tableRef = useRef(null);
  const { user, dispatch, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeCabang, setKodeCabang] = useState("");
  const [namaCabang, setNamaCabang] = useState("");
  const [alamatCabang, setAlamatCabang] = useState("");
  const [teleponCabang, setTeleponCabang] = useState("");
  const [picCabang, setPicCabang] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cabangs, setCabangs] = useState([]);
  const [cabangsPagination, setCabangsPagination] = useState([]);
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
    getCabangsPagination();
    id && getCabangById();
  }, [id, page, searchTerm]);

  const getCabangsPagination = async () => {
    try {
      const response = await axios.post(
        `${tempUrl}/cabangsPagination?search_query=${searchTerm}&page=${page}&limit=${limit}`,
        {
          _id: user.id,
          token: user.token,
        }
      );
      setCabangsPagination(response.data.cabangs);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getCabangs = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/cabangs`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id,
      });
      setCabangs(response.data);
    } catch (error) {
      if (error.response.status == 401) {
        dispatch({ type: "LOGOUT" });
        navigate("/");
      }
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getCabangById = async () => {
    if (id) {
      setLoading(true);
      const response = await axios.post(`${tempUrl}/cabangs/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setKodeCabang(response.data.id);
      setNamaCabang(response.data.namaCabang);
      setAlamatCabang(response.data.alamatCabang);
      setTeleponCabang(response.data.teleponCabang);
      setPicCabang(response.data.picCabang);
      setLoading(false);
    }
  };

  const deleteCabang = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteCabang/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setSearchTerm("");
      setKodeCabang("");
      setNamaCabang("");
      setAlamatCabang("");
      setTeleponCabang("");
      setPicCabang("");
      navigate("/cabang");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${namaCabang} tidak bisa dihapus karena sudah ada data!`);
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
    doc.text(`Daftar Cabang`, 85, 30);
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
    doc.save("daftarCabang.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Cabang",
    sheet: "DaftarCabang",
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
      <h5 style={{ fontWeight: 400 }}>Daftar Cabang</h5>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              getCabangs();
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
              getCabangs();
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
                <th>Telepon</th>
                <th>PIC</th>
              </tr>
            </thead>
            <tbody>
              {cabangs.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.namaCabang}</td>
                  <td>{user.alamatCabang}</td>
                  <td>{user.teleponCabang}</td>
                  <td>{user.picCabang}</td>
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
                <th>Telepon</th>
                <th>PIC</th>
              </tr>
              {cabangs.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.namaCabang}</td>
                  <td>{user.alamatCabang}</td>
                  <td>{user.teleponCabang}</td>
                  <td>{user.picCabang}</td>
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
          addLink={`/cabang/tambahCabang`}
          editLink={`/cabang/${id}/edit`}
          deleteUser={deleteCabang}
          nameUser={namaCabang}
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
                    <Form.Control value={kodeCabang} disabled readOnly />
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
                    <Form.Control value={namaCabang} disabled readOnly />
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
                    <Form.Control value={alamatCabang} disabled readOnly />
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
                    <Form.Control value={teleponCabang} disabled readOnly />
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
                    PIC :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={picCabang} disabled readOnly />
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
        <ShowTableCabang currentPosts={cabangsPagination} />
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

export default TampilCabang;

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
