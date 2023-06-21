import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahKategori = () => {
  const { screenSize } = useStateContext();
  const { user, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeKategori, setKodeKategori] = useState("");
  const [namaKategori, setNamaKategori] = useState("");

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
    getKategoriById();
  }, []);

  const getKategoriById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/kategoris/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setKodeKategori(response.data.kodeKategori);
    setNamaKategori(response.data.namaKategori);
    setLoading(false);
  };

  const updateKategori = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateKategori/${id}`, {
            kodeKategori,
            namaKategori,
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token,
          });
          setLoading(false);
          navigate(`/kategori/${id}`);
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
      <h5 style={{ fontWeight: 400 }}>Ubah Kategori</h5>
      <hr />
      <Card>
        <Card.Header>Kategori</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateKategori}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Kode <b style={colorRed}>*</b> :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={kodeKategori}
                      onChange={(e) =>
                        setKodeKategori(e.target.value.toUpperCase())
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
                  <Form.Label column sm="4" style={textRight}>
                    Nama <b style={colorRed}>*</b> :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={namaKategori}
                      onChange={(e) =>
                        setNamaKategori(e.target.value.toUpperCase())
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
                onClick={() => navigate("/kategori")}
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

export default UbahKategori;

const colorRed = {
  color: "red",
};

const alertBox = {
  width: "100%",
};
