import React  from 'react';
import { RebootingIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';

const ResetRules = ({
  handleResetRules,
  // handleSelect,
  // updateRules,
  // profile,
  // newOsMinorVersion,
  // originalRules,
  // loading,
  // selectedRuleRefIds,
}) => {
  // useEffect(() => {
  //   if (!loading) {
  //     updateRules(selectedRuleRefIds);
  //   }
  // }, [loading, originalRules]);

  // const resetDefaultRules = () => {
  //   handleSelect && handleSelect(profile, newOsMinorVersion, originalRules);
  // };
  return (
    <a className="pf-v5-u-ml-lg pf-v5-u-mr-xl" onClick={handleResetRules}>
      <RebootingIcon className="pf-v5-u-mr-sm" />
      Reset to default
    </a>
  );
};

ResetRules.propTypes = {
  handleResetRules: propTypes.func,
  // handleSelect: propTypes.func,
  // updateRules: propTypes.any,
  // profile: propTypes.any,
  // newOsMinorVersion: propTypes.any,
  // originalRules: propTypes.array,
  // loading: propTypes.bool,
  // selectedRuleRefIds: propTypes.array,
};

export default ResetRules;
