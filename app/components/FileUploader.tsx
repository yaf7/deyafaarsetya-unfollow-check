"use client";

import { useCallback, useRef, useState } from "react";

interface FileUploaderProps {
  label: string;
  description: string;
  iconType: "followers" | "following";
  onFileLoaded: (data: string[][]) => void;
  isLoaded: boolean;
  count: number;
}

export default function FileUploader({
  label,
  description,
  iconType,
  onFileLoaded,
  isLoaded,
  count,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          // Instagram data format: array of objects with string_list_data
          let usernames: string[][] = [];
          if (Array.isArray(json)) {
            usernames = json.map((item: Record<string, unknown>) => {
              const data = (
                item.string_list_data as Array<{
                  value?: string;
                  href?: string;
                }>
              )?.[0];
              return [data?.value || "", data?.href || ""];
            });
          } else if (json.relationships_following) {
            usernames = json.relationships_following.map(
              (item: Record<string, unknown>) => {
                const data = (
                  item.string_list_data as Array<{
                    value?: string;
                    href?: string;
                  }>
                )?.[0];
                return [data?.value || "", data?.href || ""];
              }
            );
          } else if (json.relationships_followers) {
            usernames = json.relationships_followers.map(
              (item: Record<string, unknown>) => {
                const data = (
                  item.string_list_data as Array<{
                    value?: string;
                    href?: string;
                  }>
                )?.[0];
                return [data?.value || "", data?.href || ""];
              }
            );
          }
          onFileLoaded(usernames.filter((u) => u[0]));
        } catch {
          alert("Format file tidak valid. Pastikan file JSON dari Instagram.");
        }
      };
      reader.readAsText(file);
    },
    [onFileLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const FollowersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isLoaded ? "var(--success)" : "var(--text-secondary)" }}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const FollowingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isLoaded ? "var(--success)" : "var(--text-secondary)" }}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );

  return (
    <div
      className={`upload-zone ${isLoaded ? "active" : ""} ${dragOver ? "drag-over" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
        {/* Icon */}
        <div className="icon-wrapper">
          {iconType === "followers" ? <FollowersIcon /> : <FollowingIcon />}
        </div>

        {/* Label */}
        <p
          className="font-semibold"
          style={{
            fontSize: "0.9375rem",
            color: isLoaded ? "var(--success)" : "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {isLoaded ? `✓ ${fileName}` : label}
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: "0.8125rem",
            color: isLoaded ? "rgba(52, 211, 153, 0.6)" : "var(--text-tertiary)",
            lineHeight: 1.4,
          }}
        >
          {isLoaded ? (
            <>
              <span style={{ 
                fontWeight: 600, 
                color: "var(--success)",
                fontSize: "1.125rem",
              }}>
                {count.toLocaleString()}
              </span>{" "}
              akun terdeteksi
            </>
          ) : (
            description
          )}
        </p>
      </div>
    </div>
  );
}
