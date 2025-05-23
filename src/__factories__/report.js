// Policies are based on canonical profiles with systems assigned as well as rules assigned with the canonical profiles' rules as a default
import { faker } from '@faker-js/faker';

export const buildReport = () => {
  const title = faker.lorem.words({ min: 2, max: 3 });
  const businessObjectiveString = faker.lorem.words(5);
  const businessPossibilities = [null, businessObjectiveString];
  const business_objective = faker.helpers.arrayElement(businessPossibilities);
  return {
    id: faker.string.uuid(),
    title,
    description: faker.lorem.sentence({ min: 2, max: 4 }),
    business_objective,
    compliance_threshold: faker.number.int({ min: 1, max: 100 }),
    type: 'report',
    os_major_version: faker.number.int({ min: 6, max: 9 }),
    profile_title: title,
    ref_id: faker.lorem.slug({ min: 1, max: 4 }),
    all_systems_exposed: faker.datatype.boolean(),
    percent_compliant: faker.number.int({ min: 1, max: 100 }),
    assigned_system_count: 4,
    compliant_system_count: 1,
    unsupported_system_count: 2,
    reported_system_count: 4,
  };
};
