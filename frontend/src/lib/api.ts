// src/lib/api.ts

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export interface RiskBlock {
  station_id: string;
  District: string;
  Latitude: number;
  Longitude: number;
  risk_level: "high" | "moderate" | "low" | "unknown";
}

export interface Block {
  station_id: string;
  District: string;
  Latitude: number;
  Longitude: number;
}

export interface OnsetPrediction {
  station_id: string;
  region?: string;
  predicted_onset_date?: string;
  confidence_low?: string;
  confidence_high?: string;
  error?: string;
}

export interface BreakRisk {
  station_id: string;
  break_risk?: {
    score: number | null;
    level: "high" | "moderate" | "low" | "unknown";
    explanation: string;
  };
}

export interface Advisory {
  crop: string;
  break_risk_level: string;
  advisory_text: string;
  language: string;
  station_id?: string;
  onset?: OnsetPrediction;
  break_risk?: {
    score: number | null;
    level: string;
    explanation: string;
  };
}

export async function getBlocks(): Promise<Block[]> {
  const res = await fetch(`${API_BASE}/blocks`);
  if (!res.ok) {
    throw new Error(`Failed to fetch blocks: ${res.status}`);
  }
  return res.json();
}

export async function getRiskMap(): Promise<RiskBlock[]> {
  const res = await fetch(`${API_BASE}/blocks/risk-map`);
  if (!res.ok) {
    throw new Error(`Failed to fetch risk map: ${res.status}`);
  }
  return res.json();
}

export async function getOnsetPrediction(stationId: string): Promise<OnsetPrediction> {
  const res = await fetch(`${API_BASE}/predict/onset?station_id=${encodeURIComponent(stationId)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch onset prediction: ${res.status}`);
  }
  return res.json();
}

export async function getBreakRisk(stationId: string, asOfDay: number = 170): Promise<BreakRisk> {
  const res = await fetch(
    `${API_BASE}/predict/break-risk?station_id=${encodeURIComponent(stationId)}&as_of_day=${asOfDay}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch break risk: ${res.status}`);
  }
  return res.json();
}

export async function getAdvisory(
  stationId: string,
  crop: string = "paddy",
  language: string = "en"
): Promise<Advisory> {
  const res = await fetch(
    `${API_BASE}/advisory?station_id=${encodeURIComponent(stationId)}&crop=${encodeURIComponent(
      crop
    )}&language=${encodeURIComponent(language)}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch advisory: ${res.status}`);
  }
  return res.json();
}

export async function sendAdvisoryWhatsApp(
  stationId: string,
  crop: string,
  phoneNumber: string,
  language: string = "en"
): Promise<{ status: string; message_preview: string; would_send_to: string }> {
  const params = new URLSearchParams({
    station_id: stationId,
    crop,
    phone_number: phoneNumber,
    language,
  });
  const res = await fetch(`${API_BASE}/advisory/send?${params.toString()}`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to send advisory: ${res.status}`);
  }
  return res.json();
}

export function daysUntil(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;

  const now = new Date();
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = targetMidnight.getTime() - nowMidnight.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 0) {
    return diffDays;
  }

  // Fallback for historical/demo datasets (e.g. 2024 season pre-season reference day 120 / April 30)
  const startOfYear = new Date(target.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((targetMidnight.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const preSeasonEndDay = 120;
  const daysFromPreSeason = dayOfYear - preSeasonEndDay;
  return daysFromPreSeason > 0 ? daysFromPreSeason : Math.abs(diffDays);
}