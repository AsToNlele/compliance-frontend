import { isNotEmpty, stringToId } from './helpers';
import { getFilterConfigItem } from './filterConfigHelpers';
import filterTypeHelpers from './filterTypeHelpers';
import isEmpty from 'lodash/isEmpty';

const filterChipTemplates = (configItem, value) => {
  console.log(configItem, value);
  debugger;
  return filterTypeHelpers(configItem.type)?.filterChips(configItem, value);
};

export const toFilterChips = (filterConfig, activeFilters) => {
  console.log('toFilterChips', { filterConfig, activeFilters });
  const res = Object.entries(activeFilters || {})
    .map(([filter, value]) =>
      !isEmpty(value)
        ? filterChipTemplates(getFilterConfigItem(filterConfig, filter), value)
        : null
    )
    .filter((v) => !!v);

  console.log('TO FILTERT CHIPS', res);
  return res;
};

export const toDeselectValue = (filterConfig, chip, activeFilters) => {
  const configItem = getFilterConfigItem(
    filterConfig,
    stringToId(chip.category)
  );
  return filterTypeHelpers(configItem.type).toDeselectValue(
    configItem,
    chip,
    activeFilters
  );
};
