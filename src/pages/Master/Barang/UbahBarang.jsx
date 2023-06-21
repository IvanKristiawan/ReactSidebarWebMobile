import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Autocomplete,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahBarang = () => {
  const { screenSize } = useStateContext();
  const { user, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
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
  const [namaKategori, setNamaKategori] = useState("");

  const [kategoris, setKategoris] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  let kategoriOptions = kategoris.map((kategori) => ({
    label: `${kategori.namaKategori}`,
  }));

  useEffect(() => {
    getBarangById();
    getKategorisData();
  }, []);

  const getBarangById = async () => {
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
    setNamaKategori(response.data.kategori.namaKategori);
    setLoading(false);
  };

  const getKategorisData = async () => {
    const response = await axios.post(`${tempUrl}/kategoris`, {
      _id: user.id,
      token: user.token,
    });
    setKategoris(response.data);
  };

  const updateBarang = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity() && namaKategori.length !== 0) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateBarang/${id}`, {
          barcode,
          kodeBarang,
          namaBarang,
          jumlah1: jumlah1 && jumlah1.replace(/,/g, ""),
          satuan1,
          jumlah2: jumlah2 && jumlah2.replace(/,/g, ""),
          satuan2,
          hargaPokok1: hargaPokok1 && hargaPokok1.replace(/,/g, ""),
          hargaPokok2: hargaPokok2 && hargaPokok2.replace(/,/g, ""),
          hargaJual1: hargaJual1 && hargaJual1.replace(/,/g, ""),
          hargaJual2: hargaJual2 && hargaJual2.replace(/,/g, ""),
          hargaGrosir1: hargaGrosir1 && hargaGrosir1.replace(/,/g, ""),
          hargaGrosir2: hargaGrosir2 && hargaGrosir2.replace(/,/g, ""),
          minimum: minimum && minimum.replace(/,/g, ""),
          konversi: konversi && konversi.replace(/,/g, ""),
          namaKategori,
          userIdUpdate: user.id,
          _id: user.id,
          token: user.token,
        });
        setLoading(false);
        navigate(`/barang/${id}`);
      } catch (error) {
        if (error.response.status == 401) {
          dispatch({ type: "LOGOUT" });
          navigate("/");
        } else {
          alert(error.response.data.message);
        }
      }
      setLoading(false);
    } else {
      setError(true);
      setOpen(!open);
    }
    setValidated(true);
  };

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "14px",
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Barang</h5>
      <hr />
      <Card>
        <Card.Header>Barang</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateBarang}>
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
                        Barcode <b style={colorRed}>*</b> :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          required
                          value={barcode}
                          onChange={(e) =>
                            setBarcode(e.target.value.toUpperCase())
                          }
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
                        Kode <b style={colorRed}>*</b> :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          required
                          value={kodeBarang}
                          onChange={(e) =>
                            setKodeBarang(e.target.value.toUpperCase())
                          }
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
                        Nama <b style={colorRed}>*</b> :
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          required
                          value={namaBarang}
                          onChange={(e) =>
                            setNamaBarang(e.target.value.toUpperCase())
                          }
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
                        Jumlah 1 :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={jumlah1}
                          onChange={(e) => {
                            let tempNum;
                            let isNumNan = isNaN(
                              parseInt(e.target.value.replace(/,/g, ""), 10)
                            );
                            if (isNumNan) {
                              tempNum = "";
                            } else {
                              tempNum = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              ).toLocaleString("en-US");
                            }
                            setJumlah1(tempNum);
                          }}
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
                          value={satuan1}
                          onChange={(e) =>
                            setSatuan1(e.target.value.toUpperCase())
                          }
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
                          value={hargaPokok1}
                          onChange={(e) => {
                            let tempNum;
                            let isNumNan = isNaN(
                              parseInt(e.target.value.replace(/,/g, ""), 10)
                            );
                            if (isNumNan) {
                              tempNum = "";
                            } else {
                              tempNum = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              ).toLocaleString("en-US");
                            }
                            setHargaPokok1(tempNum);
                          }}
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
                          value={hargaPokok2}
                          onChange={(e) => {
                            let tempNum;
                            let isNumNan = isNaN(
                              parseInt(e.target.value.replace(/,/g, ""), 10)
                            );
                            if (isNumNan) {
                              tempNum = "";
                            } else {
                              tempNum = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              ).toLocaleString("en-US");
                            }
                            setHargaPokok2(tempNum);
                          }}
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
                          value={hargaGrosir1}
                          onChange={(e) => {
                            let tempNum;
                            let isNumNan = isNaN(
                              parseInt(e.target.value.replace(/,/g, ""), 10)
                            );
                            if (isNumNan) {
                              tempNum = "";
                            } else {
                              tempNum = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              ).toLocaleString("en-US");
                            }
                            setHargaGrosir1(tempNum);
                          }}
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
                          value={hargaGrosir2}
                          onChange={(e) => {
                            let tempNum;
                            let isNumNan = isNaN(
                              parseInt(e.target.value.replace(/,/g, ""), 10)
                            );
                            if (isNumNan) {
                              tempNum = "";
                            } else {
                              tempNum = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              ).toLocaleString("en-US");
                            }
                            setHargaGrosir2(tempNum);
                          }}
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
                        Kategori <b style={colorRed}>*</b> :
                      </Form.Label>
                      <Col sm="9">
                        <Autocomplete
                          size="small"
                          disablePortal
                          id="combo-box-demo"
                          options={kategoriOptions}
                          renderInput={(params) => (
                            <TextField
                              error={error && namaKategori.length === 0 && true}
                              size="small"
                              {...params}
                            />
                          )}
                          onInputChange={(e, value) => {
                            setNamaKategori(value);
                          }}
                          defaultValue={namaKategori}
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
                        Minimum :
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          value={minimum}
                          onChange={(e) => {
                            let tempNum;
                            let isNumNan = isNaN(
                              parseInt(e.target.value.replace(/,/g, ""), 10)
                            );
                            if (isNumNan) {
                              tempNum = "";
                            } else {
                              tempNum = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              ).toLocaleString("en-US");
                            }
                            setMinimum(tempNum);
                          }}
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
                          value={konversi}
                          onChange={(e) => {
                            let tempNum;
                            let isNumNan = isNaN(
                              parseInt(e.target.value.replace(/,/g, ""), 10)
                            );
                            if (isNumNan) {
                              tempNum = "";
                            } else {
                              tempNum = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              ).toLocaleString("en-US");
                            }
                            setKonversi(tempNum);
                          }}
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
                          value={jumlah2}
                          onChange={(e) => {
                            let tempNum;
                            let isNumNan = isNaN(
                              parseInt(e.target.value.replace(/,/g, ""), 10)
                            );
                            if (isNumNan) {
                              tempNum = "";
                            } else {
                              tempNum = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              ).toLocaleString("en-US");
                            }
                            setJumlah2(tempNum);
                          }}
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
                          value={satuan2}
                          onChange={(e) =>
                            setSatuan2(e.target.value.toUpperCase())
                          }
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
                          value={hargaJual1}
                          onChange={(e) => {
                            let tempNum;
                            let isNumNan = isNaN(
                              parseInt(e.target.value.replace(/,/g, ""), 10)
                            );
                            if (isNumNan) {
                              tempNum = "";
                            } else {
                              tempNum = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              ).toLocaleString("en-US");
                            }
                            setHargaJual1(tempNum);
                          }}
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
                          value={hargaJual2}
                          onChange={(e) => {
                            let tempNum;
                            let isNumNan = isNaN(
                              parseInt(e.target.value.replace(/,/g, ""), 10)
                            );
                            if (isNumNan) {
                              tempNum = "";
                            } else {
                              tempNum = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              ).toLocaleString("en-US");
                            }
                            setHargaJual2(tempNum);
                          }}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Box>
            </Box>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/barang")}
                sx={{ marginRight: 2 }}
              >
                {"< Kembali"}
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                type="submit"
              >
                Edit
              </Button>
            </Box>
          </Form>
        </Card.Body>
      </Card>
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default UbahBarang;

const alertBox = {
  width: "100%",
};

const colorRed = {
  color: "red",
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
