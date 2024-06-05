import OutputHistoryTable from '@/components/OutputHistoryTable';
import MainAppLayout from '@/layouts/MainAppLayout';

const History = () => {
  return <OutputHistoryTable />;
};

History.getLayout = function getLayout(page) {
  return <MainAppLayout>{page}</MainAppLayout>;
};

export default History;
