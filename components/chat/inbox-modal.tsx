"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon, InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InboxMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  received_at: string;
  status: "unread" | "read" | "archived";
  ai_summary?: string;
  ai_response?: string;
}

interface InboxData {
  messages: InboxMessage[];
  created_at: string;
  version: string;
}

type FilterStatus = "all" | "unread" | "read" | "archived";

export function InboxModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [inboxData, setInboxData] = useState<InboxData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const fetchInbox = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/inbox");
      if (!res.ok) throw new Error("Failed to fetch inbox");
      const data = await res.json();
      setInboxData(data);
    } catch (err: any) {
      setError(err.message || "Error loading inbox");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchInbox();
    }
  }, [open]);

  const handleRefresh = () => {
    fetchInbox();
  };

  const filteredMessages = inboxData?.messages.filter((msg) => {
    if (filter === "all") return true;
    return msg.status === filter;
  }) ?? [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "unread":
        return "default" as const;
      case "read":
        return "secondary" as const;
      case "archived":
        return "outline" as const;
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <InboxIcon className="size-5" />
            Inbox
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCwIcon className={cn("size-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <div className="flex gap-2 ml-auto">
            {(["all", "unread", "read", "archived"] as FilterStatus[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCwIcon className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center text-destructive py-4">
            {error}
          </div>
        )}

        {!loading && !error && inboxData && (
          <div className="flex-1 overflow-y-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Sender</th>
                  <th className="text-left p-3 text-sm font-medium">Subject</th>
                  <th className="text-left p-3 text-sm font-medium">Date</th>
                  <th className="text-left p-3 text-sm font-medium">Status</th>
                  <th className="text-left p-3 text-sm font-medium">Preview</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((msg) => (
                    <tr key={msg.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-3 text-sm font-medium">{msg.sender}</td>
                      <td className="p-3 text-sm">{msg.subject}</td>
                      <td className="p-3 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(msg.received_at)}
                      </td>
                      <td className="p-3 text-sm">
                        <Badge variant={getStatusVariant(msg.status)} className="capitalize">
                          {msg.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground truncate max-w-xs">
                        {msg.body}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
