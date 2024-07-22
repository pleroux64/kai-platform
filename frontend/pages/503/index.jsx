import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';

import GradientOutlinedButton from '@/components/GradientOutlinedButton';
import MainAppLayout from '@/layouts/MainAppLayout';

import Error from '@/assets/svg/500Error.svg';
import Star from '@/assets/svg/Star_3.svg';

import ROUTES from '@/constants/routes';

import pageNotFoundStyles from '@/styles/pageNotFoundStyles';

/**
 * Renders the page for when the requested route is not found.
 *
 * @return {JSX.Element} The JSX element representing the page.
 */
const PageNotFound = () => {
  const router = useRouter();
  const theme = useTheme();

  const handleRouteToHome = () => {
    router.push(ROUTES.HOME);
  };

  const renderMainTitle = () => {
    return (
      <Grid {...pageNotFoundStyles.titleGridProps}>
        <Typography {...pageNotFoundStyles.subtitleProps}>
          Application Error
        </Typography>
      </Grid>
    );
  };

  const renderBodyText = () => {
    return (
      <Grid {...pageNotFoundStyles.bodyGridProps}>
        <Typography {...pageNotFoundStyles.bodyProps}>
          It&apos;s not you it&apos;s us, we&apos;re trying to fix this issue
          for you
          <br />
          Let&apos;s go back to home for the time being!
        </Typography>
      </Grid>
    );
  };

  const renderGoHomeButton = () => {
    return (
      <Grid {...pageNotFoundStyles.buttonGridProps}>
        <GradientOutlinedButton
          bgcolor={theme.palette.Common.White['100p']}
          clickHandler={handleRouteToHome}
          text="Go to Homepage"
          textColor="white"
          {...pageNotFoundStyles.submitButtonProps}
        />
      </Grid>
    );
  };

  const renderErrorImg = () => {
    return (
      <Grid {...pageNotFoundStyles.buttonGridProps}>
        <Error />
      </Grid>
    );
  };

  const renderBottomContent = () => {
    return (
      <Grid {...pageNotFoundStyles.sectionGridProps}>
        <Grid {...pageNotFoundStyles.mainContentGridProps}>
          {renderMainTitle()}
          {renderErrorImg()}
          {renderBodyText()}
          {renderGoHomeButton()}
        </Grid>
      </Grid>
    );
  };

  const renderRadialBackground = () => {
    return (
      <>
        <Box {...pageNotFoundStyles.radialBg1Props} />
        <Box {...pageNotFoundStyles.radialBg2Props} />
        <Box {...pageNotFoundStyles.radialBg3Props} />
      </>
    );
  };

  const renderIcons = () => {
    return (
      <>
        <Box {...pageNotFoundStyles.star1Props}>
          <Star />
        </Box>
        <Box {...pageNotFoundStyles.star2Props}>
          <Star />
        </Box>
        <Box {...pageNotFoundStyles.star3Props}>
          <Star />
        </Box>
      </>
    );
  };

  return (
    <Grid {...pageNotFoundStyles.mainGridProps}>
      {renderRadialBackground()}
      <Grid {...pageNotFoundStyles.contentGridProps}>
        {renderIcons()}
        {renderBottomContent()}
      </Grid>
    </Grid>
  );
};

PageNotFound.getLayout = function getLayout(page) {
  return <MainAppLayout>{page}</MainAppLayout>;
};

export default PageNotFound;
