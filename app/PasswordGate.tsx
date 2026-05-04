"use client";

import { useEffect, useState } from "react";
import { wireOne } from "./fonts";

const STORAGE_KEY = "batu-site-unlocked";
const PASSWORD = "batubatu";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"pending" | "locked" | "unlocked">("pending");
  const [value, setValue] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    try {
      if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "true") {
        setStatus("unlocked");
      } else {
        setStatus("locked");
      }
    } catch {
      setStatus("locked");
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowError(false);
    if (value.trim() === PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "true");
      } catch {
        /* ignore */
      }
      setStatus("unlocked");
      setValue("");
    } else {
      setShowError(true);
      setValue("");
    }
  };

  if (status === "pending") {
    return (
      <div className="fixed inset-0 z-[100] min-h-screen bg-[#A74814]" aria-hidden />
    );
  }

  if (status === "unlocked") {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center bg-[#A74814] px-6">
      <form
        onSubmit={handleSubmit}
        className={`${wireOne.className} flex w-full max-w-[300px] flex-col items-center`}
      >
        <p className="mb-8 text-center text-[18px] uppercase leading-tight tracking-[0.08em] text-[#0222A0]/80">
          enter password
        </p>
        <label htmlFor="site-password" className="sr-only">
          Password
        </label>
        <input
          id="site-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowError(false);
          }}
          placeholder="password"
          className="w-full border-0 border-b border-[#0222A0]/90 bg-transparent px-1 pb-1 text-center text-[13px] uppercase tracking-[0.07em] text-[#0222A0] placeholder:text-[#0222A0]/60 focus:outline-none"
        />
        {showError && (
          <p className="mt-3 text-center text-[11px] uppercase tracking-[0.06em] text-[#0222A0]/80">
            incorrect password
          </p>
        )}
      </form>
    </div>
  );
}
