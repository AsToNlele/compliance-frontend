import React from 'react';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import GatedComponents from '@/PresentationalComponents/GatedComponents';
import TableStateProvider from '../../Frameworks/AsyncTableTools/components/TableStateProvider';
import CompliancePoliciesRest from './CompliancePoliciesRest';
import CompliancePoliciesGraphQL from './CompliancePoliciesGraphQL';

const CompliancePolicies = () => (
  <TableStateProvider>
    <PageHeader className="page-header">
      <PageHeaderTitle title="SCAP policies" />
    </PageHeader>
    <section className="pf-v5-c-page__main-section">
      <GatedComponents
        RestComponent={CompliancePoliciesRest}
        GraphQLComponent={CompliancePoliciesGraphQL}
      />
    </section>
  </TableStateProvider>
);

export default CompliancePolicies;
