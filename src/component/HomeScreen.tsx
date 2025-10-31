import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const HomeScreen: React.FC<{
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const examples = [
    "Candidate Listing Dashboard",
    "Job Application Tracking Board",
    "Recruiter Screening Panel",
    "Interview Scheduling Interface",
    "Candidate Shortlist Management",
    "Application Analytics Overview",
    "Job Role Assignment System",
    "Recruitment Pipeline Tracker",
  ];

  const promptSuggestions = [
    "Create a listing page showing all job candidates with filters for job title, status, and application date.",
    "Generate a list of shortlisted candidates with quick actions for viewing, editing, or rejecting applications.",
  ];

  // Apply dark class to document root for CSS variable switching
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim().length > 0) {
        navigate("/candidates");
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300`}
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      {/* Sidebar */}
      <aside
        className={`w-72 flex flex-col p-5 transition-colors duration-300 border-r`}
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
        }}
      >
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          Listingfy
        </h2>

        <nav className="flex-1 overflow-y-auto space-y-4">
          <h3
            className="text-xs uppercase tracking-wide"
            style={{ color: "var(--color-secondary)" }}
          >
            Yesterday
          </h3>
          <button
            className="block w-full text-sm text-left py-2 px-2 rounded-md transition-colors"
            style={{
              color: "var(--color-text)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-border)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
          >
            Top React Developer
          </button>

          <h3
            className="text-xs uppercase tracking-wide mt-6"
            style={{ color: "var(--color-secondary)" }}
          >
            Examples
          </h3>
          <div className="space-y-1">
            {examples.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 px-2 rounded-md cursor-pointer transition-colors"
                style={{
                  color: "var(--color-text)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-border)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
              >
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </nav>

        {/* Theme Toggle */}
        <div className="pt-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-border)")
            }
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 transition-colors">
        <div
          className="w-full max-w-xl rounded-2xl shadow-xl p-4 text-center border transition-colors duration-300"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h1 className="text-2xl font-bold mb-4">Start new conversation</h1>

          <div
            className="rounded-xl p-4 mb-6 border transition-colors"
            style={{
              backgroundColor: "var(--color-bg)",
              borderColor: "var(--color-border)",
            }}
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-24 resize-none outline-none transition-colors bg-transparent"
              placeholder="Search for candidates, jobs, skills..."
              style={{
                color: "var(--color-text)",
              }}
            />
          </div>

          <h2
            className="text-sm mb-3"
            style={{ color: "var(--color-secondary)" }}
          >
            Try these prompts
          </h2>

          <div className="space-y-2 text-left">
            {promptSuggestions.map((text, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(text)}
                className="w-full text-left rounded-lg p-3 text-sm transition-colors"
                style={{
                  backgroundColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-border)")
                }
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
