import { useEffect } from "react";

function useMessageListener(eventId, listener) {
  useEffect(() => {
    const _listener = (e) => {
      if (e.data.id === eventId) listener(e);
    };

    window.addEventListener("message", _listener, false);

    return () => {
      window.removeEventListener("message", _listener, false);
    };
  }, [eventId, listener]);
}

export { useMessageListener };
