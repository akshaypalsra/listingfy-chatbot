import React, { useState, useMemo } from "react";
import {
  Moon,
  Sun,
  Search,
  Download,
  Plus,
  Settings,
  Send,
} from "lucide-react";

type CandidateListingViewProps = {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
};

interface Candidate {
  id: string;
  name: string;
  title: string;
  skills: string[];
  matchScore: number;
  matchReason?: string;
  notes?: string;
}

const CandidateListingView: React.FC<CandidateListingViewProps> = ({
  darkMode,
  setDarkMode,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState("");

  const handleSearchQuery = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://api.carvia-test.org/vendors-ai-service/candidates/search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      setCandidates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = useMemo(() => {
    const q = localSearch.toLowerCase().trim();
    if (!q) return candidates;
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [localSearch, candidates]);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className={`min-h-screen flex transition-colors duration-300`}
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <Sidebar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onSearch={handleSearchQuery}
        />

        <main className="flex-1 p-8 transition-colors duration-300">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Talent Pool</h1>
              <p
                className="text-sm"
                style={{ color: "var(--color-secondary)" }}
              >
                Browse, filter, and connect with top candidates.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-secondary)",
                }}
              >
                <Download size={16} /> Export
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "#fff",
                }}
              >
                <Plus size={16} /> Add Candidate
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <div className="relative grow md:grow-0 md:w-1/3">
              <Search
                className="absolute left-3 top-3"
                style={{ color: "var(--color-secondary)" }}
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name, skill, or title..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>
          </div>

          {/* --- Shimmer Loading --- */}
          {loading && (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 border shadow-sm transition-colors"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-3 w-2/3">
                      <div className="h-5 w-1/3 rounded shimmer"></div>
                      <div className="h-4 w-1/2 rounded shimmer"></div>
                      <div className="flex gap-2 mt-3">
                        <div className="h-5 w-16 rounded-full shimmer"></div>
                        <div className="h-5 w-20 rounded-full shimmer"></div>
                        <div className="h-5 w-24 rounded-full shimmer"></div>
                      </div>
                    </div>
                    <div className="w-16 h-8 rounded shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- Error --- */}
          {error && (
            <div className="text-red-500 text-center py-4">Error: {error}</div>
          )}

          {/* --- Empty State --- */}
          {!loading && !error && filteredCandidates.length === 0 && (
            <div
              className="text-center py-10"
              style={{ color: "var(--color-secondary)" }}
            >
              No candidates found. Try a different search term.
            </div>
          )}

          {/* --- Candidate Cards --- */}
          {!loading && !error && filteredCandidates.length > 0 && (
            <div className="space-y-4">
              {filteredCandidates.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl p-5 shadow-sm border transition"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div>
                    <h3 className="font-semibold text-lg">{c.name}</h3>
                    <p
                      className="text-sm mb-1"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {c.title || "—"}
                    </p>
                    {c.matchReason && (
                      <p
                        className="text-sm mb-2"
                        style={{ color: "var(--color-secondary)" }}
                      >
                        {c.matchReason}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {c.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              darkMode === true
                                ? "rgba(37,99,235,0.15)"
                                : "rgba(37,99,235,0.1)",
                            color: "var(--color-primary)",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 text-right">
                    <div
                      className="text-lg font-bold"
                      style={{
                        color:
                          c.matchScore >= 85
                            ? "#22c55e"
                            : c.matchScore >= 75
                            ? "#eab308"
                            : "#ef4444",
                      }}
                    >
                      {c.matchScore ?? 0}%
                    </div>
                    <p
                      className="text-xs mb-2"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      Match Score
                    </p>
                    <button
                      className="px-4 py-1 rounded-lg text-sm font-medium border transition"
                      style={{
                        borderColor: "var(--color-primary)",
                        color: "var(--color-primary)",
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// --- Sidebar ---
const Sidebar: React.FC<{
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onSearch: (query: string) => void;
}> = ({ darkMode, setDarkMode, onSearch }) => {
  const [messages, setMessages] = useState<{ text: string; time: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [...prev, { text: input.trim(), time: timestamp }]);
    onSearch(input.trim());
    setInput("");
  };

  return (
    <aside
      className="w-96 flex flex-col h-screen border-r transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
        color: "var(--color-text)",
      }}
    >
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="text-base font-semibold">Search Candidates</h2>
        <button
          className="p-1.5 rounded-md transition-colors"
          style={{
            backgroundColor: "transparent",
            color: "var(--color-secondary)",
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex justify-end animate-fade-in-up">
            <div
              className="max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#fff",
              }}
            >
              <p>{msg.text}</p>
              <span className="block text-xs mt-1 text-right opacity-70">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        className="p-4 border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Describe your ideal candidate..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none border focus:ring-1 transition-colors"
            style={{
              backgroundColor: "var(--color-bg)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "#fff",
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="p-4 border-t flex gap-2"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--color-bg)",
            color: "var(--color-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          {darkMode ? "Light" : "Dark"}
        </button>

        <button
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--color-bg)",
            color: "var(--color-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Settings size={14} />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default CandidateListingView;
