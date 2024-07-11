import React from 'react';

import { Grid, Typography } from '@mui/material';

import styles from '../styles';

const FlashCards = ({ data }) => {
  const panelData = data?.response || [];

  return (
    <Grid {...styles.flashCardsGridProps}>
      {panelData?.map((item, index) => (
        <Grid key={index} {...styles.flashCardGridProps}>
          <Typography {...styles.conceptTitleProps}>{item?.concept}</Typography>
          <Typography {...styles.definitionProps}>
            {item?.definition}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default FlashCards;
