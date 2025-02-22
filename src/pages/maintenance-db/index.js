import React, { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import Papa from 'papaparse';
import { REQUESTS_ENDPOINTS } from 'const/urls';
import axiosServices from 'utils/axios';
import { Button, Grid, Tabs, Tab, Box, Card } from '@mui/material';
import { motion } from 'framer-motion';
import { exportToExcel, importFromExcel } from 'utils/exportXslx';

const MaintenanceDB = () => {
  const [data, setData] = useState([]);
  const [externalReports, setExternalReports] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosServices.get(REQUESTS_ENDPOINTS.ALL_REQUESTS);
        setData(data);
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
    { accessorKey: 'requestNumber', header: 'N° Solicitud' },
    { accessorKey: 'userID', header: 'ID Usuario' },
    { accessorKey: 'applicantName', header: 'Nombre de Solicitante' },
    { accessorKey: 'applicantRole', header: 'Cargo' },
    { accessorKey: 'applicantArea', header: 'Área' },
    { accessorKey: 'requestDate', header: 'Fecha de Solicitud' },
    { accessorKey: 'requestType', header: 'Tipo de Solicitud' },
    { accessorKey: 'lastUpdateDate', header: 'Fecha de Actualización' },
    { accessorKey: 'description', header: 'Descripción' },
    { accessorKey: 'equipmentArea', header: 'Área / Equipo' },
    { accessorKey: 'brand', header: 'Marca' },
    { accessorKey: 'location', header: 'Ubicación' },
    { accessorKey: 'serialNumber', header: 'Número' },
    { accessorKey: 'assignedTo', header: 'Asignado a' },
    { accessorKey: 'reason', header: 'Razón' },
    { accessorKey: 'managerObservations', header: 'Observación del Jefe de Mantención' },
    { accessorKey: 'isClean', header: 'Limpieza y Orden' },
    { accessorKey: 'receptionDate', header: 'Fecha de Recepción' },
    { accessorKey: 'cleaningObservations', header: 'Observación de Recepción' }
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
    const csv = Papa.unparse(tableData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();

    exportToExcel(tableData, tableData);
    importFromExcel();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container justifyContent="flex-end" columnGap={2} paddingY={2}>
        <Button
          variant="contained"
          color="info"
          onClick={() => exportCSV(tabIndex === 0 ? data : externalReports, tabIndex === 0 ? 'solicitud_mantencion' : 'reportes_externos')}
        >
          Exportar CSV
        </Button>
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
