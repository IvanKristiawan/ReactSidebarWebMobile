import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../../constants/report.css";
import { formatDate } from "../../../constants/helper";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableBarang } from "../../../components/ShowTable";
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

const TampilBarang = () => {
  const tableRef = useRef(null);
  const { user, dispatch, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [kodeBarang, setKodeBarang] = useState("");
  const [namaBarang, setNamaBarang] = useState("");
  const [jumlah1, setJumlah1] = useState("");
  const [satuan1, setSatuan1] = useState("");
  const [jumlah2, setJumlah2] = useState("");
  const [satuan2, setSatuan2] = useState("");
  const [hargaPokok1, setHargaPokok1] = useState("");
  const [hargaPokok2, setHargaPokok2] = useState("");
  const [hargaJual1, setHargaJual1] = useState("");
  const [hargaJual2, setHargaJual2] = useState("");
  const [hargaGrosir1, setHargaGrosir1] = useState("");
  const [hargaGrosir2, setHargaGrosir2] = useState("");
  const [minimum, setMinimum] = useState("");
  const [konversi, setKonversi] = useState("");
  const [tglOpname, setTglOpname] = useState("");
  const [namaKategori, setNamaKategori] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [barangs, setBarangs] = useState([]);
  const [barangsPagination, setBarangsPagination] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [query, setQuery] = useState("");

  const handleChange = (e, p) => {
    setPage(p - 1);
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setSearchTerm(query);
  };

  useEffect(() => {
    getBarangsPagination();
    id && getBarangById();
  }, [id, page, searchTerm]);

  const getBarangsPagination = async () => {
    try {
      const response = await axios.post(
        `${tempUrl}/barangsPagination?search_query=${searchTerm}&page=${page}&limit=${limit}`,
        {
          _id: user.id,
          token: user.token,
        }
      );
      setBarangsPagination(response.data.barangs);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (error) {
      if (error.response.status == 401) {
        dispatch({ type: "LOGOUT" });
        navigate("/");
      }
      setIsFetchError(true);
    }
  };

  const getBarangs = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/barangs`, {
        _id: user.id,
        token: user.token,
      });
      setBarangs(response.data);
    } catch (error) {
      if (error.response.status == 401) {
        dispatch({ type: "LOGOUT" });
        navigate("/");
      }
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getBarangById = async () => {
    if (id) {
      setLoading(true);
      const response = await axios.post(`${tempUrl}/barangs/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setBarcode(response.data.barcode);
      setKodeBarang(response.data.kodeBarang);
      setNamaBarang(response.data.namaBarang);
      setJumlah1(response.data.jumlah1);
      setSatuan1(response.data.satuan1);
      setJumlah2(response.data.jumlah2);
      setSatuan2(response.data.satuan2);
      setHargaPokok1(response.data.hargaPokok1);
      setHargaPokok2(response.data.hargaPokok2);
      setHargaJual1(response.data.hargaJual1);
      setHargaJual2(response.data.hargaJual2);
      setHargaGrosir1(response.data.hargaGrosir1);
      setHargaGrosir2(response.data.hargaGrosir2);
      setMinimum(response.data.minimum);
      setKonversi(response.data.konversi);
      if (response.data.tglOpname) {
        setTglOpname(formatDate(response.data.tglOpname));
      }
      setNamaKategori(response.data.kategori.namaKategori);
      setLoading(false);
    }
  };

  const deleteBarang = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteBarang/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setSearchTerm("");
      setBarcode("");
      setKodeBarang("");
      setNamaBarang("");
      setJumlah1("");
      setSatuan1("");
      setJumlah2("");
      setSatuan2("");
      setHargaPokok1("");
      setHargaPokok2("");
      setHargaJual1("");
      setHargaJual2("");
      setHargaGrosir1("");
      setHargaGrosir2("");
      setMinimum("");
      setKonversi("");
      setTglOpname("");
      setNamaKategori("");
      navigate("/barang");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${barcode} tidak bisa dihapus karena sudah ada data!`);
      }
    }
    setLoading(false);
  };

  const downloadPdf = () => {
    var date = new Date();
    var current_date = formatDate(date);
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
    const doc = new jsPDF("l", "mm", [340, 210]);
    doc.setFontSize(10);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.alamatPerusahaan}`, 15, 15);
    doc.setFontSize(14);
    doc.text(`Daftar Barang`, 150, 30);
    doc.setFontSize(8);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      200
    );
    doc.autoTable({
      html: "#table",
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0],
      },
      styles: {
        fontSize: 8,
      },
    });
    doc.save("daftarBarang.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Barang",
    sheet: "DaftarBarang",
  });

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "14px",
  };

  const textTableRight = {
    letterSpacing: "0.01px",
    textAlign: "right",
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
      <h5 style={{ fontWeight: 400 }}>Daftar Barang</h5>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              getBarangs();
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
              getBarangs();
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
                <th>Barcode</th>
                <th>Kode</th>
                <th>Nama</th>
                <th>Jumlah 1</th>
                <th>Satuan 1</th>
                <th>Jumlah 2</th>
                <th>Satuan 2</th>
                <th>Harga Pokok 1</th>
                <th>Harga Pokok 2</th>
                <th>Harga Jual 1</th>
                <th>Harga Jual 2</th>
                <th>Harga Grosir 1</th>
                <th>Harga Grosir 2</th>
                <th>Minimum</th>
                <th>Konversi</th>
                <th>Tgl. Opname</th>
                <th>Kategori</th>
              </tr>
            </thead>
            <tbody>
              {barangs.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.barcode}</td>
                  <td>{user.kodeBarang}</td>
                  <td>{user.namaBarang}</td>
                  <td style={textTableRight}>
                    {user.jumlah1.toLocaleString("en-US")}
                  </td>
                  <td>{user.satuan1}</td>
                  <td style={textTableRight}>
                    {user.jumlah2.toLocaleString("en-US")}
                  </td>
                  <td>{user.satuan2}</td>
                  <td style={textTableRight}>
                    {user.hargaPokok1.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.hargaPokok2.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.hargaJual1.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.hargaJual2.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.hargaGrosir1.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.hargaGrosir2.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.minimum.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.konversi.toLocaleString("en-US")}
                  </td>
                  <td>{user.tglOpname}</td>
                  <td>{user.kategori.namaKategori}</td>
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
                <th>Barcode</th>
                <th>Kode</th>
                <th>Nama</th>
                <th>Jumlah 1</th>
                <th>Satuan 1</th>
                <th>Jumlah 2</th>
                <th>Satuan 2</th>
                <th>Harga Pokok 1</th>
                <th>Harga Pokok 2</th>
                <th>Harga Jual 1</th>
                <th>Harga Jual 2</th>
                <th>Harga Grosir 1</th>
                <th>Harga Grosir 2</th>
                <th>Minimum</th>
                <th>Konversi</th>
                <th>Tgl. Opname</th>
                <th>Kategori</th>
              </tr>
              {barangs.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.barcode}</td>
                  <td>{user.kodeBarang}</td>
                  <td>{user.namaBarang}</td>
                  <td style={textTableRight}>
                    {user.jumlah1.toLocaleString("en-US")}
                  </td>
                  <td>{user.satuan1}</td>
                  <td style={textTableRight}>
                    {user.jumlah2.toLocaleString("en-US")}
                  </td>
                  <td>{user.satuan2}</td>
                  <td style={textTableRight}>
                    {user.hargaPokok1.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.hargaPokok2.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.hargaJual1.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.hargaJual2.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.hargaGrosir1.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.hargaGrosir2.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.minimum.toLocaleString("en-US")}
                  </td>
                  <td style={textTableRight}>
                    {user.konversi.toLocaleString("en-US")}
                  </td>
                  <td>{user.tglOpname}</td>
                  <td>{user.kategori.namaKategori}</td>
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
          addLink={`/barang/tambahBarang`}
          editLink={`/barang/${id}/edit`}
          deleteUser={deleteBarang}
          nameUser={barcode}
        />
      </Box>
      {id && (
        <Container>
          <hr />
          <Form>
            <Box sx={textFieldContainer}>
              <Box sx={textFieldWrapper}>
                <Row>
                  <Col sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="6" style={textRightSmall}>
                        Barcode :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control value={barcode} disabled readOnly />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="6" style={textRightSmall}>
                        Kode :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control value={kodeBarang} disabled readOnly />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="3" style={textRightSmall}>
                        Nama :
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control value={namaBarang} disabled readOnly />
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
                      <Form.Label column sm="6" style={textRightSmall}>
                        Jumlah 1 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={jumlah1.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="6" style={textRightSmall}>
                        Satuan 1 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={satuan1.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
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
                      <Form.Label column sm="6" style={textRightSmall}>
                        Harga Pokok 1 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={hargaPokok1.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="6" style={textRightSmall}>
                        Harga Pokok 2 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={hargaPokok2.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
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
                      <Form.Label column sm="6" style={textRightSmall}>
                        Harga Grosir 1 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={hargaGrosir1.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="6" style={textRightSmall}>
                        Harga Grosir 2 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={hargaGrosir2.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Box>
              <Box sx={[textFieldWrapper, secondWrapper]}>
                <Row>
                  <Col>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="3" style={textRightSmall}>
                        Kategori :
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control value={namaKategori} disabled readOnly />
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
                      <Form.Label column sm="6" style={textRightSmall}>
                        Minimum :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={minimum.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="6" style={textRightSmall}>
                        Konversi :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={konversi.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
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
                      <Form.Label column sm="6" style={textRightSmall}>
                        Jumlah 2 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={jumlah2.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="6" style={textRightSmall}>
                        Satuan 2 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={satuan2.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
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
                      <Form.Label column sm="6" style={textRightSmall}>
                        Harga Jual 1 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={hargaJual1.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="6" style={textRightSmall}>
                        Harga Jual 2 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={hargaJual2.toLocaleString("en-US")}
                          disabled
                          readOnly
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="3" style={textRightSmall}>
                        Tgl Opname :
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control value={tglOpname} disabled readOnly />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Box>
            </Box>
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
        <ShowTableBarang currentPosts={barangsPagination} />
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

export default TampilBarang;

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

const textFieldContainer = {
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row",
  },
};

const textFieldWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw",
  },
};

const secondWrapper = {
  marginLeft: {
    sm: 4,
  },
  marginTop: {
    sm: 0,
    xs: 4,
  },
};
