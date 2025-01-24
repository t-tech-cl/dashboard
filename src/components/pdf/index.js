import { Grid } from '@mui/material';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  },
  table: {
    width: '100%',
    border: '1px solid #000'
  },
  tr: {
    border: '1px solid #000',
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    flex: 1,
    color: '#000'
  }
});

const PDFFile = () => {
  return (
    <Document style={{ backgroundColor: 'white' }}>
      <Page size="A4" wrap>
        <View style={styles.section}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tr}>
                <th
                  scope="col"
                  style={{
                    display: 'flex',
                    flex: 1,
                    border: '1px solid #000',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  Image
                </th>
                <th
                  scope="col"
                  style={{
                    display: 'flex',
                    flex: 1,
                    border: '1px solid #000',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  Solicitud de Mantención
                </th>
                <th scope="col" style={{ display: 'flex', flex: 1, border: '1px solid #000', textAlign: 'justify' }}>
                  Código: R-POE-06-03
                  <br />
                  Versión: 01
                  <br />
                  Fecha Mod: 28-05-2024
                </th>
              </tr>
              <tr style={styles.tr}>
                <Grid
                  container
                  flexDirection="column"
                  style={{
                    display: 'flex',
                    flex: 1,
                    border: '1px solid #000',
                    textAlign: 'flex-start'
                  }}
                >
                  <th scope="col">Elaborado por:</th>
                  <th scope="col">Test</th>
                </Grid>
                <Grid
                  container
                  flexDirection="column"
                  style={{
                    display: 'flex',
                    flex: 1,
                    border: '1px solid #000',
                    textAlign: 'flex-start'
                  }}
                >
                  <th scope="col">Revisado por:</th>
                  <th scope="col">Test</th>
                </Grid>
                <Grid
                  container
                  flexDirection="column"
                  style={{
                    display: 'flex',
                    flex: 1,
                    border: '1px solid #000',
                    textAlign: 'flex-start'
                  }}
                >
                  <th scope="col">Aprobado por:</th>
                  <th scope="col">Test</th>
                </Grid>
              </tr>
              <tr style={{ flex: 1, width: '100%' }}>
                <th style={{ color: '#000' }}>IDENTIFICACIÓN DEL SOLICITANTE</th>
              </tr>
              <tr style={styles.tr}>
                <td>N° SOLICITUD</td>
                <td></td>
                <td></td>
              </tr>
              <tr style={styles.tr}>
                <td>NOMBRE</td>
                <td></td>
                <td></td>
              </tr>
              <tr style={styles.tr}>
                <td>CARGO</td>
                <td></td>
                <td></td>
              </tr>
              <tr style={styles.tr}>
                <td>ÁREA</td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody></tbody>
          </table>

          <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </View>
      </Page>
    </Document>
  );
};

export default PDFFile;
