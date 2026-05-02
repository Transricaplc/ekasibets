import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface MatchRow {
  id: string;
  home_team: string;
  away_team: string;
  status: string;
  home_score: number;
  away_score: number;
  clock_minute: number | null;
  period: string | null;
}

const AdminMatchCentre = () => {
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [home, setHome] = useState(0);
  const [away, setAway] = useState(0);
  const [minute, setMinute] = useState<number | "">("");
  const [period, setPeriod] = useState("");
  const [eventType, setEventType] = useState("");
  const [team, setTeam] = useState("");
  const [player, setPlayer] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("matches")
      .select("id, home_team, away_team, status, home_score, away_score, clock_minute, period")
      .in("status", ["scheduled", "live"])
      .order("start_time")
      .limit(50);
    setMatches((data as MatchRow[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const m = matches.find((x) => x.id === selected);
    if (m) {
      setHome(m.home_score ?? 0);
      setAway(m.away_score ?? 0);
      setMinute(m.clock_minute ?? "");
      setPeriod(m.period ?? "");
    }
  }, [selected, matches]);

  const submit = async () => {
    if (!selected) return toast.error("Select a match");
    setBusy(true);
    const { error } = await supabase.rpc("update_live_score", {
      _match_id: selected,
      _home_score: home,
      _away_score: away,
      _clock_minute: minute === "" ? null : Number(minute),
      _period: period || null,
      _event_type: eventType || null,
      _team: team || null,
      _player: player || null,
      _description: description || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Live update pushed");
    setEventType(""); setTeam(""); setPlayer(""); setDescription("");
    load();
  };

  return (
    <div className="card-premium p-6 space-y-4">
      <div>
        <h3 className="font-display text-xl">Match Centre Control</h3>
        <p className="text-xs text-muted-foreground">Push live scores and events. Updates broadcast in realtime.</p>
      </div>

      <div>
        <Label>Match</Label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full mt-1 bg-muted border border-border rounded-md px-3 py-2 text-sm"
        >
          <option value="">— Select —</option>
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              [{m.status}] {m.home_team} vs {m.away_team}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <Label>Home</Label>
          <Input type="number" value={home} onChange={(e) => setHome(Number(e.target.value))} />
        </div>
        <div>
          <Label>Away</Label>
          <Input type="number" value={away} onChange={(e) => setAway(Number(e.target.value))} />
        </div>
        <div>
          <Label>Minute</Label>
          <Input type="number" value={minute} onChange={(e) => setMinute(e.target.value === "" ? "" : Number(e.target.value))} />
        </div>
        <div>
          <Label>Period</Label>
          <Input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="1H / HT / 2H / FT" />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-xs uppercase text-muted-foreground mb-2">Optional event</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <Label>Type</Label>
            <Input value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="Goal / Yellow card" />
          </div>
          <div>
            <Label>Team</Label>
            <Input value={team} onChange={(e) => setTeam(e.target.value)} />
          </div>
          <div>
            <Label>Player</Label>
            <Input value={player} onChange={(e) => setPlayer(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
      </div>

      <Button onClick={submit} disabled={busy} className="btn-kasi">
        {busy ? "Pushing…" : "Push Live Update"}
      </Button>
    </div>
  );
};

export default AdminMatchCentre;
