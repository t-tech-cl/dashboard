import { Grid } from '@mui/material';
import styles from './style';
import logo from 'assets/images/logo-main.png';
import moment from 'moment';

const PdfDocument = ({ request, pdfRef }) => {
  return (
    <div style={{ backgroundColor: 'white', width: '100%' }} ref={pdfRef}>
      <div style={styles.section}>
        <div style={styles.table}>
          <div>
            <div style={styles.tr}>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  border: '1px solid #000',
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 20,
                  paddingBottom: 20
                }}
              >
                <img alt="logo" src={logo} style={{ height: 100, width: 200 }} />
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  border: '1px solid #000',
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold'
                }}
              >
                SOLICITUD DE MANTENCIÓN
              </div>
              <div style={{ display: 'flex', flex: 1, border: '1px solid #000', textAlign: 'justify', alignItems: 'center' }}>
                <div style={{ paddingLeft: 20 }}>
                  <span>
                    <span style={{ fontWeight: 'bold' }}>Código:</span> <span>R-POE-06-03</span>
                  </span>
                  <br />
                  <span>
                    <span style={{ fontWeight: 'bold' }}>Versión:</span> 01
                  </span>
                  <br />
                  <span>
                    <span style={{ fontWeight: 'bold' }}>Fecha Elab:</span> {moment(request.requestDate).format('DD-MM-YYYY')}
                  </span>
                  <br />
                  <span>
                    <span style={{ fontWeight: 'bold' }}>Fecha Mod:</span> {moment(request.lastUpdateDate).format('DD-MM-YYYY')}
                  </span>
                </div>
              </div>
            </div>
            <tr style={styles.tr}>
              <Grid
                container
                flexDirection="column"
                style={{
                  display: 'flex',
                  flex: 1,
                  border: '1px solid #000',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontWeight: 'bold' }}>Elaborado por:</span>
                <span
                  placeholder="..."
                  style={{ border: 'none', textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  Jefe de Calidad y SGC
                </span>
              </Grid>
              <Grid
                container
                flexDirection="column"
                style={{
                  display: 'flex',
                  flex: 1,
                  border: '1px solid #000',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontWeight: 'bold' }}>Revisado por:</span>
                <span
                  placeholder="..."
                  style={{ border: 'none', textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  Jefe de Mantención
                </span>
              </Grid>
              <Grid
                container
                flexDirection="column"
                style={{
                  display: 'flex',
                  flex: 1,
                  border: '1px solid #000',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontWeight: 'bold' }}>Aprobado por:</span>
                <span
                  placeholder="..."
                  style={{ border: 'none', textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  Jefe de Planta
                </span>
              </Grid>
            </tr>
          </div>
          <tbody>
            <tr style={{ flex: 1, width: '100%' }}>
              <div style={{ color: '#000', border: '1px solid #000', borderCollapse: 'collapse', textAlign: 'center', fontWeight: 'bold' }}>
                IDENTIFICACIÓN DEL SOLICITANTE
              </div>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, paddingRight: 0.5 }}>
                <span style={styles.title}>N° SOLICITUD</span>
              </td>
              <td style={styles.tdCenter}>{request.requestNumber}</td>
              <td style={styles.tdTitle}>
                <span style={(styles.title, { textAlign: 'center', width: '100%', borderBottom: 2 })}>FIRMA</span>
              </td>
            </tr>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 2 }}>
                <tr style={styles.tr}>
                  <td style={styles.tdTitle}>
                    <span style={styles.title}>NOMBRE</span>
                  </td>
                  <td style={styles.tdCenter}>{request.applicantName}</td>
                </tr>
                <tr style={styles.tr}>
                  <td style={styles.tdTitle}>
                    <span style={styles.title}>CARGO</span>
                  </td>
                  <td style={styles.tdCenter}>{request.applicantRole}</td>
                </tr>
                <tr style={styles.tr}>
                  <td style={styles.tdTitle}>
                    <span style={styles.title}>ÁREA</span>
                  </td>
                  <td style={styles.tdCenter}>{request.applicantArea}</td>
                </tr>
              </div>
              <div style={{ ...styles.td, flex: 1, border: '1px solid #000', borderCollapse: 'collapse' }} />
            </div>
            <tr style={{ flex: 1, width: '100%' }}>
              <div style={{ color: '#000', border: '1px solid #000', borderCollapse: 'collapse', textAlign: 'center', fontWeight: 'bold' }}>
                IDENTIFICACIÓN DE LA SOLICITUD
              </div>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, paddingRight: -0.5 }}>
                <span style={styles.title}>FECHA SOLICITUD</span>
              </td>
              <td style={styles.tdCenter}>{moment(request.requestDate).format('DD-MM-YYYY')}</td>
              <td style={{ ...styles.td, border: '1px solid #000', borderCollapse: 'collapse' }}></td>
            </tr>

            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, padding: 0, paddingRight: 1 }}>
                <span style={styles.title}>TIPO DE SOLICITUD</span>
              </td>
              <td style={{ ...styles.tdCenter, columnGap: 20, display: 'flex', justifyContent: 'center', flex: 2 }}>
                {['Preventiva', 'Correctiva', 'Instalaciones'].map((item, i) => (
                  <label key={i} style={{ alignItems: 'center', display: 'flex', columnGap: 5 }}>
                    <input type="checkbox" checked={request.requestType === item} disabled />
                    <span>{item}</span>
                  </label>
                ))}
              </td>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, padding: 0, paddingRight: 3 }}>
                <span style={styles.title}>DESCRIPCIÓN</span>
              </td>
              <td style={{ ...styles.tdCenter, paddingRight: 2 }}>{request.description}</td>
              <td
                style={{
                  ...styles.td,
                  padding: 0,
                  flex: 1,
                  border: '1px solid #000',
                  borderCollapse: 'collapse'
                }}
              ></td>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, padding: 0 }}>
                <span style={styles.title}>EQUIPO/ÁREA</span>
              </td>
              <td style={styles.tdCenter}>{request.equipmentArea}</td>
              <td style={{ flex: 1, flexDirection: 'row', display: 'flex', padding: 0 }}>
                <td style={{ ...styles.tdTitle, justifyContent: 'center' }}>
                  <span style={styles.title}>MARCA</span>
                </td>
                <td style={{ ...styles.tdCenter, justifyContent: 'center' }}>{request.brand}</td>
              </td>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, padding: 0, paddingRight: 1 }}>
                <span style={styles.title}>UBICACIÓN</span>
              </td>
              <td style={styles.tdCenter}>{request.location}</td>
              <td style={{ flex: 1, flexDirection: 'row', display: 'flex', padding: 0 }}>
                <td style={{ ...styles.tdTitle, justifyContent: 'center' }}>
                  <span style={styles.title}>NÚMERO</span>
                </td>
                <td style={styles.tdCenter}>{request.serialNumber}</td>
              </td>
            </tr>
            <tr style={{ flex: 1, width: '100%' }}>
              <div style={{ color: '#000', border: '1px solid #000', borderCollapse: 'collapse', textAlign: 'center', fontWeight: 'bold' }}>
                EVALUACIÓN JEFE DE MANTENCIÓN
              </div>
            </tr>
            <tr style={styles.tr}>
              <td style={styles.tdTitle}>
                <span style={styles.title}>DERIVA A</span>
              </td>
              <td style={styles.tdCenter}>{request.assignedTo}</td>
              <td style={{ ...styles.td, color: '#000', border: '1px solid #000', borderCollapse: 'collapse' }}></td>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, alignItems: 'center' }}>
                <span style={styles.title}>MOTIVO</span>
              </td>
              <td
                style={{
                  flex: 2,
                  border: '1px solid #000',
                  borderCollapse: 'collapse'
                }}
              >
                <textarea
                  disabled
                  rows={2}
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 10,
                    fontFamily: 'Helvetica',
                    fontSize: 'inherit',
                    width: '100%',
                    resize: 'none',
                    border: 'none'
                  }}
                  value={request.reason}
                />
              </td>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, alignItems: 'center' }}>
                <span style={styles.title}>OBSERVACIONES</span>
              </td>
              <td style={{ ...styles.tdCenter, flex: 2 }}>
                <textarea
                  disabled
                  rows={2}
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 10,
                    fontFamily: 'Helvetica',
                    fontSize: 'inherit',
                    width: '100%',
                    resize: 'none',
                    border: 'none'
                  }}
                  value={request.managerObservations}
                />
              </td>
            </tr>
            <tr style={{ flex: 1, width: '100%' }}>
              <div style={{ color: '#000', border: '1px solid #000', borderCollapse: 'collapse', textAlign: 'center', fontWeight: 'bold' }}>
                REPORTE EMPRESA EXTERNA
              </div>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, paddingRight: 3 }}>
                <span style={styles.title}>FECHA</span>
              </td>
              <td style={styles.tdCenter}>{moment(request.externalReport.reportDate).format('DD-MM-YYYY')}</td>
              <td style={{ ...styles.tdTitle, justifyContent: 'center' }}>
                <span style={styles.title}>DESCRIPCIÓN</span>
              </td>
            </tr>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
              <tr style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                <tr style={styles.tr}>
                  <td style={{ ...styles.tdTitle, paddingRight: 3 }}>
                    <span style={styles.title}>TIPO DOCUMENTO</span>
                  </td>
                  <td style={styles.tdCenter}>{request.externalReport.documentType}</td>
                </tr>
                <tr style={styles.tr}>
                  <td style={{ ...styles.tdTitle, paddingRight: 3 }}>
                    <span style={styles.title}>N° DOCUMENTO</span>
                  </td>
                  <td style={{ ...styles.tdCenter }}>{request.externalReport.documentNumber}</td>
                </tr>
              </tr>
              <tr style={{ flex: 1, display: 'flex' }}>
                <td style={styles.tdCenter}>
                  <span style={{ color: 'black' }}>{request.externalReport.description}</span>
                </td>
              </tr>
            </div>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, paddingTop: 1, alignItems: 'center' }}>
                <span style={styles.title}>OBSERVACIONES</span>
              </td>
              <td style={{ ...styles.tdCenter, flex: 2, padding: 0 }}>
                <textarea
                  disabled
                  rows={2}
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 10,
                    fontFamily: 'Helvetica',
                    fontSize: 'inherit',
                    width: '100%',
                    resize: 'none',
                    border: 'none'
                  }}
                  value={request.externalReport.observations}
                />
              </td>
            </tr>

            <tr style={{ flex: 1, width: '100%' }}>
              <div style={{ color: '#000', border: '1px solid #000', borderCollapse: 'collapse', textAlign: 'center', fontWeight: 'bold' }}>
                IDENTIFICACIÓN DE RECEPCIÓN
              </div>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, flex: 1 }}>
                <span style={styles.title}>FECHA</span>
              </td>
              <td style={{ ...styles.tdCenter, flex: 2 }}>{moment(request.receptionDate).format('DD-MM-YYYY')}</td>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, flex: 1 }}>
                <span style={styles.title}>LIMPIEZA Y ORDEN</span>
              </td>
              <td style={{ ...styles.tdCenter, columnGap: 20, display: 'flex', justifyContent: 'center', flex: 2 }}>
                {[
                  { label: 'Sí', value: true },
                  { label: 'No', value: false }
                ].map((item, i) => (
                  <label key={i} style={{ alignItems: 'center', display: 'flex', columnGap: 5 }}>
                    <input type="checkbox" checked={item.value === request.isClean} disabled />
                    <span>{item.label}</span>
                  </label>
                ))}
              </td>
            </tr>
            <tr style={styles.tr}>
              <td style={{ ...styles.tdTitle, paddingTop: 1, alignItems: 'center' }}>
                <span style={styles.title}>OBSERVACIONES</span>
              </td>
              <td style={{ ...styles.tdCenter, flex: 2, padding: 0 }}>
                <textarea
                  disabled
                  rows={2}
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 10,
                    fontFamily: 'Helvetica',
                    fontSize: 'inherit',
                    width: '100%',
                    resize: 'none',
                    border: 'none'
                  }}
                  value={request.cleaningObservations}
                />
              </td>
            </tr>
            <tr style={{ flex: 1, width: '100%' }}>
              <div
                style={{
                  color: '#000',
                  border: '1px solid #000',
                  borderCollapse: 'collapse',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: 0
                }}
              >
                RECEPCIÓN CONFORME NOMBRE/FIRMA
              </div>
            </tr>
            <tr
              style={{
                color: '#000',
                border: '1px solid #000',
                borderCollapse: 'collapse'
              }}
            >
              <td style={{ ...styles.tdCenter, flex: 2, paddingLeft: 20, paddingRight: 20, paddingTop: 10 }}>
                <textarea
                  disabled
                  rows={3}
                  style={{
                    fontFamily: 'Helvetica',
                    fontSize: 'inherit',
                    width: '100%',
                    resize: 'none',
                    border: 'none'
                  }}
                />
              </td>
            </tr>
          </tbody>
        </div>
      </div>
    </div>
  );
};

export default PdfDocument;
