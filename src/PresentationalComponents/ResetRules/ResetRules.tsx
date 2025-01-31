import React from "react";
import { RebootingIcon } from "@patternfly/react-icons";

interface Props {
  onReset: () => void;
}

const ResetRules = ({ onReset }: Props) => {
  return (
    <a className="pf-v5-u-ml-lg pf-v5-u-mr-xl" onClick={() => onReset()}>
      <RebootingIcon className="pf-v5-u-mr-sm" />
      Reset to default
    </a>
  );
};

export default ResetRules;
