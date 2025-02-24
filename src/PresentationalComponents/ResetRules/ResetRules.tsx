import React from "react";
import { RebootingIcon } from "@patternfly/react-icons";

interface Props {
  onReset: (arg: string, arg2: number) => void;
  securityGuideId: string;
  osMinorVersion: number;
}


const ResetRules = ({ onReset, securityGuideId, osMinorVersion}: Props) => {
  return (
    <a className="pf-v5-u-ml-lg pf-v5-u-mr-xl" onClick={() => onReset(securityGuideId, osMinorVersion)}>
      <RebootingIcon className="pf-v5-u-mr-sm" />
      Reset to default
    </a>
  );
};

export default ResetRules;
