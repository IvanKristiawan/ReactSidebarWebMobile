import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahPelanggan = () => {
  const { screenSize } = useStateContext();
  const { user, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodePelanggan, setKodePelanggan] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [alamatPelanggan, setAlamatPelanggan] = useState("");
  const [kotaPelanggan, setKotaPelanggan] = useState("");
  const [teleponSupplier, setTeleponPelanggan] = useState("");

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
    getPelangganById();
  }, []);

  const getPelangganById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/pelanggans/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setKodePelanggan(response.data.kodePelanggan);
    setNamaPelanggan(response.data.namaPelanggan);
    setAlamatPelanggan(response.data.alamatPelanggan);
    setKotaPelanggan(response.data.kotaPelanggan);
    setTeleponPelanggan(response.data.teleponSupplier);
    setLoading(false);
  };

  const updatePelanggan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updatePelanggan/${id}`, {
            kodePelanggan,
            namaPelanggan,
            alamatPelanggan,
            kotaPelanggan,
            teleponSupplier,
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token,
          });
          setLoading(false);
          navigate(`/pelanggan/${id}`);
        } catch (error) {
          if (error.response.status == 401) {
            dispatch({ type: "LOGOUT" });
            navigate("/");
          } else {
            alert(error.response.data.message);
          }
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

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Pelanggan</h5>
      <hr />
      <Card>
        <Card.Header>Pelanggan</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updatePelanggan}>
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
                      value={teleponSupplier}
                      onChange={(e) =>
                        setTeleponPelanggan(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box>
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

export default UbahPelanggan;

const colorRed = {
  color: "red",
};

const alertBox = {
  width: "100%",
};
