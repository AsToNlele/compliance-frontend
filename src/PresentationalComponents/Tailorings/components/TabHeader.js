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
import OsVersionText from '../../TabbedRules/OsVersionText';
import { SSGVersionText } from '../../TabbedRules/ProfileTabContent';
import ResetRules from 'PresentationalComponents/ResetRules/ResetRules';

const TabHeader = ({
  tailoring,
  securityGuide,
  profileId,
  rulesPageLink,
  onReset,
}) => {
  const osMinorVersion =
    tailoring?.os_minor_version != null
      ? tailoring.os_minor_version
      : securityGuide?.osMinorVersion;

  const handleReset = () => {
    const security_guide_id = securityGuide?.id;
    console.log('handleReset', security_guide_id, osMinorVersion);
    onReset(security_guide_id, osMinorVersion);
  };
  return (
    <TextContent className="pf-v5-u-mt-md">
      <Text component={TextVariants.h3}>
        <span className="pf-v5-u-pr-sm">
          <OsVersionText
            profile={{
              osMajorVersion:
                tailoring?.os_major_version || securityGuide?.osMajorVersion,
              osMinorVersion,
            }}
          />
        </span>
      </Text>
      <Flex>
        <FlexItem>
          <SSGVersionText
            profile={{
              osMajorVersion:
                tailoring?.os_major_version || securityGuide?.osMajorVersion,
              osMinorVersion:
                tailoring?.os_minor_version || securityGuide?.osMinorVersion,
              benchmark: {
                version:
                  tailoring?.security_guide_version || securityGuide?.version,
              },
            }}
          />
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
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

          {true && <ResetRules onReset={handleReset} />}
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
  onReset: propTypes.fn,
};

export default TabHeader;
