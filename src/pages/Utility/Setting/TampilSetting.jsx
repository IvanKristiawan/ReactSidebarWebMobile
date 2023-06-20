import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Box, Button, ButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const TampilSetting = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [settingId, setSettingId] = useState("");
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamatPerusahaan, setAlamatPerusahaan] = useState("");
  const [kotaPerusahaan, setKotaPerusahaan] = useState("");
  const [kabupatenPerusahaan, setKabupatenPerusahaan] = useState("");
  const [provinsiPerusahaan, setProvinsiPerusahaan] = useState("");
  const [teleponPerusahaan, setTeleponPerusahaan] = useState("");
  const [direkturUtama, setDirekturUtama] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSettingByCabang();
  }, []);

  const getSettingByCabang = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/lastSetting`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id,
      });
      setSettingId(response.data.id);
      setNamaPerusahaan(response.data.namaPerusahaan);
      setAlamatPerusahaan(response.data.alamatPerusahaan);
      setKotaPerusahaan(response.data.kotaPerusahaan);
      setKabupatenPerusahaan(response.data.kabupatenPerusahaan);
      setProvinsiPerusahaan(response.data.provinsiPerusahaan);
      setTeleponPerusahaan(response.data.teleponPerusahaan);
      setDirekturUtama(response.data.direkturUtama);
    } catch (error) {
      alert(error);
    }
    setLoading(false);
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
      <h5 style={{ fontWeight: 400 }}>Setting</h5>
      <Container className="d-flex justify-content-center">
        <ButtonGroup variant="contained">
          <Button
            color="primary"
            startIcon={<EditIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => {
              navigate(`/setting/${settingId}/edit`);
            }}
          >
            Ubah Setting
          </Button>
        </ButtonGroup>
      </Container>
      <hr />
      <Container>
        <Form>
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
                      <Form.Control value={namaPerusahaan} disabled readOnly />
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
                    <Form.Label column sm="4" style={textRightSmall}>
                      Kabupaten Perusahaan :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        value={kabupatenPerusahaan}
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
                    <Form.Label column sm="4" style={textRightSmall}>
                      Telepon Perusahaan :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        value={teleponPerusahaan}
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
                    <Form.Label column sm="4" style={textRight}>
                      Kota Perusahaan :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control value={kotaPerusahaan} disabled readOnly />
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
                    <Form.Label column sm="4" style={textRightSmall}>
                      Direktur Utama :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control value={direkturUtama} disabled readOnly />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Box>
          </Box>
          <hr />
        </Form>
      </Container>
    </Container>
  );
};

export default TampilSetting;

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
