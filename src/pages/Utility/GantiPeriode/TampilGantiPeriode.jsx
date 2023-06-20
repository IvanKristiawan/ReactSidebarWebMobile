import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableGantiPeriode } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { SearchBar, Loader } from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Pagination,
  Button,
  ButtonGroup,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilGantiPeriode = () => {
  const tableRef = useRef(null);
  const { user, dispatch, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [namaPeriode, setNamaPeriode] = useState("");
  const [dariTanggal, setDariTanggal] = useState("");
  const [sampaiTanggal, setSampaiTanggal] = useState("");

  const [periodeReport, setPeriodeReport] = useState([]);

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodes, setPeriodes] = useState([]);

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

  useEffect(() => {
    getPeriodes();
    id && getPeriodeById();
  }, [id, page, searchTerm]);

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setSearchTerm(query);
  };

  const getPeriodes = async () => {
    try {
      const response = await axios.post(
        `${tempUrl}/tutupPeriodesAsc?search_query=${searchTerm}&page=${page}&limit=${limit}`,
        {
          _id: user.id,
          token: user.token,
        }
      );
      setPeriodes(response.data.tempAllPeriode);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getPeriodeReportData = async () => {
    try {
      const response = await axios.post(`${tempUrl}/tutupPeriodesOptions`, {
        _id: user.id,
        token: user.token,
      });
      setPeriodeReport(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getPeriodeById = async () => {
    if (id) {
      setLoading(true);
      const response = await axios.post(`${tempUrl}/tutupPeriodes/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setNamaPeriode(response.data.namaPeriode);
      setDariTanggal(response.data.dariTanggal);
      setSampaiTanggal(response.data.sampaiTanggal);
      setLoading(false);
    }
  };

  const gantiPeriode = async () => {
    try {
      const findSetting = await axios.post(`${tempUrl}/lastSetting`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id,
      });
      console.log(namaPeriode);
      const gantiPeriodeUser = await axios.post(
        `${tempUrl}/updateUserThenLogin/${user.id}`,
        {
          namaPeriode,
          _id: user.id,
          token: user.token,
        }
      );
      console.log(gantiPeriodeUser.data.details);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: gantiPeriodeUser.data.details,
        setting: findSetting.data,
      });
    } catch (err) {
      setIsFetchError(true);
    }
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
    doc.text(`${setting.namaDesa} - ${setting.kotaDesa}`, 15, 10);
    doc.text(`${setting.alamatDesa}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Daftar Periode`, 90, 30);
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
    doc.save("daftarPeriode.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Periode",
    sheet: "DaftarPeriode",
  });

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "13px",
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Periode</h5>
      <Typography sx={subTitleText}>
        Periode : {user.tutupperiode.namaPeriode}
      </Typography>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewPdf(!previewPdf);
              getPeriodeReportData();
              setPreviewExcel(false);
            }}
          >
            PDF
          </Button>
          <Button
            color="secondary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewExcel(!previewExcel);
              getPeriodeReportData();
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
          <table class="table" id="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Dari Tanggal</th>
                <th>Sampai Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {periodeReport.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaPeriode}</td>
                  <td>{user.dariTanggal}</td>
                  <td>{user.sampaiTanggal}</td>
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
        <table ref={tableRef}>
          {previewExcel && (
            <tbody>
              <tr>
                <th>Nama</th>
                <th>Dari Tanggal</th>
                <th>Sampai Tanggal</th>
              </tr>
              {periodeReport.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaPeriode}</td>
                  <td>{user.dariTanggal}</td>
                  <td>{user.sampaiTanggal}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        {id && (
          <>
            <Button
              variant="contained"
              color="success"
              sx={{ bgcolor: "success.light", textTransform: "none" }}
              startIcon={<ChangeCircleIcon />}
              size="small"
              onClick={() => gantiPeriode()}
            >
              Ganti Periode
            </Button>
          </>
        )}
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Nama Periode :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={namaPeriode} disabled readOnly />
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Dari Tanggal :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={dariTanggal} disabled readOnly />
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Sampai Tanggal :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={sampaiTanggal} disabled readOnly />
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
        <ShowTableGantiPeriode currentPosts={periodes} />
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

export default TampilGantiPeriode;

const subTitleText = {
  fontWeight: "900",
};

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
