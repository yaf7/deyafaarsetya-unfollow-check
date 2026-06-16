"use client";

import { useState, useCallback } from "react";
import FileUploader from "./components/FileUploader";
import ResultList from "./components/ResultList";

export default function Home() {
  const [followers, setFollowers] = useState<string[][] | null>(null);
  const [following, setFollowing] = useState<string[][] | null>(null);
  const [unfollowers, setUnfollowers] = useState<string[][] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheck = useCallback(() => {
    if (!followers || !following) return;
    setIsProcessing(true);

    setTimeout(() => {
      // Normalize usernames: trim whitespace, lowercase, remove leading @
      const normalize = (username: string) =>
        username.trim().toLowerCase().replace(/^@/, "");

      const followerSet = new Set(
        followers.map(([u]) => normalize(u))
      );

      const result = following.filter(
        ([u]) => !followerSet.has(normalize(u))
      );

      // Debug logging
      console.log("=== UnfollowCheck Analysis ===");
      console.log(`Followers count: ${followers.length}`);
      console.log(`Following count: ${following.length}`);
      console.log(`Follower Set size: ${followerSet.size}`);
      console.log(`Unfollowers found: ${result.length}`);
      if (result.length > 0) {
        console.log(
          "First 10 unfollowers:",
          result.slice(0, 10).map(([u]) => u)
        );
      }
      if (followers.length > 0) {
        console.log(
          "Sample followers (first 5):",
          followers.slice(0, 5).map(([u]) => u)
        );
      }
      if (following.length > 0) {
        console.log(
          "Sample following (first 5):",
          following.slice(0, 5).map(([u]) => u)
        );
      }
      console.log("==============================");

      setUnfollowers(result);
      setIsProcessing(false);
    }, 1000);
  }, [followers, following]);

  const handleReset = () => {
    setFollowers(null);
    setFollowing(null);
    setUnfollowers(null);
  };

  const bothLoaded = followers && following;

  return (
    <>
      {/* Background layers */}
      <div className="bg-mesh" />
      <div className="bg-orb" />
      <div className="grain-overlay" />

      <div
        className="relative z-10 flex flex-col min-h-screen"
        style={{ padding: "0 1.25rem" }}
      >
        {/* Navigation bar */}
        <nav
          className="fade-in"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "800px",
            width: "100%",
            margin: "0 auto",
            padding: "1.25rem 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            {/* Mini logo */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: "var(--accent-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 12px rgba(0, 229, 255, 0.2)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="17" y1="11" x2="23" y2="11" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "-0.02em" }}>
              UnfollowCheck
            </span>
          </div>
          <div className="badge badge-privacy">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            100% PRIVAT
          </div>
        </nav>

        {/* Main content */}
        <main
          style={{
            maxWidth: "800px",
            width: "100%",
            margin: "0 auto",
            flex: 1,
            paddingBottom: "3rem",
          }}
        >
          {!unfollowers ? (
            <>
              {/* Hero section */}
              <section
                className="fade-in"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  paddingTop: "3.5rem",
                  paddingBottom: "1.5rem",
                }}
              >
                {/* Premium Badge */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  marginBottom: "2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}>
                  <span style={{ fontSize: "0.875rem" }}>✨</span>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase"
                  }}>
                    Aman & 100% Lokal
                  </span>
                </div>

                {/* Main Typography */}
                <h1
                  style={{
                    fontSize: "clamp(2.5rem, 7vw, 4rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    marginBottom: "1.25rem",
                    color: "var(--text-primary)",
                  }}
                >
                  Ketahui Siapa Yang <br />
                  <span className="gradient-text-animated" style={{ padding: "0 0.2em" }}>
                    Tidak Follow Back
                  </span>
                </h1>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
                    maxWidth: "520px",
                    margin: "0 auto",
                    lineHeight: 1.6,
                    letterSpacing: "-0.01em",
                    marginBottom: "2rem",
                  }}
                >
                  Alat analisis audiens paling aman. Tidak perlu login, tidak ada risiko banned. Semua data diproses langsung di perangkat kamu.
                </p>

                {/* Trust Signals */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1.5rem",
                  color: "var(--text-tertiary)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    <span>Anti-Banned</span>
                  </div>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "currentColor", opacity: 0.5 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></svg>
                    <span>Tanpa Server</span>
                  </div>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "currentColor", opacity: 0.5 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <span>Hitungan Detik</span>
                  </div>
                </div>
              </section>

              {/* Decorative separator */}
              <div style={{
                height: "1px",
                width: "100%",
                background: "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent)",
                margin: "1rem 0 2rem 0",
              }} />

              {/* Upload section */}
              <div
                className="fade-in fade-in-delay-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1rem",
                  marginTop: "2.5rem",
                }}
              >
                <FileUploader
                  label="followers.json"
                  description="Drag & drop atau klik untuk memilih"
                  iconType="followers"
                  onFileLoaded={setFollowers}
                  isLoaded={!!followers}
                  count={followers?.length || 0}
                />
                <FileUploader
                  label="following.json"
                  description="Drag & drop atau klik untuk memilih"
                  iconType="following"
                  onFileLoaded={setFollowing}
                  isLoaded={!!following}
                  count={following?.length || 0}
                />
              </div>

              {/* Action button */}
              <div
                className="fade-in fade-in-delay-2"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                <button
                  className={`btn-primary ${bothLoaded ? "pulse-glow" : ""}`}
                  disabled={!bothLoaded || isProcessing}
                  onClick={handleCheck}
                  style={{ minWidth: "240px" }}
                >
                  {isProcessing ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem" }}>
                      <span className="spinner" />
                      Menganalisis...
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      Analisis Sekarang
                    </span>
                  )}
                </button>
              </div>

              <div className="divider fade-in fade-in-delay-3" style={{ marginTop: "2.5rem", marginBottom: "2rem" }} />

              {/* How-to guide */}
              <div
                className="glass-card fade-in fade-in-delay-3"
                style={{ padding: "1.75rem 2rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(213, 0, 249, 0.05))",
                    border: "1px solid rgba(0, 229, 255, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      Cara Mendapatkan File JSON dari Instagram
                    </h2>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "2px" }}>
                      6 langkah mudah untuk mengekspor data
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    {
                      title: "Buka Pusat Akun (Accounts Center)",
                      text: <>Buka aplikasi Instagram → Masuk ke menu <strong style={{ color: "var(--text-primary)" }}>Pengaturan (Settings)</strong> → Pilih <strong style={{ color: "var(--text-primary)" }}>Accounts Center</strong> → <strong style={{ color: "var(--text-primary)" }}>Your information and permissions</strong> → <strong style={{ color: "var(--text-primary)" }}>Download your information</strong>.</>,
                    },
                    {
                      title: "Buat Permintaan Ekspor",
                      text: <>Ketuk tombol <strong style={{ color: "var(--text-primary)" }}>Download or transfer information</strong>, pilih <strong style={{ color: "var(--text-primary)" }}>Export to device</strong>, lalu pilih akun Instagram yang ingin Anda periksa.</>,
                    },
                    {
                      title: "Pilih Informasi Spesifik",
                      text: <>Pada halaman berikutnya, pilih opsi <strong style={{ color: "var(--text-primary)" }}>Specific types of information</strong> untuk mempercepat proses penarikan data.</>,
                    },
                    {
                      title: "Filter Data Pengikut",
                      text: <>Ketuk tulisan <strong style={{ color: "var(--text-primary)" }}>Clear all</strong> di sudut kanan untuk menghapus pilihan otomatis. Gulir ke bawah ke bagian <strong style={{ color: "var(--text-primary)" }}>Connections</strong>, lalu centang HANYA pada opsi <strong style={{ color: "var(--text-primary)" }}>Followers and following</strong>. Ketuk <strong style={{ color: "var(--text-primary)" }}>Lanjut (Next)</strong>.</>,
                    },
                    {
                      title: "Konfigurasi Format (Sangat Penting)",
                      text: <>Sebelum menekan tombol ekspor, pastikan Anda mengubah dua pengaturan ini: <strong style={{ color: "var(--text-primary)" }}>Date range → All time</strong> dan <strong style={{ color: "var(--text-primary)" }}>Format → JSON</strong> (Sistem tidak dapat membaca format HTML). Setelah sesuai, ketuk <strong style={{ color: "var(--text-primary)" }}>Start export</strong>.</>,
                    },
                    {
                      title: "Unduh, Ekstrak, dan Unggah",
                      text: <>Sistem Meta membutuhkan waktu 5-15 menit untuk menyiapkan data. Setelah menerima notifikasi email, unduh file berformat <strong style={{ color: "var(--text-primary)" }}>.zip</strong> tersebut. Ekstrak file, lalu unggah dokumen <strong style={{ color: "var(--text-primary)" }}>followers_1.json</strong> dan <strong style={{ color: "var(--text-primary)" }}>following.json</strong> ke sistem kami.</>,
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "0.875rem",
                        alignItems: "flex-start",
                        padding: "1rem 0",
                        borderTop: i > 0 ? "1px solid rgba(255,255,255,0.03)" : "none",
                      }}
                    >
                      <div style={{
                        width: "28px",
                        height: "28px",
                        minWidth: "28px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, rgba(0, 229, 255, 0.12), rgba(213, 0, 249, 0.08))",
                        border: "1px solid rgba(0, 229, 255, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--accent-1)",
                        marginTop: "2px",
                      }}>
                        {i + 1}
                      </div>
                      <div>
                        <p style={{
                          color: "var(--text-primary)",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          marginBottom: "4px",
                          letterSpacing: "-0.01em",
                        }}>
                          {step.title}
                        </p>
                        <p style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.8125rem",
                          lineHeight: 1.65,
                        }}>
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="glass-card fade-in fade-in-delay-3"
                style={{ padding: "1.75rem 2rem", marginTop: "1.5rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(213, 0, 249, 0.05))",
                    border: "1px solid rgba(0, 229, 255, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <div>
                    <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      Cara Menggunakan Aplikasi Ini
                    </h2>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "2px" }}>
                      3 langkah cepat cek unfollowers
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    {
                      title: "Temukan File JSON",
                      text: <>Buka folder hasil ekstrak data Instagram Anda. Cari file bernama <strong style={{ color: "var(--text-primary)" }}>followers_1.json</strong> dan <strong style={{ color: "var(--text-primary)" }}>following.json</strong>. Abaikan file lainnya.</>,
                    },
                    {
                      title: "Drag & Drop",
                      text: <>Seret dan lepas (drag & drop) file <strong style={{ color: "var(--text-primary)" }}>followers_1.json</strong> ke kotak sebelah kiri. Lakukan hal yang sama untuk file <strong style={{ color: "var(--text-primary)" }}>following.json</strong> ke kotak sebelah kanan. Anda juga bisa mengklik kotak untuk memilih file secara manual.</>,
                    },
                    {
                      title: "Jalankan Pemindai",
                      text: <>Klik tombol gradasi <strong style={{ color: "var(--text-primary)" }}>Analisis Sekarang</strong>. Sistem akan langsung membandingkan kedua data tersebut dalam hitungan detik tanpa perlu loading server.</>,
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "0.875rem",
                        alignItems: "flex-start",
                        padding: "1rem 0",
                        borderTop: i > 0 ? "1px solid rgba(255,255,255,0.03)" : "none",
                      }}
                    >
                      <div style={{
                        width: "28px",
                        height: "28px",
                        minWidth: "28px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, rgba(0, 229, 255, 0.12), rgba(213, 0, 249, 0.08))",
                        border: "1px solid rgba(0, 229, 255, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--accent-1)",
                        marginTop: "2px",
                      }}>
                        {i + 1}
                      </div>
                      <div>
                        <p style={{
                          color: "var(--text-primary)",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          marginBottom: "4px",
                          letterSpacing: "-0.01em",
                        }}>
                          {step.title}
                        </p>
                        <p style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.8125rem",
                          lineHeight: 1.65,
                        }}>
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div
                className="fade-in fade-in-delay-4"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                }}
              >
                {[
                  { icon: "🔒", title: "Privat & Aman", desc: "Data tidak keluar dari browser" },
                  { icon: "⚡", title: "Instan", desc: "Hasil dalam hitungan detik" },
                  { icon: "🆓", title: "Gratis", desc: "Tanpa login, tanpa batas" },
                ].map((f) => (
                  <div
                    key={f.title}
                    style={{
                      textAlign: "center",
                      padding: "1.25rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-1)",
                      border: "1px solid var(--card-border)",
                    }}
                  >
                    <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{f.icon}</p>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{f.title}</p>
                    <p style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)", lineHeight: 1.4 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Results header */}
              <div
                className="fade-in"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "2rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px",
                    background: "linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(213, 0, 249, 0.06))",
                    border: "1px solid rgba(0, 229, 255, 0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.02em",
                    }}>
                      Hasil Analisis
                    </h2>
                    <p style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Diproses lokal di browser kamu
                    </p>
                  </div>
                </div>
                <button className="btn-secondary" onClick={handleReset}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M8 16H3v5" />
                    </svg>
                    Cek Ulang
                  </span>
                </button>
              </div>

              {unfollowers.length === 0 ? (
                <div
                  className="fade-in"
                  style={{
                    position: "relative",
                    padding: "4rem 2rem",
                    textAlign: "center",
                    marginTop: "1rem",
                    borderRadius: "var(--radius-lg)",
                    background: "linear-gradient(165deg, rgba(52, 211, 153, 0.06), rgba(52, 211, 153, 0.02), rgba(255,255,255,0.02))",
                    border: "1px solid rgba(52, 211, 153, 0.15)",
                    overflow: "hidden",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                    background: "linear-gradient(90deg, transparent 5%, rgba(52, 211, 153, 0.3) 50%, transparent 95%)",
                  }} />
                  <div style={{
                    position: "absolute", top: "-50%", left: "50%", width: "300px", height: "300px", transform: "translateX(-50%)",
                    borderRadius: "50%", background: "radial-gradient(circle, rgba(52, 211, 153, 0.08), transparent 70%)",
                    filter: "blur(40px)", pointerEvents: "none",
                  }} />
                  <p style={{ fontSize: "4rem", marginBottom: "1.25rem", position: "relative", zIndex: 1 }}>🎉</p>
                  <h3
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      marginBottom: "0.75rem",
                      letterSpacing: "-0.02em",
                      color: "var(--success)",
                      position: "relative", zIndex: 1,
                    }}
                  >
                    Semua Follow Back!
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "1rem", position: "relative", zIndex: 1, maxWidth: "360px", margin: "0 auto", lineHeight: 1.6 }}>
                    Semua orang yang kamu follow juga follow kamu balik. Mantap! 🙌
                  </p>
                </div>
              ) : (
                <ResultList
                  unfollowers={unfollowers}
                  followersCount={followers?.length || 0}
                  followingCount={following?.length || 0}
                />
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "1.5rem 1rem",
            color: "var(--text-tertiary)",
            fontSize: "0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            letterSpacing: "0.01em",
          }}
        >
          <p>
            Developed by Deyafa Arsetya
          </p>
        </footer>
      </div>
    </>
  );
}
