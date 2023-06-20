import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  Box,
  Alert,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahUser = () => {
  const [isFetchError, setIsFetchError] = useState(false);
  const { screenSize } = useStateContext();
  const { user, setting } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [password, setPassword] = useState("");
  const [periodeId, setPeriodeId] = useState("");
  const [namaPeriode, setNamaPeriode] = useState("");
  const [kodeCabang, setKodeCabang] = useState("");
  const [periodes, setPeriodes] = useState([]);
  const [cabangs, setCabangs] = useState([]);

  // Akses Master
  const [checkAllAkses, setCheckAllAkses] = useState(false);

  const [kategori, setKategori] = useState(false);
  const [barang, setBarang] = useState(false);
  const [supplier, setSupplier] = useState(false);
  const [pelanggan, setPelanggan] = useState(false);
  const [cabang, setCabang] = useState(false);

  // Akses Stok
  const [stokGudang, setStokGudang] = useState(false);
  const [koreksiStokGudang, setKoreksiStokGudang] = useState(false);
  const [stokToko, setStokToko] = useState(false);
  const [koreksiStokToko, setKoreksiStokToko] = useState(false);
  const [transferStok, setTransferStok] = useState(false);

  // Akses Pembelian
  const [pembelian, setPembelian] = useState(false);

  // Akses Utility
  const [profilUser, setProfilUser] = useState(false);
  const [daftarUser, setDaftarUser] = useState(false);
  const [settingAkses, setSettingAkses] = useState(false);
  const [gantiPeriode, setGantiPeriode] = useState(false);
  const [tutupPeriode, setTutupPeriode] = useState(false);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openAlertUsername, setOpenAlertUsername] = useState(false);

  const handleClickOpenAlertUsername = () => {
    setOpenAlertUsername(true);
  };

  const handleCloseAlertUsername = () => {
    setOpenAlertUsername(false);
  };

  const tipeUserOption = ["MANAGER", "ADMIN"];
  const tipeUserOptionOwner = ["OWNER", "MANAGER", "ADMIN"];
  const cabangOption = cabangs.map((cabang) => ({
    label: `${cabang.id} - ${cabang.namaCabang}`,
  }));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getPeriodes();
    getCabangsData();
  }, []);

  const getPeriodes = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/tutupPeriodesOptions`, {
        _id: user.id,
        token: user.token,
      });
      setPeriodes(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getCabangsData = async () => {
    const response = await axios.post(`${tempUrl}/cabangs`, {
      _id: user.id,
      token: user.token,
    });
    setCabangs(response.data);

    if (user.tipeUser !== "OWNER") {
      setKodeCabang(`${user.cabang.id} - ${user.cabang.namaCabang}`);
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (
      form.checkValidity() &&
      tipeUser.length != 0 &&
      namaPeriode.length != 0 &&
      kodeCabang.length != 0
    ) {
      setLoading(true);
      try {
        let tempUsername = await axios.post(`${tempUrl}/getUsername`, {
          username,
          _id: user.id,
          token: user.token,
        });

        let isUsernameAlreadyExist = tempUsername.data.length > 0;
        if (isUsernameAlreadyExist) {
          handleClickOpenAlertUsername();
        } else {
          setLoading(true);
          await axios.post(`${tempUrl}/auth/register`, {
            username,
            password,
            tipeUser,
            namaPeriode,
            akses: {
              kategori,
              barang,
              supplier,
              pelanggan,
              cabang,

              stokGudang,
              koreksiStokGudang,
              stokToko,
              koreksiStokToko,
              transferStok,

              pembelian,

              profilUser,
              daftarUser,
              setting: settingAkses,
              tutupPeriode,
              gantiPeriode,
            },
            cabangId: kodeCabang.split(" -", 1)[0],
            _id: user.id,
            token: user.token,
          });
          setLoading(false);
          navigate("/daftarUser");
        }
      } catch (err) {
        alert(err);
      }
      setLoading(false);
    } else {
      setError(true);
      setOpen(!open);
    }
    setValidated(true);
  };

  const periodeOption = periodes.map((prd) => ({
    label: prd.namaPeriode,
  }));

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "14px",
  };

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah User</h5>
      <Dialog
        open={openAlertUsername}
        onClose={handleCloseAlertUsername}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Data Username Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Username ${username} sudah ada, ganti Username!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertUsername}>Ok</Button>
        </DialogActions>
      </Dialog>
      <hr />
      <Card>
        <Card.Header>User</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveUser}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Username <b style={colorRed}>*</b> :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.toUpperCase())
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
                    Tipe User <b style={colorRed}>*</b> :
                  </Form.Label>
                  <Col sm="9">
                    <Autocomplete
                      size="small"
                      disablePortal
                      id="combo-box-demo"
                      options={
                        user.tipeUser === "OWNER"
                          ? tipeUserOptionOwner
                          : tipeUserOption
                      }
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          error={error && tipeUser.length === 0 && true}
                          helperText={
                            error &&
                            tipeUser.length === 0 &&
                            "Tipe User harus diisi!"
                          }
                          {...params}
                        />
                      )}
                      onInputChange={(e, value) => {
                        setTipeUser(value);
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
                  <Form.Label column sm="3" style={textRight}>
                    Periode <b style={colorRed}>*</b> :
                  </Form.Label>
                  <Col sm="9">
                    <Autocomplete
                      size="small"
                      disablePortal
                      id="combo-box-demo"
                      options={periodeOption}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          error={error && namaPeriode.length === 0 && true}
                          helperText={
                            error &&
                            namaPeriode.length === 0 &&
                            "Periode harus diisi!"
                          }
                          {...params}
                        />
                      )}
                      onInputChange={(e, value) => {
                        setNamaPeriode(value);
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
                  <Form.Label column sm="3" style={textRight}>
                    Password <b style={colorRed}>*</b> :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value.toUpperCase())
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
                    Cabang <b style={colorRed}>*</b> :
                  </Form.Label>
                  <Col sm="9">
                    {user.tipeUser === "OWNER" ? (
                      <Autocomplete
                        size="small"
                        disablePortal
                        id="combo-box-demo"
                        options={cabangOption}
                        renderInput={(params) => (
                          <TextField
                            size="small"
                            error={error && kodeCabang.length === 0 && true}
                            helperText={
                              error &&
                              kodeCabang.length === 0 &&
                              "Cabang harus diisi!"
                            }
                            {...params}
                          />
                        )}
                        onInputChange={(e, value) => {
                          setKodeCabang(value);
                        }}
                      />
                    ) : (
                      <Form.Control
                        required
                        value={kodeCabang}
                        disabled
                        readOnly
                      />
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Container style={{ marginTop: 30 }}>
              <h4>Hak Akses User</h4>
              <Box sx={showDataContainerCheck}>
                <Row>
                  <Col>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox checked={checkAllAkses} />}
                        label="Pilih Semua"
                        onChange={() => {
                          setCheckAllAkses(!checkAllAkses);
                          // Akses Master
                          setKategori(!checkAllAkses);
                          setBarang(!checkAllAkses);
                          setSupplier(!checkAllAkses);
                          setPelanggan(!checkAllAkses);
                          setCabang(!checkAllAkses);

                          // Akses Stok
                          setStokGudang(!checkAllAkses);
                          setKoreksiStokGudang(!checkAllAkses);
                          setStokToko(!checkAllAkses);
                          setKoreksiStokToko(!checkAllAkses);
                          setTransferStok(!checkAllAkses);

                          // Akses Pembelian
                          setPembelian(!checkAllAkses);

                          // Akses Utility
                          setProfilUser(!checkAllAkses);
                          setDaftarUser(!checkAllAkses);
                          setSettingAkses(!checkAllAkses);
                          setGantiPeriode(!checkAllAkses);
                          setTutupPeriode(!checkAllAkses);
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Box>
              <Box sx={showDataContainerCheck}>
                <Row>
                  <Col>
                    <Typography variant="p" sx={[spacingTop]}>
                      Master
                    </Typography>
                    <Form>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={kategori} />}
                          label="Kategori"
                          onChange={() => setKategori(!kategori)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={barang} />}
                          label="Barang"
                          onChange={() => setBarang(!barang)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={supplier} />}
                          label="Supplier"
                          onChange={() => setSupplier(!supplier)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={pelanggan} />}
                          label="Pelanggan"
                          onChange={() => setPelanggan(!pelanggan)}
                        />
                        <FormControlLabel
                          control={<Checkbox checked={cabang} />}
                          label="Cabang"
                          onChange={() => setCabang(!cabang)}
                        />
                      </FormGroup>
                    </Form>
                    <Typography variant="p" sx={[spacingTop]}>
                      Stok
                    </Typography>
                    <Form>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={stokGudang} />}
                          label="Stok Gudang"
                          onChange={() => setStokGudang(!stokGudang)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={koreksiStokGudang} />}
                          label="Koreksi Stok Gudang"
                          onChange={() =>
                            setKoreksiStokGudang(!koreksiStokGudang)
                          }
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={stokToko} />}
                          label="Stok Toko"
                          onChange={() => setStokToko(!stokToko)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={koreksiStokToko} />}
                          label="Koreksi Stok Toko"
                          onChange={() => setKoreksiStokToko(!koreksiStokToko)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={transferStok} />}
                          label="Transfer Stok"
                          onChange={() => setTransferStok(!transferStok)}
                        />
                      </FormGroup>
                    </Form>
                  </Col>
                  <Col>
                    <Typography variant="p" sx={[spacingTop]}>
                      Pembelian
                    </Typography>
                    <Form>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={pembelian} />}
                          label="Pembelian"
                          onChange={() => setPembelian(!pembelian)}
                        />
                      </FormGroup>
                    </Form>
                    <Typography variant="p" sx={[spacingTop]}>
                      Utility
                    </Typography>
                    <Form>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={profilUser} />}
                          label="Profil User"
                          onChange={() => setProfilUser(!profilUser)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={daftarUser} />}
                          label="Daftar User"
                          onChange={() => setDaftarUser(!daftarUser)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={settingAkses} />}
                          label="Setting Akses"
                          onChange={() => setSettingAkses(!settingAkses)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={gantiPeriode} />}
                          label="Ganti Periode"
                          onChange={() => setGantiPeriode(!gantiPeriode)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={tutupPeriode} />}
                          label="Tutup Periode"
                          onChange={() => setTutupPeriode(!tutupPeriode)}
                        />
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
              </Box>
            </Container>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/daftarUser")}
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

export default TambahUser;

const colorRed = {
  color: "red",
};

const showDataContainerCheck = {
  mt: 4,
  flexDirection: {
    xs: "column",
    sm: "row",
  },
};

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row",
  },
};

const showDataWrapper = {
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

const checkboxTitle = {
  marginBottom: 0,
};

const secondCheckboxTitle = {
  marginTop: 15,
  marginBottom: 0,
};
