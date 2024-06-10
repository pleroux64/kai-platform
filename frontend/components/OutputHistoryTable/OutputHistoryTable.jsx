import React, { useEffect, useState } from 'react'

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
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { collection, getDocs } from 'firebase/firestore'

import { db } from '../../firebase/firebase' // Correct path

import styles from './styles'

/**
 * Renders the OutputHistoryTable component.
 *
 * @return {ReactElement} The rendered OutputHistoryTable component.
 */
const OutputHistoryTable = () => {
  const [outputs, setOutputs] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('title')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'outputs'))
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setOutputs(data)
    }

    fetchData()
  }, [])

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredOutputs = outputs.filter((output) =>
    output.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const renderSearchInput = () => (
    <Grid
      item
      xs={12}
      sm={isMobile ? 6 : 12}
      md={4}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      <TextField
        variant="outlined"
        placeholder="Search outputs"
        onChange={handleSearchChange}
        {...styles.searchInputProps}
      />
    </Grid>
  )

  const renderTableHeader = () => (
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
  )

  const renderTableBody = () => (
    <TableBody>
      {filteredOutputs.map((output) => (
        <TableRow key={output.id}>
          <TableCell>{output.title}</TableCell>
          <TableCell>{output.type}</TableCell>
          <TableCell>{output.creationDate}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  )

  return (
    <Grid container spacing={2} {...styles.containerProps}>
      {renderSearchInput()}
      <Grid item xs={12} sm={isMobile ? 6 : 12} md={4}>
        <TableContainer component={Paper}>
          <Table>
            {renderTableHeader()}
            {renderTableBody()}
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default OutputHistoryTable
