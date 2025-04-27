import { useCallback, useEffect, useRef, useState } from "react";

interface UseHoverOptions {
  delay?: number;
}

type HoverRefCallback = (node: HTMLElement | null) => void;

export function useHover({ delay = 200 }: UseHoverOptions = {}): [HoverRefCallback, boolean] {
  const [hovering, setHovering] = useState(false);
  const previousNode = useRef<HTMLElement | null>(null);
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    enterTimeout.current = setTimeout(() => {
      setHovering(true);
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    leaveTimeout.current = setTimeout(() => {
      setHovering(false);
    }, delay);
  }, [delay]);

  const customRef: HoverRefCallback = useCallback(
    (node) => {
      if (previousNode.current) {
        previousNode.current.removeEventListener("mouseenter", handleMouseEnter);
        previousNode.current.removeEventListener("mouseleave", handleMouseLeave);
      }

      if (node) {
        node.addEventListener("mouseenter", handleMouseEnter);
        node.addEventListener("mouseleave", handleMouseLeave);
      }

      previousNode.current = node;
    },
    [handleMouseEnter, handleMouseLeave]
  );

  useEffect(() => {
    return () => {
      if (enterTimeout.current) clearTimeout(enterTimeout.current);
      if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    };
  }, []);

  return [customRef, hovering];
}
