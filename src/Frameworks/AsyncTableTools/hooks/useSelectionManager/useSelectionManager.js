import { cleanEmpty, init as initReducer } from './reducer';
import useTableState from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import { TABLE_STATE_NAMESPACE } from '@/Frameworks/AsyncTableTools/hooks/useSelectionManager/constants';
import isObject from 'lodash/isObject';

/**
 * Provides a generic API to manage selection stats of one (default) or multiple groups of selections.
 *
 *  @param   {Array}    preselected  Array of items initially selected
 *  @param   {object}   [options]    function to call when a selection is made
 *  @param   {Function} handleSelect function to call when a selection is made
 *  @returns {object}                Object containing the current selection state and functions to manipulate it
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */

const useSelectionManager = (preselected, options = {}, handleSelect) => {
  const { withGroups = false } = options;
  // const [selection, dispatch] = useReducer(
  //   (state, action) => {
  //     const newState = reducer(state, action);
  //
  //     if (handleSelect) {
  //       handleSelect(withGroups ? newState : newState.default);
  //     }
  //
  //     return newState;
  //   },
  //   preselected,
  //   initReducer(withGroups)
  // );

  const DEFAULT_GROUP_KEY = 'default';

  const [contextSelection, setContextSelection] = useTableState(
    TABLE_STATE_NAMESPACE,
    () => initReducer(preselected, withGroups)
  );

  console.log('HANDLESELECT', handleSelect);

  // const set = (items, group) => dispatch({ type: 'set', group, items });
  const set = (items, group) => {
    let finalGroup = group || DEFAULT_GROUP_KEY;

    setContextSelection((prev) =>
      cleanEmpty({
        selection: {
          ...prev?.selection,
          [finalGroup]:
            items?.length > 0 || isObject(items) ? items : undefined,
        },
      })
    );
  };

  // const select = (item, group, useSet = false) =>
  //   useSet ? set(item, group) : dispatch({ type: 'select', group, item });
  //
  // const deselect = (item, group, useSet = false) => {
  //   return useSet
  //     ? set(item, group)
  //     : dispatch({ type: 'deselect', group, item });
  // };
  //
  // const toggle = (item, group) => dispatch({ type: 'toggle', group, item });
  //
  // const reset = () => dispatch({ type: 'reset', preselected });
  //
  // const clear = () => dispatch({ type: 'clear' });

  const select = () => {};
  const deselect = () => {};
  const reset = () => {};
  const clear = () => {};
  const toggle = () => {};

  console.log('xdd selection in sel manag', contextSelection);

  return {
    set,
    select,
    deselect,
    toggle,
    reset,
    clear,
    selection: withGroups
      ? contextSelection?.selection || []
      : contextSelection?.selection?.default || [],
  };
};

export default useSelectionManager;
