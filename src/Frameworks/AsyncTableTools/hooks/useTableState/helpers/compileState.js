import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';

const preserveUndefinedCustomizer = (objValue, srcValue, key, obj) => {
  if (objValue !== srcValue && typeof srcValue === 'undefined') {
    obj[key] = srcValue;
  }
};

const applySerialisers = (serialisers, newState) =>
  Object.entries(serialisers).reduce(
    (newSerialisedState, [serialiserNamespace, serialiser]) => {
      return {
        ...newSerialisedState,
        ...(serialiser && typeof serialiser === 'function'
          ? {
              [serialiserNamespace]: serialiser(newState[serialiserNamespace]),
            }
          : {}),
      };
    },
    {}
  );

const applyNameSpaceObserver = (namespace, observers, newState, currentState) =>
  Object.entries(observers[namespace] || {}).reduce(
    (observerResults, [observedState, observerFunction]) => {
      const observerResult = observerFunction(
        currentState?.[observedState],
        currentState?.[namespace],
        newState[namespace]
      );

      return {
        ...observerResults,
        ...(typeof observerResult !== 'undefined'
          ? { [observedState]: observerResult }
          : {}),
      };
    },
    {}
  );

const applyObservers = (namespace, observers, newState, currentState) => {
  const newObserverStates = applyNameSpaceObserver(
    namespace,
    observers,
    newState,
    currentState
  );

  const updateStateRecursively = (currentStateSnapshot, pendingChanges) => {
    const nextStateChanges = Object.keys(pendingChanges).reduce(
      (acc, stateKey) => ({
        ...acc,
        ...applyNameSpaceObserver(
          stateKey,
          observers,
          {
            ...newState,
            ...currentStateSnapshot,
          },
          currentState
        ),
      }),
      {}
    );

    if (Object.keys(nextStateChanges).length === 0) {
      return currentStateSnapshot;
    }

    return updateStateRecursively(
      merge(currentStateSnapshot, nextStateChanges),
      nextStateChanges
    );
  };

  const finalObserverStates = updateStateRecursively(
    newObserverStates,
    newObserverStates
  );

  return mergeWith(
    currentState,
    mergeWith(newState, finalObserverStates, preserveUndefinedCustomizer),
    preserveUndefinedCustomizer
  );
};

const compileState = (
  namespace,
  currentState,
  newStateForNameSpace,
  observers,
  serialisers
) => {
  const newStateTableState = {
    ...(currentState?.tableState || {}),
    [namespace]: newStateForNameSpace,
  };
  const newStateWithObservers = applyObservers(
    namespace,
    observers,
    newStateTableState,
    currentState?.tableState || {}
  );
  const newSerialisedState = applySerialisers(
    serialisers,
    newStateWithObservers
  );

  return {
    tableState: newStateWithObservers,
    ...(Object.keys(newSerialisedState).length
      ? { serialisedTableState: newSerialisedState }
      : {}),
  };
};

export default compileState;