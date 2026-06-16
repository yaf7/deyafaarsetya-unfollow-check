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
    "linear-gradient(135deg, #7000ff, #2979ff)",
    "linear-gradient(135deg, #2979ff, #00e5ff)",
    "linear-gradient(135deg, #00e5ff, #d500f9)",
    "linear-gradient(135deg, #d500f9, #00b0ff)",
    "linear-gradient(135deg, #00b0ff, #5851DB)",
    "linear-gradient(135deg, #405DE6, #5851DB)",
  ];

  const unfollowRate = followingCount > 0
    ? ((unfollowers.length / followingCount) * 100).toFixed(1)
    : "0";

  const mutualRate = followingCount > 0
    ? (((followingCount - unfollowers.length) / followingCount) * 100).toFixed(1)
    : "100";

  const handleExportPDF = () => {
    const today = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const tableRows = unfollowers.map(([u, h], i) => `
      <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
        <td class="center text-muted">${i + 1}</td>
        <td class="bold text-dark">@${u}</td>
        <td><a href="${h || `https://instagram.com/${u}`}" class="link" target="_blank">${h || `https://instagram.com/${u}`}</a></td>
      </tr>
    `).join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Unfollowers - Unfollytics</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
            
            :root {
              --primary: #00e5ff;
              --primary-dark: #00b0ff;
              --secondary: #7000ff;
              --text-main: #1e293b;
              --text-muted: #64748b;
              --border: #e2e8f0;
            }

            body { 
              font-family: 'Inter', sans-serif; 
              padding: 40px; 
              color: var(--text-main); 
              background-color: #ffffff;
              line-height: 1.6;
            }

            /* --- Header Styling --- */
            .report-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-bottom: 3px solid var(--primary);
              padding-bottom: 24px;
              margin-bottom: 32px;
            }

            .brand {
              font-family: 'Outfit', sans-serif;
              display: flex;
              align-items: center;
              gap: 16px;
            }

            .brand-logo {
              width: 56px;
              height: auto;
              object-fit: contain;
            }

            .brand-title {
              font-size: 32px;
              font-weight: 800;
              color: var(--text-main);
              margin: 0 0 4px 0;
              letter-spacing: -1px;
            }

            .brand-subtitle {
              font-size: 13px;
              font-weight: 600;
              color: var(--secondary);
              text-transform: uppercase;
              letter-spacing: 1.5px;
            }

            .report-meta {
              text-align: right;
            }

            .meta-date {
              font-size: 13px;
              color: var(--text-muted);
              font-weight: 500;
              margin-bottom: 8px;
            }

            .badge {
              display: inline-block;
              background-color: #f1f5f9;
              color: var(--text-main);
              padding: 6px 12px;
              border-radius: 8px;
              font-size: 12px;
              font-weight: 600;
              border: 1px solid var(--border);
            }

            /* --- Table Styling --- */
            table { 
              width: 100%; 
              border-collapse: separate; 
              border-spacing: 0;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid var(--border);
            }

            th, td {
              padding: 14px 16px;
              text-align: left;
              border-bottom: 1px solid var(--border);
              font-size: 13px;
            }

            th { 
              background-color: #f8fafc; 
              font-family: 'Outfit', sans-serif;
              font-weight: 600; 
              color: var(--text-main); 
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }

            tr:last-child td {
              border-bottom: none;
            }

            .even { background-color: #ffffff; }
            .odd { background-color: #fcfcfd; }

            /* --- Typography Utils --- */
            .center { text-align: center; }
            .bold { font-weight: 600; }
            .text-dark { color: #0f172a; }
            .text-muted { color: var(--text-muted); }
            .link { color: var(--primary-dark); text-decoration: none; font-weight: 500; }

            /* --- Footer --- */
            .report-footer {
              margin-top: 40px;
              text-align: center;
              font-size: 11px;
              color: var(--text-muted);
              padding-top: 20px;
              border-top: 1px dashed var(--border);
            }

            /* --- Print Optimizations --- */
            @media print {
              @page { margin: 15mm; size: A4 portrait; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 0; }
              .report-header { border-bottom-color: var(--primary) !important; }
              a.link { color: var(--primary-dark) !important; }
              th { background-color: #f8fafc !important; }
            }
          </style>
        </head>
        <body>
          
          <div class="report-header">
            <div class="brand">
              <img src="${window.location.origin}/Unfollytics_logo.png" class="brand-logo" alt="Logo" />
              <div>
                <h1 class="brand-title">Unfollytics</h1>
                <div class="brand-subtitle">by Deyafa Arsetya</div>
              </div>
            </div>
            <div class="report-meta">
              <div class="meta-date">${today}</div>
              <div class="badge">Total: ${unfollowers.length} Akun</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th class="center" style="width: 60px;">No</th>
                <th style="width: 35%;">Username Instagram</th>
                <th>Tautan Profil</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="report-footer">
            Dokumen ini digenerate secara otomatis oleh Unfollytics pada ${today}. <br>
            Privasi Terjamin &bull; 100% Aman &bull; Proses Lokal
          </div>

          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500); // give time for Google Fonts to load
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fade-in" style={{ marginTop: "0.5rem" }}>

      {/* ── Summary Hero Card ── */}
      <div
        style={{
          position: "relative",
          borderRadius: "var(--radius-lg)",
          background: "linear-gradient(165deg, rgba(0, 229, 255, 0.08), rgba(213, 0, 249, 0.04), rgba(255,255,255,0.02))",
          border: "1px solid rgba(0, 229, 255, 0.12)",
          padding: "2rem",
          marginBottom: "1.5rem",
          overflow: "hidden",
        }}
      >
        {/* Top edge reflection */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent 5%, rgba(0, 229, 255, 0.25) 50%, transparent 95%)",
        }} />
        {/* Inner glow */}
        <div style={{
          position: "absolute", top: "-60%", right: "-20%", width: "400px", height: "400px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(0, 229, 255, 0.06) 0%, transparent 70%)",
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
                boxShadow: "0 0 12px rgba(0, 229, 255, 0.3)",
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
          onClick={handleExportPDF}
          style={{ borderColor: "rgba(0, 229, 255, 0.15)", color: "var(--accent-1)" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Export PDF
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
                background: "linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(213, 0, 249, 0.06))",
                border: "1px solid rgba(0, 229, 255, 0.15)",
                borderRadius: "10px",
                textDecoration: "none",
                flexShrink: 0,
                transition: "all 0.25s ease",
                letterSpacing: "0.01em",
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(0, 229, 255, 0.18), rgba(213, 0, 249, 0.1))";
                (e.target as HTMLElement).style.borderColor = "rgba(0, 229, 255, 0.3)";
                (e.target as HTMLElement).style.transform = "scale(1.04)";
                (e.target as HTMLElement).style.boxShadow = "0 4px 12px rgba(0, 229, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(213, 0, 249, 0.06))";
                (e.target as HTMLElement).style.borderColor = "rgba(0, 229, 255, 0.15)";
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
