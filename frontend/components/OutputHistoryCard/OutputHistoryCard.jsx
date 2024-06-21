// OutputHistoryCard.js

import { Button, Card, Grid, Typography } from '@mui/material';
import Image from 'next/image';

import ToolImage from '@/assets/images/BookImage.png'; // Default image

import styles from './styles';

const OutputHistoryCard = (props) => {
  const { title, content, creationDate, backgroundImageUrl, logo, onOpen } =
    props;

  const handleButtonClick = () => {
    onOpen(); // Call onOpen without passing additional props
  };

  const renderBackgroundImage = () => {
    return (
      <Grid {...styles.backgroundImageGridProps}>
        <Image
          src={backgroundImageUrl || ToolImage}
          alt="tool background"
          layout="fill"
          objectFit="cover"
        />
      </Grid>
    );
  };

  const renderLogo = () => {
    if (!logo) return null;
    return (
      <Grid {...styles.logoGridProps}>
        <Image src={logo} alt="tool logo" {...styles.logoImageProps} />
      </Grid>
    );
  };

  const renderTitle = () => {
    return (
      <Grid {...styles.contentGridProps}>
        <Typography {...styles.dateProps}>{creationDate}</Typography>
        <Typography {...styles.titleProps}>{title}</Typography>
        <Typography {...styles.descriptionProps}>{content}</Typography>
        <Button {...styles.previewButtonProps} onClick={handleButtonClick}>
          Preview
        </Button>
      </Grid>
    );
  };

  return (
    <Grid {...styles.mainGridProps}>
      <Card {...styles.cardProps} elevation={6}>
        <Grid {...styles.cardContentGridProps}>
          {renderBackgroundImage()}
          {renderLogo()}
          {renderTitle()}
        </Grid>
      </Card>
    </Grid>
  );
};

export default OutputHistoryCard;
