"use client";

import { InboxIcon, PanelLeftIcon } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";
import { VisibilitySelector, type VisibilityType } from "./visibility-selector";
import { InboxModal } from "./inbox-modal";

function PureChatHeader({
  chatId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [inboxOpen, setInboxOpen] = useState(false);

  if (state === "collapsed" && !isMobile) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 flex h-14 items-center gap-2 bg-sidebar px-3">
        <Button
          className="md:hidden"
          onClick={toggleSidebar}
          size="icon-sm"
          variant="ghost"
        >
          <PanelLeftIcon className="size-4" />
        </Button>

        {/* Demo badge */}
        <Badge variant="destructive" className="text-xs font-medium px-2 py-0.5">
          DEMO
        </Badge>

        {!isReadonly && (
          <VisibilitySelector
            chatId={chatId}
            selectedVisibilityType={selectedVisibilityType}
          />
        )}

        <Button
          variant="ghost"
          className="ml-auto flex items-center gap-2 text-sm"
          onClick={() => setInboxOpen(true)}
        >
          <InboxIcon className="size-4" />
          <span className="hidden sm:inline">Inbox</span>
        </Button>
      </header>
      <InboxModal open={inboxOpen} onOpenChange={setInboxOpen} />
    </>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
