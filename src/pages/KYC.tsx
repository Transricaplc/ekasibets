import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, CheckCircle2, Clock, FileText, Home, CreditCard, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type DocType = "id_document" | "proof_of_residence" | "bank_statement" | "selfie";

const DOC_META: Record<DocType, { label: string; desc: string; icon: any; required: boolean }> = {
  id_document: { label: "SA ID / Passport", desc: "Clear photo of both sides", icon: CreditCard, required: true },
  proof_of_residence: { label: "Proof of Residence", desc: "Utility bill, < 3 months old", icon: Home, required: true },
  selfie: { label: "Selfie with ID", desc: "Hold your ID next to your face", icon: User, required: true },
  bank_statement: { label: "Bank Statement (optional)", desc: "Required for withdrawals over R5,000", icon: FileText, required: false },
};

const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const KYC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<string>("pending");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from("profiles").select("kyc_status").eq("id", user.id).maybeSingle();
      if (p) setKycStatus(p.kyc_status);
      const { data: docs } = await supabase.from("kyc_documents").select("type").eq("user_id", user.id);
      const map: Record<string, boolean> = {};
      docs?.forEach((d: any) => (map[d.type] = true));
      setUploaded(map);
    })();
  }, [user]);

  const handleUpload = async (type: DocType, file: File) => {
    if (!user) return;
    if (file.size > MAX_BYTES) {
      toast.error("File too large (max 10 MB)");
      return;
    }
    setUploading(type);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${type}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("kyc-documents").upload(path, file, { upsert: false });
    if (upErr) {
      toast.error(upErr.message);
      setUploading(null);
      return;
    }
    const { error: dbErr } = await supabase.from("kyc_documents").insert({
      user_id: user.id,
      type,
      file_path: path,
    });
    if (dbErr) {
      toast.error(dbErr.message);
      setUploading(null);
      return;
    }
    setUploaded({ ...uploaded, [type]: true });
    toast.success(`${DOC_META[type].label} uploaded`);
    setUploading(null);
  };

  const submitForReview = async () => {
    const requiredDone = (["id_document", "proof_of_residence", "selfie"] as DocType[]).every((t) => uploaded[t]);
    if (!requiredDone) {
      toast.error("Upload all required documents first");
      return;
    }
    const { error } = await supabase.from("profiles").update({ kyc_status: "submitted" }).eq("id", user!.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Submitted for review! We'll notify you within 24 hours.");
    setKycStatus("submitted");
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  if (kycStatus === "verified") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="card-premium p-10">
          <CheckCircle2 className="text-success mx-auto mb-4" size={64} />
          <h1 className="font-display text-3xl mb-2">You're verified! 🎉</h1>
          <p className="text-muted-foreground mb-6">Withdrawals and full features are unlocked.</p>
          <Link to="/dashboard">
            <Button className="btn-kasi">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (kycStatus === "submitted") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="card-premium p-10">
          <Clock className="text-primary mx-auto mb-4" size={64} />
          <h1 className="font-display text-3xl mb-2">Under Review</h1>
          <p className="text-muted-foreground mb-6">
            We're checking your documents. You'll get an SMS within 24 hours.
          </p>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const requiredCount = 3;
  const doneCount = (["id_document", "proof_of_residence", "selfie"] as DocType[]).filter((t) => uploaded[t]).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl mb-2">FICA Verification</h1>
        <p className="text-muted-foreground">
          Required by South African law. Your data is encrypted and never shared.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(doneCount / requiredCount) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold">{doneCount}/{requiredCount}</span>
        </div>
      </div>

      <div className="space-y-4">
        {(Object.keys(DOC_META) as DocType[]).map((type) => {
          const meta = DOC_META[type];
          const Icon = meta.icon;
          const done = uploaded[type];
          return (
            <div key={type} className="card-premium p-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {done ? <CheckCircle2 /> : <Icon />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold">{meta.label}</h3>
                    {meta.required && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Required</span>}
                    {done && <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Uploaded</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{meta.desc}</p>
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept={ACCEPT}
                      className="hidden"
                      disabled={uploading === type}
                      onChange={(e) => e.target.files?.[0] && handleUpload(type, e.target.files[0])}
                    />
                    <span className="btn-ghost py-2 px-4 text-sm cursor-pointer inline-flex items-center gap-2">
                      <Upload size={14} />
                      {uploading === type ? "Uploading..." : done ? "Replace" : "Upload"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 sticky bottom-4">
        <Button
          onClick={submitForReview}
          disabled={doneCount < requiredCount}
          className="btn-kasi w-full py-6 text-base"
        >
          {doneCount < requiredCount
            ? `Upload ${requiredCount - doneCount} more document${requiredCount - doneCount === 1 ? "" : "s"}`
            : "Submit for Review"}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          By submitting you confirm the documents are genuine and belong to you.
        </p>
      </div>
    </div>
  );
};

export default KYC;
