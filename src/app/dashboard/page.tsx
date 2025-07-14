"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Profile = { display_name: string; bio: string };
type StatPoint = { date: string; players: number };
type CombinedPoint = { date: string; history?: number; forecast?: number };

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    display_name: "",
    bio: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const at = params.get("access_token");
      const rt = params.get("refresh_token");
      if (at && rt) {
        supabaseBrowser.auth
          .setSession({ access_token: at, refresh_token: rt })
          .catch(console.error)
          .finally(() => {
            window.history.replaceState({}, "", window.location.pathname);
            setInitialized(true);
          });
        return;
      }
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      if (!session) return router.push("/login");
      setLoadingProfile(true);
      fetch("/api/profile")
        .then(async (res) => {
          if (res.status === 404) {
            setLoadingProfile(false);
            return;
          }
          if (!res.ok) throw new Error((await res.json()).error);
          const p = await res.json();
          setProfile({ display_name: p.display_name || "", bio: p.bio || "" });
        })
        .catch((err) => setErrorProfile(err.message))
        .finally(() => setLoadingProfile(false));
    });
  }, [initialized, router]);

  const [mapCode, setMapCode] = useState("");
  const [history, setHistory] = useState<StatPoint[] | null>(null);
  const [forecast, setForecast] = useState<StatPoint[] | null>(null);
  const [combined, setCombined] = useState<CombinedPoint[] | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [errorData, setErrorData] = useState<string>("");

  const loadData = async () => {
    setLoadingData(true);
    setErrorData("");
    try {
      const res = await fetch(`/api/fortnite/${mapCode}`);
      if (!res.ok) throw new Error("Stats fetch failed");
      const json = await res.json();
      const hist: StatPoint[] = json.history.slice(-30);
      setHistory(hist);

      const fcRes = await fetch(`/api/fortnite/${mapCode}/forecast`);
      if (!fcRes.ok) throw new Error("Forecast fetch failed");
      const fcJson = await fcRes.json();
      const fc: StatPoint[] = fcJson.forecast;
      setForecast(fc);

      const combinedData: CombinedPoint[] = [];
      hist.forEach((pt) =>
        combinedData.push({ date: pt.date, history: pt.players })
      );
      fc.forEach((pt) =>
        combinedData.push({ date: pt.date, forecast: pt.players })
      );
      setCombined(combinedData);
    } catch (err: any) {
      setErrorData(err.message);
      setHistory(null);
      setForecast(null);
      setCombined(null);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorProfile("");
    setLoadingProfile(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) {
      const err = await res.json();
      setErrorProfile(err.error);
    }
    setLoadingProfile(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {profile.display_name
            ? `Hi ${profile.display_name}`
            : "Your Dashboard"}
        </h1>
        <button onClick={handleLogout} className="text-red-500 hover:underline">
          Logout
        </button>
      </header>

      <section className=" p-6 rounded-lg">
        <h2 className="text-2xl mb-4">Your Profile</h2>
        {errorProfile && <p className="text-red-400">{errorProfile}</p>}
        {loadingProfile ? (
          <p>Loading profile…</p>
        ) : (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Display Name</label>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, display_name: e.target.value }))
                }
                className="w-full p-2 rounded-xl  text-black border-2 focus:outline-none focus:ring-0 "
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, bio: e.target.value }))
                }
                maxLength={200}
                rows={4}
                className="w-full p-2 rounded-xl  text-black focus:outline-none focus:ring-0 border-2"
              />
            </div>
            <button
              type="submit"
              disabled={loadingProfile}
              className="px-4 py-2  rounded-xl text-black border-2"
            >
              Save Profile
            </button>
          </form>
        )}
      </section>

      {/* Fortnite.gg Insights Section */}
      <section className=" p-6 rounded-lg">
        <h2 className="text-2xl mb-4">Fortnite.gg Insights</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter map code"
            value={mapCode}
            onChange={(e) => setMapCode(e.target.value)}
            className="flex-grow p-2 rounded  text-black border-2 focus:outline-none focus:ring-0"
          />
          <button
            disabled={!mapCode || loadingData}
            onClick={loadData}
            className="px-4 py-2 bg-green-600 rounded text-black"
          >
            {loadingData ? "Loading…" : "Load Data"}
          </button>
        </div>
        {errorData && <p className="text-red-400 mb-4">{errorData}</p>}
        {combined && (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={combined}
                margin={{ top: 20, right: 40, left: 0, bottom: 50 }}
              >
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  interval={5}
                  tick={{ fill: "#ccc", fontSize: 12 }}
                  height={60}
                />
                <YAxis tick={{ fill: "#ccc", fontSize: 12 }} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f1f1f",
                    borderColor: "#444",
                  }}
                  labelStyle={{ color: "#aaa" }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value) => [`${value} players`, "Players"]}
                />

                <Line
                  type="monotone"
                  dataKey="history"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />

                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
