import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

const INTERVAL_MS = 30 * 60 * 1000; // 30 min

const SessionReminder = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [sessionStart] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!user) return;
    const id = setInterval(async () => {
      const { data } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();
      setBalance(data?.balance != null ? Number(data.balance) : 0);
      setOpen(true);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [user]);

  if (!user) return null;
  const minutes = Math.round((Date.now() - sessionStart) / 60000);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Clock className="text-primary" /> Reality Check
          </DialogTitle>
          <DialogDescription>
            You've been logged in for <strong>{minutes} minutes</strong>.
            {balance !== null && (
              <> Your current balance is <strong>R{balance.toFixed(2)}</strong>.</>
            )}
            <br />
            Take a break if you need to. Bet responsibly.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" asChild>
            <Link to="/responsible-gaming" onClick={() => setOpen(false)}>
              Set Limits
            </Link>
          </Button>
          <Button onClick={() => setOpen(false)}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionReminder;
