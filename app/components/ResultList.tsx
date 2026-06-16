"use client";

import { useState, useMemo } from "react";

interface ResultListProps {
  unfollowers: string[][];
  followersCount: number;
  followingCount: number;
}

export default function ResultList({ unfollowers, followersCount, followingCount }: ResultListProps) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    const list = unfollowers.filter(([username]) =>
      username.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a, b) =>
      sortAsc ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0])
    );
    return list;
  }, [unfollowers, search, sortAsc]);

  const colors = [
    "linear-gradient(135deg, #FCAF45, #F77737)",
    "linear-gradient(135deg, #F77737, #E1306C)",
    "linear-gradient(135deg, #E1306C, #C13584)",
    "linear-gradient(135deg, #C13584, #833AB4)",
    "linear-gradient(135deg, #833AB4, #5851DB)",
    "linear-gradient(135deg, #405DE6, #5851DB)",
  ];

  const unfollowRate = followingCount > 0 
    ? ((unfollowers.length / followingCount) * 100).toFixed(1) 
    : "0";

  const mutualRate = followingCount > 0
    ? (((followingCount - unfollowers.length) / followingCount) * 100).toFixed(1)
    : "100";

  const handleExportCSV = () => {
    const csv = "Username,Profile URL\n" + unfollowers.map(([u, h]) => 
      `${u},${h || `https://instagram.com/${u}`}`
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "unfollowers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in" style={{ marginTop: "0.5rem" }}>

      {/* ── Summary Hero Card ── */}
      <div
        style={{
          position: "relative",
          borderRadius: "var(--radius-lg)",
          background: "linear-gradient(165deg, rgba(225, 48, 108, 0.08), rgba(131, 58, 180, 0.04), rgba(255,255,255,0.02))",
          border: "1px solid rgba(225, 48, 108, 0.12)",
          padding: "2rem",
          marginBottom: "1.5rem",
          overflow: "hidden",
        }}
      >
        {/* Top edge reflection */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent 5%, rgba(225, 48, 108, 0.25) 50%, transparent 95%)",
        }} />
        {/* Inner glow */}
        <div style={{
          position: "absolute", top: "-60%", right: "-20%", width: "400px", height: "400px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(225, 48, 108, 0.06) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Big number + label */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <p style={{
              fontSize: "clamp(3rem, 8vw, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
            }}>
              {unfollowers.length.toLocaleString()}
            </p>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", fontWeight: 500 }}>
              akun tidak follow back kamu
            </p>
          </div>

          {/* 3-column stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.75rem",
          }}>
            {/* Followers stat */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              textAlign: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span style={{ fontSize: "0.625rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  Followers
                </span>
              </div>
              <p style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
                {followersCount.toLocaleString()}
              </p>
            </div>

            {/* Following stat */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              textAlign: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                <span style={{ fontSize: "0.625rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  Following
                </span>
              </div>
              <p style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
                {followingCount.toLocaleString()}
              </p>
            </div>

            {/* Mutual rate */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              textAlign: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span style={{ fontSize: "0.625rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  Mutual
                </span>
              </div>
              <p style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
                {mutualRate}%
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
                Unfollower rate
              </span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--accent-1)" }}>
                {unfollowRate}%
              </span>
            </div>
            <div style={{
              height: "6px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.04)",
              overflow: "hidden",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
            }}>
              <div style={{
                height: "100%",
                width: `${Math.min(parseFloat(unfollowRate), 100)}%`,
                borderRadius: "3px",
                background: "var(--accent-gradient)",
                transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 0 12px rgba(225, 48, 108, 0.3)",
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Search, Sort & Export Bar ── */}
      <div style={{
        display: "flex",
        gap: "0.625rem",
        marginBottom: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <svg
            style={{
              position: "absolute",
              left: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-tertiary)",
            }}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Cari username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-secondary" onClick={() => setSortAsc(!sortAsc)}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 8 4-4 4 4" />
              <path d="M7 4v16" />
              <path d="m21 16-4 4-4-4" />
              <path d="M17 20V4" />
            </svg>
            {sortAsc ? "A → Z" : "Z → A"}
          </span>
        </button>
        <button
          className="btn-secondary"
          onClick={handleExportCSV}
          style={{ borderColor: "rgba(225, 48, 108, 0.15)", color: "var(--accent-1)" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </span>
        </button>
      </div>

      {/* ── Results Count ── */}
      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--text-tertiary)",
          marginBottom: "1rem",
          letterSpacing: "0.02em",
        }}
      >
        Menampilkan {filtered.length} dari {unfollowers.length} akun
      </p>

      {/* ── Cards Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "0.625rem",
          maxHeight: "60vh",
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >
        {filtered.map(([username, href], i) => (
          <div
            key={username}
            className="result-card"
            style={{
              animationDelay: `${Math.min(i * 20, 400)}ms`,
              position: "relative",
            }}
          >
            {/* Subtle gradient overlay on hover */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "inherit",
              background: `linear-gradient(135deg, ${colors[i % colors.length].replace("linear-gradient(135deg, ", "").replace(")", "").split(",")[0].trim()}08, transparent)`,
              opacity: 0, transition: "opacity 0.3s ease", pointerEvents: "none",
            }} />
            
            {/* Avatar */}
            <div
              style={{
                width: "44px",
                height: "44px",
                minWidth: "44px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "white",
                textTransform: "uppercase",
                background: colors[i % colors.length],
                boxShadow: `0 4px 14px ${colors[i % colors.length].includes("FCAF45") ? "rgba(252,175,69,0.2)" : colors[i % colors.length].includes("E1306C") ? "rgba(225,48,108,0.2)" : "rgba(131,58,180,0.2)"}`,
                position: "relative",
                zIndex: 1,
              }}
            >
              {username[0]}
            </div>

            {/* User Info */}
            <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.01em",
                }}
              >
                @{username}
              </p>
              <p
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--text-tertiary)",
                  marginTop: "2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "var(--accent-1)", display: "inline-block",
                  opacity: 0.7,
                }} />
                Tidak follow back
              </p>
            </div>

            {/* Profile link */}
            <a
              href={href || `https://instagram.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "relative",
                zIndex: 1,
                padding: "7px 14px",
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "var(--accent-1)",
                background: "linear-gradient(135deg, rgba(225, 48, 108, 0.1), rgba(131, 58, 180, 0.06))",
                border: "1px solid rgba(225, 48, 108, 0.15)",
                borderRadius: "10px",
                textDecoration: "none",
                flexShrink: 0,
                transition: "all 0.25s ease",
                letterSpacing: "0.01em",
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(225, 48, 108, 0.18), rgba(131, 58, 180, 0.1))";
                (e.target as HTMLElement).style.borderColor = "rgba(225, 48, 108, 0.3)";
                (e.target as HTMLElement).style.transform = "scale(1.04)";
                (e.target as HTMLElement).style.boxShadow = "0 4px 12px rgba(225, 48, 108, 0.15)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(225, 48, 108, 0.1), rgba(131, 58, 180, 0.06))";
                (e.target as HTMLElement).style.borderColor = "rgba(225, 48, 108, 0.15)";
                (e.target as HTMLElement).style.transform = "scale(1)";
                (e.target as HTMLElement).style.boxShadow = "none";
              }}
            >
              Lihat Profil
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "3.5rem 1rem",
            color: "var(--text-tertiary)",
          }}
        >
          <p style={{ fontSize: "3rem", marginBottom: "0.75rem", opacity: 0.5 }}>🔍</p>
          <p style={{ fontSize: "0.9375rem", fontWeight: 500 }}>
            Tidak ada hasil untuk &quot;{search}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
