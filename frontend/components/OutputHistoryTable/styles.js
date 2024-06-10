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
}

export default styles
