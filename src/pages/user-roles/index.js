import React, { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { REQUESTS_ENDPOINTS } from 'const/urls';
import axiosServices from 'utils/axios';
import { Box, Card } from '@mui/material';
import { motion } from 'framer-motion';

const MaintenanceDB = () => {
  const [data, setData] = useState([]);

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

  const maintenanceTable = useReactTable({
    data,
    columns: maintenanceColumns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Box sx={{ padding: 2 }}>
      <Card sx={{ overflowX: 'auto', maxWidth: '100%', marginTop: 2, justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {maintenanceTable.getHeaderGroups().map((headerGroup, i) => (
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
              {maintenanceTable.getRowModel().rows.map((row, i) => (
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
