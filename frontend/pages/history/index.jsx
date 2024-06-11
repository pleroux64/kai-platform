import React from 'react'

import OutputHistoryTable from '@/components/OutputHistoryTable/OutputHistoryTable'
import MainAppLayout from '@/layouts/MainAppLayout'

const HistoryPage = () => {
  return <OutputHistoryTable />
}

HistoryPage.getLayout = function getLayout(page) {
  return <MainAppLayout>{page}</MainAppLayout>
}

export default HistoryPage
