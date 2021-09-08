function eventListener(method, elements, events, fn, options = {}): [Element, Event, unknown, unknown] { //fixme sort this
  let localElements = elements;
  if (Array.isArray(elements)) {
    localElements = Array.from(elements);
  } else if (!Array.isArray(elements)) {
    localElements = [elements];
  }

  let localEvents = events;
  if (!Array.isArray(events)) {
    localEvents = [events];
  }

  localElements.forEach(el => {
    localEvents.forEach(ev => {
      el[method](ev, fn, { capture: false, ...options });
    });
  });

  return [elements, events, fn, options];
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener.bind(null, 'addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener.bind(null, 'removeEventListener');
