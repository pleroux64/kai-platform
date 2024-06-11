import React, { useEffect, useState } from 'react'

import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Item,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'

import styles from './styles'

/**
 * Renders the OutputHistoryTable component.
 *
 * @return {ReactElement} The rendered OutputHistoryTable component.
 */
const OutputHistoryTable = () => {
  const [itemWeekCount, setWeekCount] = useState(0)
  const [itemMonthCount, setMonthCount] = useState(0)
  useEffect(() => {
    const weekCount = document.querySelectorAll('.week').length
    const monthCount = document.querySelectorAll('.month').length

    setWeekCount(weekCount)
    setMonthCount(monthCount)
  }, [])
  return (
    <>
      <Grid container direction="column">
        <Typography {...styles.outputHistory}>Output History</Typography>
        <Typography {...styles.thisWeek}>
          This Week ({itemWeekCount})
        </Typography>
        <Divider {...styles.divider} />
      </Grid>
      {/* This is the top up to the divider */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} className="week">
          <Card {...styles.card}>
            <CardMedia
              {...styles.cardMedia}
              component="img"
              image="https://tse3.mm.bing.net/th?id=OIP.gc6m_EejGd5q1JwA7aMJ5AHaFL&pid=Api&P=0&h=220"
              alt="Live from space album cover"
            />
            {/* This is the end of the card Media */}
            <Box {...styles.box}>
              <CardContent {...styles.cardContent}>
                <Chip label="04/25/24" {...styles.dateChip} />
                <Typography {...styles.cardHeaders}>
                  Questions from Youtube - Javascript basics
                </Typography>
                <Typography {...styles.cardDescriptions}>
                  Questions taken from Intro to Javascript video on Youtube.
                </Typography>
                <Button {...styles.previewButton}>Preview</Button>
              </CardContent>
            </Box>
          </Card>
          {/* This is the end of the first card */}
        </Grid>
        {/* This is the end of the first grid */}
        <Grid item xs={12} sm={6} className="week">
          <Card {...styles.card}>
            <CardMedia
              component="img"
              sx={{ width: 151 }}
              image="https://tse3.mm.bing.net/th?id=OIP.gc6m_EejGd5q1JwA7aMJ5AHaFL&pid=Api&P=0&h=220"
              alt="Live from space album cover"
            />
            {/* This is the end of the card Media */}
            <Box {...styles.box}>
              <CardContent {...styles.cardContent}>
                <Chip label="04/25/24" {...styles.dateChip} />
                <Typography {...styles.cardHeaders}>
                  Questions from Youtube - Javascript basics
                </Typography>
                <Typography {...styles.cardDescriptions}>
                  Questions taken from Intro to Javascript video on Youtube.
                </Typography>
                <Button {...styles.previewButton}>Preview</Button>
              </CardContent>
            </Box>
          </Card>
          {/* This is the end of the first card */}
        </Grid>
        {/* This is the end of the first grid */}
        <Grid item xs={12} sm={6} className="week">
          <Card {...styles.card}>
            <CardMedia
              {...styles.cardMedia}
              component={FormatListNumberedIcon} // Render the icon component directly
            />
            <Box {...styles.box}>
              <CardContent {...styles.cardContent}>
                <Chip label="04/25/24" {...styles.dateChip} />
                <Typography {...styles.cardHeaders}>
                  Multiple Choice Assessment CSS - Styling
                </Typography>
                <Typography {...styles.cardDescriptions}>
                  Questions taken from Intro to Javascript video on Youtube.
                </Typography>
                <Button {...styles.previewButton}>Preview</Button>
              </CardContent>
            </Box>
          </Card>
          {/* This is the end of the first card */}
        </Grid>
        {/* This is the end of the first card */}
      </Grid>
      {/* This is the start of the this month section */}
      <Grid container direction="column">
        <Typography {...styles.thisWeek}>
          This Month ({itemMonthCount})
        </Typography>
        <Divider {...styles.divider} />
      </Grid>
      <Grid item xs={12} sm={6} className="month">
        <Card {...styles.card}>
          <CardMedia
            {...styles.cardMedia}
            component="img"
            image="https://tse3.mm.bing.net/th?id=OIP.gc6m_EejGd5q1JwA7aMJ5AHaFL&pid=Api&P=0&h=220"
            alt="Live from space album cover"
          />
          <Box {...styles.box}>
            <CardContent {...styles.cardContent}>
              <Chip label="04/26/24" {...styles.validDateChip} />
              <Typography {...styles.cardHeaders}>
                Questions from Youtube - Javascript basics
              </Typography>
              <Typography {...styles.cardDescriptions}>
                Questions taken from Intro to Javascript video on Youtube.
              </Typography>
              <Button {...styles.previewButton}>Preview</Button>
            </CardContent>
          </Box>
        </Card>
      </Grid>
    </>
  )
}

export default OutputHistoryTable
