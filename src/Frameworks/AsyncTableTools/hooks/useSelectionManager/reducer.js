import isObject from 'lodash/isObject';
import uniq from 'lodash/uniq';

const DEFAULT_GROUP_KEY = 'default';
const selectionGroup = (action) => action.group || DEFAULT_GROUP_KEY;

export const init = (preselected, withGroups) => {
  console.log('RUUN');
  debugger;
  return withGroups
    ? { selection: preselected || [] }
    : { selection: { default: preselected || [] } };
};

export const cleanEmpty = (state) =>
  Object.entries(state).reduce((newState, [key, value]) => {
    if (value !== undefined && value.length !== 0) {
      return {
        ...newState,
        [key]: value,
      };
    } else if (key === DEFAULT_GROUP_KEY && value === undefined) {
      //Default selection can not be removed empty
      return {
        [DEFAULT_GROUP_KEY]: [],
      };
    } else {
      return newState;
    }
  }, {});

const set = (state = {}, action) => {
  const group = selectionGroup(action);

  return cleanEmpty({
    ...state,
    [group]:
      action.items?.length > 0 || isObject(action.items)
        ? action.items
        : undefined,
  });
};

const select = (state = {}, action) => {
  const group = selectionGroup(action);
  const items = action.reset
    ? action?.items
    : [...(Array.isArray(action.item) ? action.item : [action.item])];

  return cleanEmpty({
    ...state,
    [group]: uniq([...items, ...(state[group] || [])]),
  });
};

const deselect = (state = {}, action) => {
  const group = selectionGroup(action);
  const items = (state[group] || []).filter((selectedItem) => {
    const deselectItems = Array.isArray(action?.item)
      ? action?.item
      : [action?.item];
    return !deselectItems.includes(selectedItem);
  });

  const res = cleanEmpty({
    ...state,
    [group]: items.length === 0 ? undefined : items,
  });
  debugger;
  return res;
};

const toggle = (state, action) => {
  const group = selectionGroup(action);
  return (state[group] || []).includes(action.item)
    ? deselect(state, action)
    : select(state, action);
};

const reset = (state, action) =>
  init(!state.hasOwnProperty(DEFAULT_GROUP_KEY))(action?.preselected); // eslint-disable-line
const clear = (state) => init(!state.hasOwnProperty(DEFAULT_GROUP_KEY))(); // eslint-disable-line

export default (state, action) =>
  ({
    set,
    select,
    deselect,
    toggle,
    reset,
    clear,
  }[action.type](state, action));
