// src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  darkMode: boolean;
  // called with click coordinates to animate circular reveal
  toggleDarkModeAt: (x: number, y: number) => void;
  // fallback toggle (no coords) if needed
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return JSON.parse(stored);
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // overlay state for circular reveal
  const [circle, setCircle] = useState<
    | {
        x: number;
        y: number;
        diameter: number;
        color: string; // target theme color (new theme bg)
        animating: boolean;
      }
    | null
  >(null);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // utility to compute the diameter needed to cover screen from (x,y)
  const computeDiameter = (x: number, y: number) => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    // distances to four corners
    const d1 = Math.hypot(x - 0, y - 0);
    const d2 = Math.hypot(x - vw, y - 0);
    const d3 = Math.hypot(x - 0, y - vh);
    const d4 = Math.hypot(x - vw, y - vh);
    const maxDist = Math.max(d1, d2, d3, d4);
    return Math.ceil(maxDist * 2); // diameter
  };

  // toggle without coords (fallback)
  const toggleDarkMode = () => {
    // quick non-animated toggle (you can call toggleDarkModeAt for animation)
    setDarkMode((prev) => !prev);
  };

  // Main function: trigger circular reveal from click point (client coords)
  const toggleDarkModeAt = (clientX: number, clientY: number) => {
    // compute diameter needed
    const diameter = computeDiameter(clientX, clientY);

    // determine target theme bg color (the color the circle should show while expanding)
    // read CSS variable for the target theme (we will toggle the theme under the circle,
    // so pick the *new* theme's background variable)
    const targetIsDark = !darkMode;
    // We'll try to read the CSS variable from the corresponding class by temporarily reading from a small element.
    // Simpler approach: compute value using current variables: if target is dark, read from .dark rules by temporarily toggling
    let targetColor = "";
    try {
      if (targetIsDark) {
        // simulate reading dark variable by toggling the class on a detached element
        document.documentElement.classList.add("dark");
        targetColor = getComputedStyle(document.documentElement).getPropertyValue("--color-bg") || "#0f172a";
        // revert immediately
        document.documentElement.classList.remove("dark");
      } else {
        // target is light
        targetColor = getComputedStyle(document.documentElement).getPropertyValue("--color-bg") || "#f9fafb";
      }
      targetColor = targetColor.trim() || (targetIsDark ? "#0f172a" : "#f9fafb");
    } catch {
      targetColor = targetIsDark ? "#0f172a" : "#f9fafb";
    }

    // set circular overlay state (initial)
    setCircle({
      x: clientX,
      y: clientY,
      diameter,
      color: targetColor,
      animating: true,
    });

    // schedule theme flip roughly when circle covers screen; empirically around 220ms is a nice midpoint for 450ms animation
    const flipDelay = 220;
    const totalDuration = 450; // must match CSS animation duration below

    const flipTimer = window.setTimeout(() => {
      setDarkMode((prev) => !prev);
    }, flipDelay);

    // cleanup: remove overlay after animation completes
    const cleanupTimer = window.setTimeout(() => {
      setCircle(null);
      window.clearTimeout(flipTimer);
    }, totalDuration + 20);

    // ensure we clear timers if something else happens (not strictly necessary here)
    // (we don't return a cleanup from here, React won't use it; this is just synchronous)
  };

  return (
    <>
      {/* Circular overlay element */}
      {circle && (
        <div
          aria-hidden
          // z-index very high to be on top of everything
          style={{
            position: "fixed",
            left: circle.x,
            top: circle.y,
            width: circle.diameter,
            height: circle.diameter,
            marginLeft: -circle.diameter / 2,
            marginTop: -circle.diameter / 2,
            pointerEvents: "none",
            borderRadius: "50%",
            background: circle.color,
            zIndex: 9999,
            transform: "scale(0)",
            transition: "transform 450ms cubic-bezier(.2,.9,.2,1), opacity 300ms ease",
            // we force will-change for smooth animations
            willChange: "transform, opacity",
            // Add a subtle shadow/blur to match soft feel
            boxShadow: "0 10px 30px rgba(2,6,23,0.35)",
            // we'll trigger scale via a micro task so CSS transition runs
          }}
          className="theme-circle-overlay"
          // data attribute to find element from CSS if needed
        />
      )}

      <ThemeContext.Provider value={{ darkMode, toggleDarkModeAt, toggleDarkMode }}>
        {children}
      </ThemeContext.Provider>

      {/* small script to trigger the CSS transition on inserted overlay element */}
      <style>{`
        /* When an overlay .theme-circle-overlay is inserted, after microtask we scale it to 1.
           The actual element is inline-styled above; we rely on the class to pick it up.
           We'll use a short setTimeout to flip transform -> scale(1) so transition runs. */
      `}</style>
    </>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
