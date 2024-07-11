import { apiInstance, useQuery } from '../useQuery';
import { useFetchEachPolicyTailoring } from './useFetchEachPolicyTailoring';

export const usePoliciesQuery = () => {
  let { data, error, loading, refetch } = useQuery(apiInstance.policies, {});
  const {
    loading: tailoringLoading,
    results,
    error: tailoringError,
  } = useFetchEachPolicyTailoring(data?.data);

  const policiesWithOldId =
    !loading && !tailoringLoading
      ? data?.data?.map((policy) => {
          const found = results.find((res) =>
            res?.data?.links?.first?.includes(policy?.id)
          );
          const oldId = found?.data?.data?.[0]?.id;
          return { ...policy, old_id: oldId };
        })
      : null;

  const allLoaded = !loading && !tailoringLoading;

  return {
    data: policiesWithOldId,
    loading: allLoaded,
    error: error || tailoringError,
    refetch,
  };
};
