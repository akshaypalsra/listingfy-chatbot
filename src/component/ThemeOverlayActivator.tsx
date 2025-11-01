// src/components/ThemeOverlayActivator.tsx
import { useEffect } from "react";

const ThemeOverlayActivator: React.FC = () => {
  useEffect(() => {
    // MutationObserver to listen for insertion of .theme-circle-overlay and trigger attributes
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (node instanceof Element && node.classList.contains("theme-circle-overlay")) {
            // next tick set data-animate attribute so the transition runs
            requestAnimationFrame(() => {
              node.setAttribute("data-animate", "1");
            });
            // after the transform animation (450ms), mark to fade out
            setTimeout(() => {
              // mark fade (optional)
              node.setAttribute("data-fade", "1");
              // remove after fade
              setTimeout(() => {
                if (node.parentElement) node.parentElement.removeChild(node);
              }, 250);
            }, 480);
          }
        }
      }
    });

    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  return null;
};

export default ThemeOverlayActivator;
