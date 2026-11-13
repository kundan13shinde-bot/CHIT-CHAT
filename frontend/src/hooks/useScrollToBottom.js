import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook to auto-scroll a chat message list to the bottom.
 *
 * Can be used in multiple ways:
 * 1. Pass as ref directly to a bottom dummy element:
 *    const bottomRef = useScrollToBottom(messages);
 *    <div ref={bottomRef} />
 *
 * 2. Destructure refs and manual scroll function:
 *    const { endRef, containerRef, scrollToBottom } = useScrollToBottom([messages]);
 *    <div ref={containerRef} className="overflow-y-auto">
 *       {messages.map(...)}
 *       <div ref={endRef} />
 *    </div>
 *
 * @param {any|any[]} deps - Dependency or array of dependencies that trigger scrolling (e.g. messages)
 * @param {ScrollBehavior} [defaultBehavior="smooth"] - Default scroll behavior ("smooth" or "auto")
 */
export function useScrollToBottom(deps = [], defaultBehavior = "smooth") {
  const endRef = useRef(null);
  const containerRef = useRef(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = useCallback(
    (behavior = defaultBehavior) => {
      // Prefer scrolling the container directly if attached (avoids moving outer window scroll)
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior,
        });
        return;
      }

      // Fallback to scrolling the end dummy element into view
      if (endRef.current) {
        endRef.current.scrollIntoView({
          behavior,
          block: "nearest",
          inline: "nearest",
        });
      }
    },
    [defaultBehavior]
  );

  // Normalize deps into an array
  const dependencies = Array.isArray(deps) ? deps : [deps];

  useEffect(() => {
    // Instant scroll on initial mount / chat switch; smooth scroll on new messages
    const behavior = isInitialMount.current ? "auto" : defaultBehavior;
    scrollToBottom(behavior);

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Support both direct ref assignment (<div ref={ref} />) and destructuring ({ endRef, containerRef, scrollToBottom })
  endRef.endRef = endRef;
  endRef.containerRef = containerRef;
  endRef.scrollToBottom = scrollToBottom;

  return endRef;
}

export default useScrollToBottom;

