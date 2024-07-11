const styles = {
  submitButtonProps: {
    color: 'purple4',
    inverted: true,
    extraProps: {
      padding: '2px',
      height: { laptop: '54px', desktopMedium: '60px' },
      width: '60%',
    },
    extraButtonProps: {
      fontFamily: 'Satoshi Bold',
      fontSize: '16px',
      px: 4,
    },
  },
  formGridProps: {
    item: true,
    width: '100%',
    flexDirection: 'column',
  },
  errorGridProps: {
    item: true,
    display: 'flex',
    alignItems: 'center',
  },
  errorIconProps: (field) => ({
    sx: {
      color: '#F44336',
      width: '16px',
      height: '16px',
      margin: 1,
      marginLeft: 2,
      visibility: !field.valid && field.value ? 'visible' : 'hidden',
    },
  }),
  errorTypographyProps: (field) => ({
    color: '#F44336',
    visibility: !field.valid && field.value ? 'visible' : 'hidden',
  }),
}

export default styles
