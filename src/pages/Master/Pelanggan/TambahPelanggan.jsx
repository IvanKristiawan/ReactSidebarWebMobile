import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahPelanggan = () => {
  const { screenSize } = useStateContext();
  const { user, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodePelanggan, setKodePelanggan] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [alamatPelanggan, setAlamatPelanggan] = useState("");
  const [kotaPelanggan, setKotaPelanggan] = useState("");
  const [teleponPelanggan, setTeleponPelanggan] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getPelangganNextKode();
  }, []);

  const getPelangganNextKode = async () => {
    const response = await axios.post(`${tempUrl}/pelangganNextKode`, {
      _id: user.id,
      token: user.token,
    });
    setKodePelanggan(response.data);
  };

  const savePelanggan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/savePelanggan`, {
          kodePelanggan,
          namaPelanggan,
          alamatPelanggan,
          kotaPelanggan,
          teleponPelanggan,
          userIdInput: user.id,
          _id: user.id,
          kodePelanggan,
          token: user.token,
        });
        setLoading(false);
        navigate("/pelanggan");
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

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Pelanggan</h5>
      <hr />
      <Card>
        <Card.Header>Pelanggan</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={savePelanggan}>
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
                    <Form.Control value={kodePelanggan} disabled readOnly />
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
                    Nama <b style={colorRed}>*</b> :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaPelanggan}
                      onChange={(e) =>
                        setNamaPelanggan(e.target.value.toUpperCase())
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
                  <Form.Label column sm="3" style={textRight}>
                    Alamat :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={alamatPelanggan}
                      onChange={(e) =>
                        setAlamatPelanggan(e.target.value.toUpperCase())
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
                  <Form.Label column sm="3" style={textRight}>
                    Kota :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={kotaPelanggan}
                      onChange={(e) =>
                        setKotaPelanggan(e.target.value.toUpperCase())
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
                  <Form.Label column sm="3" style={textRight}>
                    Telepon :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="number"
                      value={teleponPelanggan}
                      onChange={(e) =>
                        setTeleponPelanggan(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/pelanggan")}
                sx={{ marginRight: 2 }}
              >
                {"< Kembali"}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                type="submit"
              >
                Simpan
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

export default TambahPelanggan;

const colorRed = {
  color: "red",
};

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};
