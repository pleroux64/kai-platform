import { ContentCopy, FileDownload } from '@mui/icons-material';
import { Button, Drawer, Grid, Typography } from '@mui/material';
import moment from 'moment';

import styles from './styles';

import { copyToClipboard } from '@/services/toolHistory/copy';
import { exportToCSV } from '@/services/toolHistory/export';

/**
 * Renders a drawer component for displaying tool output history.
 *
 * @param {Object} props - The props object containing isOpen, onClose, data, and Component.
 * @returns {JSX.Element} A Drawer component with header, content, and footer buttons.
 */
const ToolOutputHistoryDrawer = (props) => {
  const { isOpen, onClose, data, Component } = props;

  const handleCopyToClipboard = () => {
    copyToClipboard(data, data?.response || []);
  };

  const handleExportToCSV = () => {
    exportToCSV(data, data?.response || []);
  };

  const renderHeader = () => (
    <Grid container direction="column" {...styles.headerGridProps}>
      <Grid item>
        <Typography {...styles.dateProps}>
          {data?.creationDate || moment().toDate().toLocaleDateString()}
        </Typography>
      </Grid>
      <Grid item>
        <Typography {...styles.categoryTitleProps}>
          {data?.title || 'Default Title'}
        </Typography>
      </Grid>
      <Grid item>
        <Typography {...styles.categoryContentProps}>
          {data?.content || 'Default Content'}
        </Typography>
      </Grid>
    </Grid>
  );

  const renderContent = () => (
    <Grid {...styles.containerGridProps}>
      {Component && <Component data={data} />}
    </Grid>
  );

  const renderFooterButtons = () => (
    <Grid container justifyContent="flex-start" sx={{ mt: 3, width: '100%' }}>
      <Button onClick={handleCopyToClipboard} {...styles.copyButton}>
        <ContentCopy {...styles.CopyIcon} />
        Copy
      </Button>
      <Button onClick={handleExportToCSV} {...styles.exportButton}>
        <FileDownload {...styles.downloadIcon} />
        Export
      </Button>
    </Grid>
  );

  return (
    <Drawer {...styles.drawerProps} open={isOpen} onClose={onClose}>
      <Grid {...styles.mainGridProps}>
        {renderHeader()}
        {renderContent()}
        {renderFooterButtons()}
      </Grid>
    </Drawer>
  );
};

export default ToolOutputHistoryDrawer;
