const styles = {
  containerProps: {
    sx: {
      marginTop: 2,
    },
  },
  searchInputProps: {
    fullWidth: true,
    sx: {
      margin: '16px 0',
    },
  },
  tableContainerProps: {
    sx: {
      marginTop: 2,
    },
  },
  tableProps: {
    sx: {
      minWidth: 650,
    },
  },
  tableHeadProps: {
    sx: {
      backgroundColor: (theme) => theme.palette.primary.light,
    },
  },
  tableCellProps: {
    sx: {
      fontWeight: 'bold',
    },
  },
  outputHistory: {
    sx: {
      textAlign: 'start',
      fontWeight: 'bold',
      fontSize: '40px',
      alignContent: 'start',
    },
  },
  thisWeek: {
    sx: {
      textAlign: 'start',
      color: 'gray',
      fontSize: '20px',
      marginTop: '1%',
    },
  },
  divider: {
    sx: {
      borderBottomWidth: 2,
      backgroundColor: 'gray',
      marginTop: '1%',
    },
  },
  card: {
    sx: {
      display: 'flex',
      backgroundColor: 'white',
      color: 'black',
      textAlign: 'center',
      elevation: '2',
    },
  },
  box: {
    sx: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  cardContent: {
    sx: {
      flex: '1 0 auto',
    },
  },
  cardMedia: {
    sx: {
      width: 151,
      borderColor: 'black',
      alignItems: 'center',
    },
  },
  cardHeaders: {
    sx: {
      color: 'black',
      fontWeight: '900',
      textAlign: 'center',
      fontSize: 'large',
    },
  },
  cardDescriptions: {
    sx: {
      textAlign: 'start',
      color: 'black',
      marginTop: '5px',
    },
  },
  dateChip: {
    sx: {
      color: '#FF1414',
      backgroundColor: '#FFC7C7',
      marginBottom: '2%',
      marginRight: '100%',
    },
  },
  validDateChip: {
    sx: {
      color: '#00B312',
      backgroundColor: '#80FF8C',
      marginBottom: '2%',
      marginRight: '100%',
    },
  },
  previewButton: {
    sx: {
      backgroundColor: '#780080',
      color: 'white',
      borderRadius: '20px',
      width: '100px',
      marginTop: '3%',
      marginRight: '100%',
    },
  },
}

export default styles
