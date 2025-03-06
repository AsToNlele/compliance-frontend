import React from 'react';
import propTypes from 'prop-types';
import {
  Text,
  TextVariants,
  TextContent,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import OsVersionText from '../osVersionText';
import { SSGVersionText } from '../ssgVersionText';
import ResetRules from 'PresentationalComponents/ResetRules/ResetRules';

const TabHeader = ({
  tailoring,
  securityGuide,
  profileId,
  rulesPageLink,
  onRuleReset,
}) => {
  const osMinorVersion =
    tailoring?.os_minor_version || securityGuide?.osMinorVersion;
  const osMajorVersion =
    tailoring?.os_major_version || securityGuide?.osMajorVersion;
  const ssgVersion =
    tailoring?.security_guide_version || securityGuide?.version;
  return (
    <TextContent className="pf-v5-u-mt-md">
      <Text component={TextVariants.h3}>
        <span className="pf-v5-u-pr-sm">
          <OsVersionText
            profile={{
              osMajorVersion,
              osMinorVersion,
            }}
          />
        </span>
      </Text>
      <Flex>
        <FlexItem>
          <SSGVersionText
            profile={{
              osMajorVersion,
              osMinorVersion,
              benchmark: {
                version: ssgVersion,
              },
            }}
          />
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          <ResetRules
            osMinorVersion={osMinorVersion}
            onRuleReset={onRuleReset}
          />
          {rulesPageLink && (
            <Link
              to={`/scappolicies/${profileId}/default_ruleset/${securityGuide?.id}`}
              target="_blank"
              className="pf-v5-u-mr-xl"
            >
              View policy rules
              <ExternalLinkAltIcon className="pf-v5-u-ml-sm" />
            </Link>
          )}
        </FlexItem>
      </Flex>
    </TextContent>
  );
};

TabHeader.propTypes = {
  tailoring: propTypes.object,
  securityGuide: propTypes.object,
  profileId: propTypes.string,
  rulesPageLink: propTypes.bool,
  onRuleReset: propTypes.func,
};

export default TabHeader;
