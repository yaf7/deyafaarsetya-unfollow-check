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

/**
 * Extracts username from an Instagram data item.
 * Handles multiple Instagram export formats:
 * - string_list_data[0].value (most common)
 * - title field (fallback when string_list_data is empty or value is "")
 * - href field parsing as last resort
 */
function extractUsername(item: Record<string, unknown>): [string, string] {
  const stringListData = item.string_list_data as
    | Array<{ value?: string; href?: string; timestamp?: number }>
    | undefined;

  let username = "";
  let href = "";

  // Try string_list_data first
  if (Array.isArray(stringListData) && stringListData.length > 0) {
    const firstEntry = stringListData[0];
    username = (firstEntry?.value || "").trim();
    href = (firstEntry?.href || "").trim();
  }

  // Fallback: use 'title' field if username is still empty
  if (!username && typeof item.title === "string" && item.title.trim()) {
    username = item.title.trim();
  }

  // Fallback: try to extract username from href
  if (!username && href) {
    const match = href.match(/instagram\.com\/([^/?#]+)/);
    if (match) {
      username = match[1];
    }
  }

  // Build href from username if not present
  if (username && !href) {
    href = `https://www.instagram.com/${username}`;
  }

  return [username, href];
}

/**
 * Extracts the data array from various Instagram JSON export formats.
 * Handles: plain arrays, relationships_following, relationships_followers,
 * and any other top-level key containing an array of objects with string_list_data.
 */
function extractDataArray(json: unknown): Record<string, unknown>[] {
  // Format 1: Direct array (common for followers_1.json)
  if (Array.isArray(json)) {
    return json;
  }

  // Format 2: Object with known keys
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;

    // Check known Instagram keys first
    if (Array.isArray(obj.relationships_following)) {
      return obj.relationships_following;
    }
    if (Array.isArray(obj.relationships_followers)) {
      return obj.relationships_followers;
    }

    // Fallback: find ANY key that contains an array of objects with string_list_data or title
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (Array.isArray(val) && val.length > 0) {
        const first = val[0];
        if (
          first &&
          typeof first === "object" &&
          ("string_list_data" in first || "title" in first)
        ) {
          console.log(`[UnfollowCheck] Found data under key: "${key}"`);
          return val;
        }
      }
    }
  }

  return [];
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

          // Extract the data array from whatever format the JSON is in
          const dataArray = extractDataArray(json);

          // Parse each item to extract username and href
          const usernames: string[][] = dataArray
            .map((item) => extractUsername(item))
            .filter(([username]) => username.length > 0);

          // Debug logging
          console.log(`[UnfollowCheck] File: ${file.name}`);
          console.log(`[UnfollowCheck] Raw items found: ${dataArray.length}`);
          console.log(`[UnfollowCheck] Valid usernames: ${usernames.length}`);
          if (usernames.length > 0) {
            console.log(
              `[UnfollowCheck] First 5 usernames:`,
              usernames.slice(0, 5).map(([u]) => u)
            );
          }
          if (dataArray.length > 0 && usernames.length === 0) {
            console.warn(
              `[UnfollowCheck] WARNING: Items found but no usernames extracted!`
            );
            console.warn(
              `[UnfollowCheck] Sample item:`,
              JSON.stringify(dataArray[0], null, 2)
            );
          }

          onFileLoaded(usernames);
        } catch (err) {
          console.error("[UnfollowCheck] Parse error:", err);
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
