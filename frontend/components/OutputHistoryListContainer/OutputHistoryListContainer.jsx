import React, { useState } from 'react';

import { Grid, Typography } from '@mui/material';

import OutputHistoryCard from '../OutputHistoryCard';
import SlidePanel from '../SlidePanel/SlidePanel';

import styles from './styles';

const OutputHistoryListContainer = ({ data, loading }) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState(null);

  if (loading) return <Typography>Loading...</Typography>;
  if (!data) return <Typography>No data available</Typography>;

  const handleOpenSidebar = (cardData) => {
    setSelectedCardData(cardData);
    setIsSidePanelOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidePanelOpen(false);
  };

  const renderSection = ({ text, size }) => (
    <Grid {...styles.headerGridProps}>
      <Typography {...styles.categoryTitleProps}>
        {text} ({size})
      </Typography>
    </Grid>
  );

  const renderCards = ({ category }) => (
    <Grid {...styles.containerGridProps}>
      <Grid {...styles.innerListGridProps}>
        {data?.[category].map((item) => (
          <OutputHistoryCard
            key={item.id}
            {...item}
            onOpen={handleOpenSidebar}
          />
        ))}
      </Grid>
    </Grid>
  );

  return (
    <>
      <Grid {...styles.mainGridProps}>
        <Typography {...styles.titleProps}>History</Typography>
        {renderSection({
          text: 'This Week',
          size: data?.Week?.length,
        })}
        {renderCards({ category: 'Week' })}
        {renderSection({
          text: 'This Month',
          size: data?.Month?.length,
        })}
        {renderCards({ category: 'Month' })}
        {renderSection({
          text: 'This Year',
          size: data?.Year?.length,
        })}
        {renderCards({ category: 'Year' })}
        {renderSection({ text: 'Older', size: data?.Older?.length })}
        {renderCards({ category: 'Older' })}
      </Grid>
      <SlidePanel
        isOpen={isSidePanelOpen}
        onClose={handleCloseSidebar}
        data={selectedCardData}
      />
    </>
  );
};

export default OutputHistoryListContainer;
