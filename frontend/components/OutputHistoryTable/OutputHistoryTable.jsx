// frontend/components/OutputHistoryTable/OutputHistoryTable.jsx
import React, { useState } from 'react';

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  useMediaQuery,
} from '@mui/material';

const sampleData = [
  { id: 1, title: 'Document 1', type: 'PDF', creationDate: '2024-06-01' },
  {
    id: 2,
    title: 'Presentation',
    type: 'PowerPoint',
    creationDate: '2024-06-02',
  },
  { id: 3, title: 'Spreadsheet', type: 'Excel', creationDate: '2024-06-03' },
  { id: 4, title: 'Image', type: 'JPEG', creationDate: '2024-06-04' },
  { id: 5, title: 'Video', type: 'MP4', creationDate: '2024-06-05' },
  { id: 6, title: 'Audio', type: 'MP3', creationDate: '2024-06-06' },
];

const OutputHistoryTable = ({ data = sampleData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle sorting
  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filter data based on search query
  const filteredData = data
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (orderBy === 'creationDate') {
        return order === 'asc'
          ? new Date(a[orderBy]) - new Date(b[orderBy])
          : new Date(b[orderBy]) - new Date(a[orderBy]);
      }
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          variant="outlined"
          placeholder="Search outputs"
          onChange={handleSearchChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleSortRequest('title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'type'}
                    direction={orderBy === 'type' ? order : 'asc'}
                    onClick={() => handleSortRequest('type')}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'creationDate'}
                    direction={orderBy === 'creationDate' ? order : 'asc'}
                    onClick={() => handleSortRequest('creationDate')}
                  >
                    Creation Date
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.creationDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default OutputHistoryTable;
