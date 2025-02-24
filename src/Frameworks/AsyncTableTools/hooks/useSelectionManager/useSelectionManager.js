import { cleanEmpty, init as initReducer } from './reducer';
import useTableState from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import { TABLE_STATE_NAMESPACE } from '@/Frameworks/AsyncTableTools/hooks/useSelectionManager/constants';
import isObject from 'lodash/isObject';
// import { useReducer } from 'react';
import uniq from 'lodash/uniq';
import { useCallback, useMemo } from 'react';

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

  const selectionOut = useMemo(() => [], []);
  const initState = useMemo(
    () => initReducer(preselected, withGroups),
    [preselected, withGroups]
  );

  const [contextSelection, setContextSelection] = useTableState(
    TABLE_STATE_NAMESPACE,
    initState
  );

  // debugger;

  console.log('HANDLESELECT', handleSelect);

  const onSelect = (selection) => {
    if (handleSelect) {
      handleSelect(selection);
    }
  };
  // const set = (items, group) => dispatch({ type: 'set', group, items });
  const set = useCallback(
    (items, group) => {
      console.log('SET', items);
      let finalGroup = group || DEFAULT_GROUP_KEY;

      let newState = {};

      setContextSelection((prev) => {
        newState = {
          selection: cleanEmpty({
            ...prev?.selection,
            [finalGroup]:
              items?.length > 0 || isObject(items) ? items : undefined,
          }),
        };
        return newState;
      });

      onSelect(newState.selection[group]);
    },
    [setContextSelection, onSelect]
  );

  const select = useCallback(
    (item, group, useSet = false) => {
      console.log('SELECTTTTTT');
      if (useSet) {
        set(item, group);
      } else {
        let finalGroup = group || DEFAULT_GROUP_KEY;
        let items = [...(Array.isArray(item) ? item : [item])];

        let newState = {};

        setContextSelection((prev) => {
          newState = {
            selection: cleanEmpty({
              ...prev?.selection,
              [finalGroup]: uniq([...items, ...(prev.selection[group] || [])]),
            }),
          };
          return newState;
        });

        onSelect(newState.selection[group]);
      }
    },
    [set, setContextSelection, onSelect]
  );
  // dispatch({ type: 'select', group, item });

  // const select = (item, group, useSet = false) =>
  //   useSet ? set(item, group) : dispatch({ type: 'select', group, item });
  //
  const deselect = useCallback(
    (item, group, useSet = false) => {
      console.log('DESELECTTTTTT');

      if (useSet) {
        set(item, group);
      } else {
        let finalGroup = group || DEFAULT_GROUP_KEY;
        let newState = {};

        const items = (contextSelection.selection[finalGroup] || []).filter(
          (selectedItem) => {
            const deselectItems = Array.isArray(item) ? item : [item];
            return !deselectItems.includes(selectedItem);
          }
        );

        setContextSelection((prev) => {
          newState = {
            selection: cleanEmpty({
              ...prev?.selection,
              [finalGroup]: items.length === 0 ? undefined : items,
            }),
          };
          return newState;
        });

        console.log('NEW STATE SENT TO HANDLESELECT', newState);
        onSelect(newState.selection[group]);
      }
    },
    [contextSelection, setContextSelection, set, onSelect]
  );
  //
  const toggle = (item, group) => {
    let finalGroup = group || DEFAULT_GROUP_KEY;
    (contextSelection.selection[finalGroup] || []).includes(item)
      ? deselect(item, group)
      : select(item, group);
  };

  const reset = () => set(preselected, DEFAULT_GROUP_KEY);
  const clear = () => set([], DEFAULT_GROUP_KEY); // eslint-disable-line

  //
  // const reset = () => dispatch({ type: 'reset', preselected });
  //
  // const clear = () => dispatch({ type: 'clear' });

  // const select = () => { };
  // const deselect = () => {};
  // const reset = useCallback(() => {}, []);
  // const clear = useCallback(() => {}, []);
  // const toggle = useCallback(() => {}, []);

  console.log('xdd selection in sel manag', contextSelection);

  return {
    set,
    select,
    deselect,
    toggle,
    reset,
    clear,
    selection: selectionOut,
    // selection: withGroups
    //   ? contextSelection?.selection?.default || []
    //   : contextSelection?.selection?.default || [],
  };
};

export default useSelectionManager;
