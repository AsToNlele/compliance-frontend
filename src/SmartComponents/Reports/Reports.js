import React from 'react';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import SkeletonTable from '@redhat-cloud-services/frontend-components/SkeletonTable';
import {
  ReportsTable,
  StateViewPart,
  StateViewWithError,
  ReportsEmptyState,
} from 'PresentationalComponents';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import useReports from 'Utilities/hooks/api/useReports';
import useReportsOS from 'Utilities/hooks/api/useReportsOs';
import useReportsCount from 'Utilities/hooks/useReportsCount';

const ReportsHeader = () => (
  <PageHeader>
    <PageHeaderTitle title="Reports" />
  </PageHeader>
);

const Reports = () => {
  // Required for correctly showing empty state
  const totalReports = useReportsCount();

  const { data: operatingSystems } = useReportsOS();
  const {
    data: { data: reportsData, meta: { total } = {} } = {},
    error,
    loading: reportsLoading,
    exporter,
  } = useReports({
    params: { filter: 'with_reported_systems = true' },
    useTableState: true,
    batch: {
      batchSize: 10,
    },
  });
  const data = operatingSystems;
  const loading = !data ? true : undefined;

  return (
    <React.Fragment>
      <ReportsHeader />
      <section className="pf-v5-c-page__main-section">
        <StateViewWithError stateValues={{ error, data, loading }}>
          <StateViewPart stateKey="loading">
            <SkeletonTable colSize={3} rowSize={10} />
          </StateViewPart>
          <StateViewPart stateKey="data">
            {totalReports === 0 ? (
              <ReportsEmptyState />
            ) : (
              <ReportsTable
                reports={reportsData}
                operatingSystems={operatingSystems}
                total={total}
                loading={reportsLoading}
                options={{
                  exporter,
                }}
              />
            )}
          </StateViewPart>
        </StateViewWithError>
      </section>
    </React.Fragment>
  );
};

const ReportsWithTableStateProvider = () => (
  <TableStateProvider>
    <Reports />
  </TableStateProvider>
);

export default ReportsWithTableStateProvider;
