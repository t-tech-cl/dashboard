import React, { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import Papa from 'papaparse';
import { REQUESTS_ENDPOINTS } from 'const/urls';
import axiosServices from 'utils/axios';
import { Button, Grid, Tabs, Tab, Box, Card, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
// Import ExcelJS instead of XLSX
import ExcelJS from 'exceljs';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import { InfoCircleOutlined, LockOutlined } from '@ant-design/icons';

const MaintenanceDB = () => {
  const [data, setData] = useState([]);
  const [externalReports, setExternalReports] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [templateLoading, setTemplateLoading] = useState(false);
  const { user } = useAuth();
  
  // Check if user has edit permissions (Admin or Manager)
  const hasEditPermission = user && (user.role === 'Admin' || user.role === 'Manager');

  useEffect(() => {
    (async () => {
      const statusValue = {
        finished_delayed: 'Concluido atrasado',
        finished: 'Concluido',
        finished_upfront: 'Concluido adelantado',
        delayed: 'Atrasado',
        ongoing: 'En desarrollo'
      };

      try {
        const { data } = await axiosServices.get(REQUESTS_ENDPOINTS.ALL_REQUESTS);
        const formattedData = data.map((item) => ({
          ...item,
          status: statusValue[item.status],
          requestDate: moment(item.requestDate).format('DD-MM-YYYY'),
          receptionDate: item.receptionDate ? moment(item.receptionDate).format('DD-MM-YYYY') : '',
          lastUpdateDate: moment(item.lastUpdateDate).format('DD-MM-YYYY')
        }));
        setData(formattedData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosServices.get(REQUESTS_ENDPOINTS.EXTERNAL_REPORTS);
        setExternalReports(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const maintenanceColumns = [
    { accessorKey: 'requestID', header: 'ID' },
    { accessorKey: 'applicantName', header: 'Nombre de Solicitante' },
    { accessorKey: 'description', header: 'Descripción' },
    { accessorKey: 'applicantArea', header: 'Área' },
    { accessorKey: 'status', header: 'Estatus' },
    { accessorKey: 'assignedTo', header: 'Asignado a' },
    { accessorKey: 'requestDate', header: 'Fecha de Solicitud' },
    { accessorKey: 'lastUpdateDate', header: 'Fecha de Actualización' },
    { accessorKey: '', header: 'Fecha de Término' },
    { accessorKey: 'receptionDate', header: 'Fecha de Término Real' }
  ];

  const externalReportColumns = [
    { accessorKey: 'reportID', header: 'ID de Reporte' },
    { accessorKey: 'requestID', header: 'ID de Solicitud' },
    { accessorKey: 'reportDate', header: 'Fecha de Reporte' },
    { accessorKey: 'documentNumber', header: 'N° de Documento' },
    { accessorKey: 'documentType', header: 'Tipo de Documento' },
    { accessorKey: 'assignedTo', header: 'Asignado a' }
  ];

  const maintenanceTable = useReactTable({
    data,
    columns: maintenanceColumns,
    getCoreRowModel: getCoreRowModel()
  });

  const externalTable = useReactTable({
    data: externalReports,
    columns: externalReportColumns,
    getCoreRowModel: getCoreRowModel()
  });

  const exportCSV = (tableData, fileName) => {
    const csv = Papa.unparse(tableData, { delimiter: ',' }); // Ensure ',' is used as separator
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up the URL object
  };

  const exportWithTemplate = async () => {
    try {
      setTemplateLoading(true);

      // Define the path to the template in public folder
      const templatePath = tabIndex === 0 ? '/template/solicitud_mantencion_template.xlsx' : '/templates/reportes_externos_template.xlsx';

      // Fetch the template file
      const response = await fetch(templatePath);
      const templateArrayBuffer = await response.arrayBuffer();

      // Create a new workbook and load the template with full image support
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(templateArrayBuffer);

      // Get the first worksheet
      const worksheet = workbook.worksheets[0];

      worksheet.getCell('C1').value = worksheet.getCell('C1').value.replace('{year}', moment().format('YYYY'));
      worksheet.getCell('K1').value = worksheet.getCell('K1').value.replace('{date}', moment().format('DD-MM-YYYY'));
      worksheet.getCell('K1').value = worksheet.getCell('K1').value.replace('{date}', moment().format('DD-MM-YYYY'));

      // Store the original images and their positions
      const originalImages = worksheet.getImages();
      console.log('Original images in template:', originalImages);

      // Current data to export
      const currentData = tabIndex === 0 ? data : externalReports;

      // Start filling data from cell A4 (ExcelJS uses 1-based indexing)
      const startRow = 3;

      // Get columns based on the current tab
      const columns = tabIndex === 0 ? maintenanceColumns : externalReportColumns;

      // Fill the data into the worksheet
      currentData.forEach((row, rowIndex) => {
        // Only modify a limited number of rows to avoid affecting image positioning
        if (rowIndex < 20) {
          // Adjust this limit based on your template design
          columns.forEach((column, colIndex) => {
            const cellRow = startRow + rowIndex;
            const cellCol = colIndex + 1;

            try {
              const cell = worksheet.getCell(cellRow, cellCol);
              const cellValue = row[column.accessorKey];

              // Only update cells if they don't have formulas
              if (!cell.formula && !cell.sharedFormula) {
                if (cellValue !== undefined && cellValue !== null) {
                  // Use text values to avoid formatting issues
                  cell.value = String(cellValue);
                } else {
                  cell.value = '';
                }
              }
            } catch (cellError) {
              console.warn(`Skipping cell at ${cellRow},${cellCol} due to error:`, cellError);
            }
          });
        }
      });

      // Check if images still exist after data filling
      const remainingImages = worksheet.getImages();
      console.log('Images after data filling:', remainingImages);

      // If images were lost, re-add them
      if (originalImages.length > 0 && remainingImages.length === 0) {
        console.log('Re-adding lost images...');

        // For each original image, add it back to the worksheet
        for (const img of originalImages) {
          try {
            // The image data is stored in the media property of the workbook
            const imageId = img.imageId;
            const imageData = workbook.media.find((m) => m.index === imageId);

            if (imageData) {
              // Re-add the image at its original position
              worksheet.addImage({
                imageId: imageId,
                tl: { col: img.range.tl.col, row: img.range.tl.row },
                br: { col: img.range.br.col, row: img.range.br.row },
                editAs: img.editAs || 'oneCell'
              });
            }
          } catch (imgError) {
            console.error('Error re-adding image:', imgError);
          }
        }
      }

      // Generate the file name
      const fileName = tabIndex === 0 ? 'solicitud_mantencion' : 'reportes_externos';

      // Use options to preserve images and formatting
      const options = {
        filename: `${fileName}.xlsx`,
        useStyles: true,
        useSharedStrings: true,
        bookImages: true
      };

      // Write to buffer with options
      const buffer = await workbook.xlsx.writeBuffer(options);

      // Create a blob and download
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}_filled.xlsx`;
      link.click();
      URL.revokeObjectURL(url);

      console.log('Excel export completed successfully with image preservation');
    } catch (error) {
      console.error('Error exporting with template:', error);
      alert('Error al exportar con la plantilla: ' + error.message);
    } finally {
      setTemplateLoading(false);
    }
  };

  const statusItems = {
    'En desarrollo': '#0070c0',
    Concluido: '#91d050',
    'Concluido adelantado': '#bfbfbf',
    'Concluido atrasado': '#ffc000',
    Atrasado: '#ff0100'
  };

  return (
    <Box sx={{ padding: 2 }}>
      {!hasEditPermission && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            <Grid item>
              <LockOutlined style={{ fontSize: '1.5rem', color: 'info.main' }} />
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'info.dark' }}>
                Modo solo lectura
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Como usuario con rol {user?.role}, solo tienes acceso de lectura a esta información.
              </Typography>
            </Grid>
          </Grid>
        </motion.div>
      )}
      
      <Grid container justifyContent="space-between" alignItems="center" paddingY={2}>
        <Grid item>
          <Typography variant="h3" component="h1">
            Base de datos de mantenimiento
            {!hasEditPermission && (
              <Chip
                icon={<InfoCircleOutlined />}
                label="Solo lectura"
                size="small"
                color="info"
                sx={{ ml: 1, verticalAlign: 'middle' }}
              />
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            {hasEditPermission && tabIndex === 0 && (
              <Grid item>
                <Button variant="contained" color="primary" onClick={exportWithTemplate} disabled={templateLoading}>
                  {templateLoading ? 'Exportando...' : 'Exportar con Plantilla'}
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                variant="contained"
                color="info"
                onClick={() => exportCSV(tabIndex === 0 ? data : externalReports, tabIndex === 0 ? 'solicitud_mantencion' : 'reportes_externos')}
              >
                Exportar CSV
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Card sx={{ overflowX: 'auto', maxWidth: '100%', marginTop: 2, justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} sx={{ justifySelf: 'center', width: '100%' }}>
          <Tab label="Solicitudes de Mantención" sx={{ fontWeight: 'bold', flex: 1, maxWidth: 'unset' }} />
          <Tab label="Reportes Externos" sx={{ fontWeight: 'bold', flex: 1, maxWidth: 'unset' }} />
        </Tabs>
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {(tabIndex === 0 ? maintenanceTable : externalTable).getHeaderGroups().map((headerGroup, i) => (
                <motion.tr
                  key={i}
                  initial={{ x: i % 2 ? 50 : -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left', minWidth: '120px' }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </motion.tr>
              ))}
            </thead>
            <tbody>
              {(tabIndex === 0 ? maintenanceTable : externalTable).getRowModel().rows.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ x: i % 2 ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        ...(cell.id.includes('status') && {
                          color: 'black',
                          fontWeight: 'semibold',
                          backgroundColor: statusItems[cell.getValue()]
                        }),
                        border: '1px solid #fff',
                        padding: '8px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        maxWidth: '120px'
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Box>
  );
};

export default MaintenanceDB;
