import useQuery, { apiInstance } from '../useQuery';

export const usePolicyOperatingSystemsQuery = (policyId) => {
  return useQuery(apiInstance.policySystemsOS, { params: [policyId] });
};
