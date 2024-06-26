import React, { Fragment, useEffect } from 'react';
import propTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Grid,
  GridItem,
  Tab,
} from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import {
  PolicyDetailsDescription,
  PolicyDetailsContentLoader,
  RoutedTabSwitcher as TabSwitcher,
  ContentTab,
  StateViewWithError,
  StateViewPart,
  RoutedTabs,
  BreadcrumbLinkItem,
} from 'PresentationalComponents';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import '@/Charts.scss';
import PolicyRulesTab from './PolicyRulesTab';
import PolicySystemsTab from './PolicySystemsTab';
import PolicyMultiversionRules from './PolicyMultiversionRules';
import './PolicyDetails.scss';
import useSaveValueToPolicy from './hooks/useSaveValueToPolicy';
import usePolicyQuery from 'Utilities/hooks/usePolicyQuery';

export const PolicyDetails = ({ route }) => {
  const defaultTab = 'details';
  const { policy_id: policyId } = useParams();
  const { data, error, loading, refetch } = usePolicyQuery({
    policyId,
  });
  const location = useLocation();
  const policy = data?.profile;
  const hasOsMinorProfiles = !!policy?.policy.profiles.find(
    (profile) => !!profile.osMinorVersion
  );

  const saveToPolicy = useSaveValueToPolicy(policy, () => {
    refetch();
  });

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  useTitleEntity(route, policy?.name);

  return (
    <StateViewWithError
      stateValues={{ error, data: policy && !loading, loading }}
    >
      <StateViewPart stateKey="loading">
        <PageHeader>
          <PolicyDetailsContentLoader />
        </PageHeader>
        <section className="pf-v5-c-page__main-section">
          <Spinner />
        </section>
      </StateViewPart>
      <StateViewPart stateKey="data">
        {policy ? (
          <Fragment>
            <PageHeader className="page-header-tabs">
              <Breadcrumb ouiaId="PolicyDetailsPathBreadcrumb">
                <BreadcrumbLinkItem to="/">Compliance</BreadcrumbLinkItem>
                <BreadcrumbLinkItem to="/scappolicies">
                  SCAP policies
                </BreadcrumbLinkItem>
                <BreadcrumbItem isActive>{policy.name}</BreadcrumbItem>
              </Breadcrumb>
              <Grid gutter="lg">
                <GridItem xl2={11} xl={10} lg={12} md={12} sm={12}>
                  <PageHeaderTitle title={policy.name} />
                </GridItem>
              </Grid>
              <RoutedTabs
                aria-label="Policy Tabs"
                ouiaId="PolicyDetailsTabs"
                defaultTab={defaultTab}
              >
                <Tab title="Details" id="policy-details" eventKey="details" />
                <Tab title="Rules" id="policy-rules" eventKey="rules" />
                <Tab title="Systems" id="policy-systems" eventKey="systems" />
              </RoutedTabs>
            </PageHeader>
            <section className="pf-v5-c-page__main-section">
              <TabSwitcher defaultTab={defaultTab}>
                <ContentTab eventKey="details">
                  <PolicyDetailsDescription policy={policy} refetch={refetch} />
                </ContentTab>
                <ContentTab eventKey="rules">
                  {hasOsMinorProfiles ? (
                    <PolicyMultiversionRules
                      policy={policy}
                      saveToPolicy={saveToPolicy}
                      onRuleValueReset={() => refetch()}
                    />
                  ) : (
                    <PolicyRulesTab policy={policy} />
                  )}
                </ContentTab>
                <ContentTab eventKey="systems">
                  <PolicySystemsTab policy={policy} />
                </ContentTab>
              </TabSwitcher>
            </section>
          </Fragment>
        ) : (
          ''
        )}
      </StateViewPart>
    </StateViewWithError>
  );
};

PolicyDetails.propTypes = {
  route: propTypes.object,
};

export default PolicyDetails;
