import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resultStyles } from "../../assets/dummyStyles";

const Badge = ({ percent }) => {
    if (percent >= 85)
        return <span className={resultStyles.badgeExcellent}>Excellent</span>;
    if (percent >= 65)
        return <span className={resultStyles.badgeGood}>Good</span>;
    if (percent >= 45)
        return <span className={resultStyles.badgeAverage}>Average</span>;
    return <span className={resultStyles.badgeNeedsWork}>Needs Work</span>;
};

export default function MyResultPage({ apiBase = "http://localhost:4000" }) {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTechnology, setSelectedTechnology] = useState("all");
    const [technologies, setTechnologies] = useState([]);

    const getAuthHeader = useCallback(() => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("authToken") ||
            null;
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    useEffect(() => {
        let mounted = true;
        const fetchResults = async (tech = "all") => {
            setLoading(true);
            setError(null);
            try {
                const q =
                    tech && tech.toLowerCase() !== "all"
                        ? `?technology=${encodeURIComponent(tech)}`
                        : "";
                const res = await axios.get(`${apiBase}/api/results${q}`, {
                    headers: { "Content-Type": "application/json", ...getAuthHeader() },
                    timeout: 10000,
                });
                if (!mounted) return;
                if (res.status === 200 && res.data && res.data.success) {
                    setResults(Array.isArray(res.data.results) ? res.data.results : []);
                } else {
                    setResults([]);
                    toast.warn("Unexpected server response while fetching results.");
                }
            } catch (err) {
                console.error(
                    "Failed to fetch results:",
                    err?.response?.data || err.message || err
                );
                if (!mounted) return;
                if (err?.response?.status === 401) {
                    setError("Not authenticated. Please log in to view results.");
                    toast.error("Not authenticated. Please login.");
                } else {
                    setError("Could not load results from server.");
                    toast.error("Could not load results from server.");
                    setResults([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchResults(selectedTechnology);
        return () => {
            mounted = false;
        };
    }, [apiBase, selectedTechnology, getAuthHeader]);

    useEffect(() => {
        let mounted = true;
        const fetchAllForTechList = async () => {
            try {
                const res = await axios.get(`${apiBase}/api/results`, {
                    headers: { "Content-Type": "application/json", ...getAuthHeader() },
                    timeout: 10000,
                });
                if (!mounted) return;
                if (res.status === 200 && res.data && res.data.success) {
                    const all = Array.isArray(res.data.results) ? res.data.results : [];
                    const set = new Set();
                    all.forEach((r) => {
                        if (r.technology) set.add(r.technology);
                    });
                    const arr = Array.from(set).sort((a, b) => a.localeCompare(b));
                    console.log(arr);

                    setTechnologies(arr);
                } else {
                    // leave technologies empty (will still show "All")
                }
            } catch (err) {
                // silent — no need to block main UI; log for debug
                console.error(
                    "Failed to fetch technologies:",
                    err?.response?.data || err.message || err
                );
            }
        };
        fetchAllForTechList();
        return () => {
            mounted = false;
        };
    }, [apiBase, getAuthHeader]);

    const makeKey = (r) => {
        if (!r) return "unknown-" + Math.random();
        if (r._id) return r._id;
        return `${r.id || "unknown"}-${r.title || "untitled"}-${Math.random().toString(36).substring(2, 9)}`;
    };

    const summary = useMemo(() => {
        // Ensure results is an array, otherwise use empty array
        const source = Array.isArray(results) ? results : [];
        
        // Calculate total questions with safety checks
        const totalQs = source.reduce(
            (s, r) => {
                if (!r) return s; // Skip null/undefined items
                const questions = Number(r.totalQuestions);
                return s + (isNaN(questions) ? 0 : questions);
            },
            0
        );
        
        // Calculate total correct answers with safety checks
        const totalCorrect = source.reduce(
            (s, r) => {
                if (!r) return s; // Skip null/undefined items
                const correct = Number(r.correct);
                return s + (isNaN(correct) ? 0 : correct);
            },
            0
        );
        
        // Calculate total wrong answers with safety checks
        const totalWrong = source.reduce(
            (s, r) => {
                if (!r) return s; // Skip null/undefined items
                const wrong = Number(r.wrong);
                return s + (isNaN(wrong) ? 0 : wrong);
            }, 
            0
        );
        
        // Calculate percentage with division by zero protection
        const pct = totalQs > 0 ? Math.round((totalCorrect / totalQs) * 100) : 0;
        
        return { totalQs, totalCorrect, totalWrong, pct };
    }, [results]);

    const grouped = useMemo(() => {
        const src = Array.isArray(results) ? results : [];
        const map = {};
        
        if (src.length === 0) {
            return map; // Return empty object if no results
        }
        
        src.forEach((r) => {
            if (!r) return; // Skip null/undefined items
            
            // Extract track name from title or use "General" as fallback
            const title = r.title || "";
            const track = title.split(" ")[0] || "General";
            
            // Initialize array for this track if it doesn't exist
            if (!map[track]) map[track] = [];
            
            // Add result to appropriate track
            map[track].push(r);
        });
        
        // If we somehow ended up with no tracks, add a "General" track
        if (Object.keys(map).length === 0 && src.length > 0) {
            map["General"] = src;
        }
        
        return map;
    }, [results]);

    const handleSelectTech = (tech) => {
        setSelectedTechnology(tech || "all");
    };

    return (
        <div className={resultStyles.pageContainer}>
            <div className={resultStyles.container}>
                <header className={resultStyles.header}>
                    <div>
                        <h1 className={resultStyles.title}>Quiz Results</h1>
                    </div>

                    <div className={resultStyles.headerControls}>
                        {/* optional controls could be added here */}
                    </div>
                </header>

                {/* Technology filter buttons */}
                <div className={resultStyles.filterContainer}>
                    <div className={resultStyles.filterContent}>
                        <div className={resultStyles.filterButtons}>
                            <span className={resultStyles.filterLabel}>Filter by tech:</span>

                            {/* All button */}
                            <button
                                onClick={() => handleSelectTech("all")}
                                className={`${resultStyles.filterButton} ${
                                    selectedTechnology === "all"
                                        ? resultStyles.filterButtonActive
                                        : resultStyles.filterButtonInactive
                                }`}
                                aria-pressed={selectedTechnology === "all"}
                            >
                                All
                            </button>

                            {/* dynamic technology buttons */}
                            {technologies.map((tech) => (
                                <button
                                    key={tech}
                                    onClick={() => handleSelectTech(tech)}
                                    className={`${resultStyles.filterButton} ${
                                        selectedTechnology === tech
                                            ? resultStyles.filterButtonActive
                                            : resultStyles.filterButtonInactive
                                    }`}
                                    aria-pressed={selectedTechnology === tech}
                                >
                                    {tech}
                                </button>
                            ))}

                            {/* If we don't yet have technologies but results exist, derive from current results */}
                            {technologies.length === 0 &&
                                Array.isArray(results) &&
                                results.length > 0 &&
                                [
                                    ...new Set(results.map((r) => r.technology).filter(Boolean)),
                                ].map((tech) => (
                                    <button
                                        key={`fallback-${tech}`}
                                        onClick={() => handleSelectTech(tech)}
                                        className={`${resultStyles.filterButton} ${
                                            selectedTechnology === tech
                                                ? resultStyles.filterButtonActive
                                                : resultStyles.filterButtonInactive
                                        }`}
                                        aria-pressed={selectedTechnology === tech}
                                    >
                                        {tech}
                                    </button>
                                ))}
                        </div>

                        <div className={resultStyles.filterStatus}>
                            {selectedTechnology === "all"
                                ? "Showing all technologies"
                                : `Filtering: ${selectedTechnology}`}
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className={resultStyles.errorContainer}>
                        <div className={resultStyles.errorIcon}>⚠️</div>
                        <div className={resultStyles.errorMessage}>{error}</div>
                    </div>
                ) : loading ? (
                    <div className={resultStyles.loadingContainer}>
                        <div className={resultStyles.loadingSpinner} />
                        <div className={resultStyles.loadingText}>Loading results...</div>
                    </div>
                ) : (
                    <>
                        {/* Summary Section */}
                        {Array.isArray(results) && results.length > 0 && (
                            <section className={resultStyles.summarySection}>
                                <h2 className={resultStyles.summaryTitle}>Overall Performance</h2>
                                <div className={resultStyles.summaryStats}>
                                    <div className={resultStyles.summaryStat}>
                                        <div className={resultStyles.summaryValue}>{summary.totalQs}</div>
                                        <div className={resultStyles.summaryLabel}>Total Questions</div>
                                    </div>
                                    <div className={resultStyles.summaryStat}>
                                        <div className={resultStyles.summaryValue}>{summary.totalCorrect}</div>
                                        <div className={resultStyles.summaryLabel}>Correct Answers</div>
                                    </div>
                                    <div className={resultStyles.summaryStat}>
                                        <div className={resultStyles.summaryValue}>{summary.totalWrong}</div>
                                        <div className={resultStyles.summaryLabel}>Wrong Answers</div>
                                    </div>
                                    <div className={resultStyles.summaryStat}>
                                        <div className={resultStyles.summaryValue}>{summary.pct}%</div>
                                        <div className={resultStyles.summaryLabel}>Overall Score</div>
                                    </div>
                                </div>
                                <div className={resultStyles.summaryBadge}>
                                    <Badge percent={summary.pct} />
                                </div>
                            </section>
                        )}

                        {Object.entries(grouped).map(([track, items]) => (
                            <section key={track} className={resultStyles.trackSection}>
                                <h2 className={resultStyles.trackTitle}>{track} Track</h2>

                                <div className={resultStyles.resultsGrid}>
                                    {items.map((r) => (
                                        <StripCard key={makeKey(r)} item={r} />
                                    ))}
                                </div>
                            </section>
                        ))}

                        {/* fallback when no results at all */}
                        {Array.isArray(results) && results.length === 0 && (
                            <div className={resultStyles.emptyState}>
                                <div className={resultStyles.emptyStateIcon}>📋</div>
                                <div className={resultStyles.emptyStateMessage}>
                                    No results found{selectedTechnology !== "all" ? ` for ${selectedTechnology}` : ""}.
                                </div>
                                <div className={resultStyles.emptyStateSubtext}>
                                    {selectedTechnology !== "all" 
                                        ? "Try selecting a different technology or 'All'"
                                        : "Take a quiz to see your results here"}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

/* --------------------- StripCard component --------------------- */
function StripCard({ item }) {
    if (!item) return null;
    
    const percent = item.totalQuestions
        ? Math.round((Number(item.correct || 0) / Number(item.totalQuestions)) * 100)
        : 0;

    const getLevel = (it) => {
        if (!it) return { letter: "A", style: resultStyles.levelAdvanced };
        
        const id = ((it.id || "") + "").toLowerCase();
        const title = ((it.title || "") + "").toLowerCase();
        if (id.includes("basic") || title.includes(" basic"))
            return { letter: "B", style: resultStyles.levelBasic };
        if (id.includes("intermediate") || title.includes(" intermediate"))
            return { letter: "I", style: resultStyles.levelIntermediate };
        return { letter: "A", style: resultStyles.levelAdvanced };
    };

    const level = getLevel(item);

    return (
        <article className={resultStyles.card}>
            <div className={resultStyles.cardAccent}></div>

            <div className={resultStyles.cardContent}>
                <div className={resultStyles.cardHeader}>
                    <div className={resultStyles.cardInfo}>
                        {/* avatar shows level letter (B / I / A) */}
                        <div className={`${resultStyles.levelAvatar} ${level.style}`}>
                            {level.letter}
                        </div>
                        <div className={resultStyles.cardText}>
                            <h3 className={resultStyles.cardTitle}>{item.title || "Untitled Quiz"}</h3>
                            <div className={resultStyles.cardMeta}>
                                {item.totalQuestions || 0} Qs
                                {item.timeSpent ? ` • ${item.timeSpent}` : ""}
                            </div>
                        </div>
                    </div>

                    <div className={resultStyles.cardPerformance}>
                        <div className={resultStyles.performanceLabel}>Performance</div>
                        <div className={resultStyles.badgeContainer}>
                            <Badge percent={percent} />
                        </div>
                    </div>
                </div>

                <div className={resultStyles.cardStats}>
                    <div className={resultStyles.statItem}>
                        Correct:{" "}
                        <span className={resultStyles.statNumber}>{item.correct || 0}</span>
                    </div>
                    <div className={resultStyles.statItem}>
                        Wrong: <span className={resultStyles.statNumber}>{item.wrong || 0}</span>
                    </div>
                    <div className={resultStyles.statItem}>
                        Score: <span className={resultStyles.statNumber}>{percent}%</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
