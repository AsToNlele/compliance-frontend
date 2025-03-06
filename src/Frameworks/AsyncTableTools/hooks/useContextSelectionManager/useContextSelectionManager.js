import useTableState from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import isObject from 'lodash/isObject';
import uniq from 'lodash/uniq';
import { useEffect } from 'react';

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
const useContextSelectionManager = (
  preselected,
  options = {},
  handleSelect
) => {
  const { withGroups = false, groupName = 'default' } = options;
  console.log('deez', { preselected });

  const initState = withGroups
    ? preselected || []
    : { default: preselected || [] };

  const [selection, setSelection] = useTableState(
    `selection-${groupName}`,
    initState
  );

  const DEFAULT_GROUP_KEY = 'default';

  const selectionGroup = (group) => group || DEFAULT_GROUP_KEY;

  console.log('deez selection', selection);

  const onSelect = (state) => {
    if (handleSelect != null) {
      handleSelect(withGroups ? state : state.default);
    }
  };

  const cleanEmpty = (state) =>
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

  const set = (items, group) => {
    const finalGroup = selectionGroup(group);
    const finalState = {
      ...selection,
      [finalGroup]: uniq(items),
    };
    debugger;
    onSelect(finalState);
    console.log('set finalstate', finalState);
    setSelection(cleanEmpty(finalState));
  };

  const select = (items, group, useSet = false) => {
    if (useSet) {
      set(items, group);
    } else {
      const finalGroup = selectionGroup(group);
      const finalItems = [...(Array.isArray(items) ? items : [items])];
      const finalState = {
        ...selection,
        [finalGroup]: uniq([...finalItems, ...(selection[finalGroup] || [])]),
      };
      onSelect(finalState);
      setSelection(cleanEmpty(finalState));
    }
  };

  const deselect = (items, group, useSet = false) => {
    if (useSet) {
      set(items, group);
    } else {
      const finalGroup = selectionGroup(group);
      const finalItems = (selection[finalGroup] || []).filter(
        (selectedItem) => {
          const deselectItems = [...(Array.isArray(items) ? items : [items])];
          return !deselectItems.includes(selectedItem);
        }
      );
      const finalState = {
        ...selection,
        [finalGroup]: finalItems.length === 0 ? undefined : uniq(finalItems),
      };
      onSelect(finalState);
      setSelection(cleanEmpty(finalState));
    }
  };

  const toggle = (item, group) => {
    const finalGroup = selectionGroup(group);
    if ((selection[finalGroup] || []).includes(item)) {
      deselect(item, group);
    } else {
      select(item, group);
    }
  };

  const reset = () => {
    set(preselected);
    onSelect(preselected);
  };

  const clear = () => {
    set([]);
    onSelect([]);
  };

  let finalSelection = selection;
  const finalPreselected = preselected || [];
  debugger;
  if (selection == null) {
    finalSelection = Object.hasOwn(initState, 'default')
      ? initState.default
      : initState;
  } else if (isObject(selection) && Object.hasOwn(selection, 'default')) {
    finalSelection = selection.default;
  }

  console.log('finalselection', finalSelection);

  // useEffect(() => {
  //   if (handleSelect != null) {
  //     if (selection != null) {
  //       if (isObject(selection)) {
  //         onSelect(selection?.default);
  //       } else {
  //         onSelect(selection);
  //       }
  //     }
  //   }
  // }, [selection]);

  console.log('deez', { finalPreselected, finalSelection });
  return {
    set,
    select,
    deselect,
    toggle,
    reset,
    clear,
    selection: finalSelection,
    // selection:
    //   selection != null
    //     ? withGroups
    //       ? selection || []
    //       : Object.hasOwn(selection, 'default')
    //       ? selection.default
    //       : []
    //     : [],
  };
};

export default useContextSelectionManager;
