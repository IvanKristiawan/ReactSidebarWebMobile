import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahSetting = () => {
  const { screenSize } = useStateContext();
  const { user, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamatPerusahaan, setAlamatPerusahaan] = useState("");
  const [kotaPerusahaan, setKotaPerusahaan] = useState("");
  const [kabupatenPerusahaan, setKabupatenPerusahaan] = useState("");
  const [provinsiPerusahaan, setProvinsiPerusahaan] = useState("");
  const [teleponPerusahaan, setTeleponPerusahaan] = useState("");
  const [direkturUtama, setDirekturUtama] = useState("");

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

  useEffect(() => {
    getSettingById();
  }, []);

  const getSettingById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/settings/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setNamaPerusahaan(response.data.namaPerusahaan);
    setAlamatPerusahaan(response.data.alamatPerusahaan);
    setKotaPerusahaan(response.data.kotaPerusahaan);
    setKabupatenPerusahaan(response.data.kabupatenPerusahaan);
    setProvinsiPerusahaan(response.data.provinsiPerusahaan);
    setTeleponPerusahaan(response.data.teleponPerusahaan);
    setDirekturUtama(response.data.direkturUtama);
    setLoading(false);
  };

  const updateSetting = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateSetting/${id}`, {
            namaPerusahaan,
            alamatPerusahaan,
            kotaPerusahaan,
            kabupatenPerusahaan,
            provinsiPerusahaan,
            teleponPerusahaan,
            direkturUtama,
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token,
          });
          const findSetting = await axios.post(`${tempUrl}/lastSetting`, {
            _id: user.id,
            token: user.token,
            kodeCabang: user.cabang.id,
          });
          const gantiPeriodeUser = await axios.post(
            `${tempUrl}/updateUserThenLogin/${user.id}`,
            {
              _id: user.id,
              token: user.token,
              namaPeriode: user.tutupperiode.namaPeriode,
            }
          );
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: gantiPeriodeUser.data.details,
            setting: findSetting.data,
          });
          setLoading(false);
          navigate(`/setting`);
        } catch (err) {
          console.log(err);
        }
        setLoading(false);
      } catch (error) {
        alert(error);
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
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Setting</h5>
      <hr />
      <Card>
        <Card.Header>Setting</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateSetting}>
            <Box sx={textFieldContainer}>
              <Box sx={textFieldWrapper}>
                <Row>
                  <Col>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="4" style={textRight}>
                        Nama Perusahaan :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          value={namaPerusahaan}
                          required
                          onChange={(e) =>
                            setNamaPerusahaan(e.target.value.toUpperCase())
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
                      <Form.Label column sm="4" style={textRightSmall}>
                        Alamat Perusahaan :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          value={alamatPerusahaan}
                          required
                          onChange={(e) =>
                            setAlamatPerusahaan(e.target.value.toUpperCase())
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
                      <Form.Label column sm="4" style={textRightSmall}>
                        Kabupaten Perusahaan :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          value={kabupatenPerusahaan}
                          required
                          onChange={(e) =>
                            setKabupatenPerusahaan(e.target.value.toUpperCase())
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
                      <Form.Label column sm="4" style={textRightSmall}>
                        Telepon Perusahaan :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          value={teleponPerusahaan}
                          required
                          onChange={(e) =>
                            setTeleponPerusahaan(e.target.value.toUpperCase())
                          }
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
                      <Form.Label column sm="4" style={textRight}>
                        Kota Perusahaan :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          value={kotaPerusahaan}
                          required
                          onChange={(e) =>
                            setKotaPerusahaan(e.target.value.toUpperCase())
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
                      <Form.Label column sm="4" style={textRightSmall}>
                        Provinsi Perusahaan :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          value={provinsiPerusahaan}
                          required
                          onChange={(e) =>
                            setProvinsiPerusahaan(e.target.value.toUpperCase())
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
                      <Form.Label column sm="4" style={textRightSmall}>
                        Direktur Utama :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          value={direkturUtama}
                          required
                          onChange={(e) =>
                            setDirekturUtama(e.target.value.toUpperCase())
                          }
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Box>
            </Box>
            <hr />
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/setting")}
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

export default UbahSetting;

const alertBox = {
  width: "100%",
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
