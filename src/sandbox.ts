import {
  Schema,
  State,
  Action,
  ApplyActionsToState,
} from '@boardgamelab/components';
import { writable, derived } from 'svelte/store';
import { setContext } from 'svelte';

export function Init(
  schema: Schema,
  state: State,
  svg: { el: SVGGraphicsElement },
  hand: { el: HTMLElement }
) {
  const activeObjects = writable({});

  // The master state is the state that all clients can see.
  const masterState = writable({ ...state });

  // The local state might have some changes that only make
  // sense locally. For example, a dragged object may continuously
  // update its co-orindates as it is being dragged, but we
  // only update the master state at the end of the drag in
  // order to not make the network traffic too chatty.
  const localState = writable({ ...state });

  masterState.subscribe((s) => {
    localState.set(s);
  });

  const dispatchActions = (actions: Action[]) => {
    console.log(actions);
    // TODO: We update the state store locally here,
    // but this should probably live outside this component.
    masterState.update((s) => ApplyActionsToState(s, actions));
  };

  const dispatchEvent = () => {};

  const highlight = writable({});
  setContext('highlight', highlight);

  setContext('context', {
    state: localState,
    schema,
    dispatchEvent,
    dispatchActions,
    activeObjects,
    svg,
    hand,
  });

  return {
    stateStore: localState,
    renderingOrder: derived(localState, ($s) => ComputeRenderingOrder($s)),
    activeObjects,
    dispatchActions,
  };
}

/**
 * Orders the state objects by the `order` field.
 * Higher numbers mean that the object will appear later
 * in the returned array.
 */
function ComputeRenderingOrder(s: State): string[] {
  return Object.keys(s.objects)
    .filter((key) => {
      return !s.objects[key].parent;
    })
    .sort((a, b) => {
      const aOrder = s.objects[a].order || 0;
      const bOrder = s.objects[b].order || 0;
      return aOrder < bOrder ? -1 : 1;
    });
}
