import * as React from "react";
import {UserAvatar} from "@/components/custom/UserAvatar.tsx";
import {clsx} from "clsx";
import {UserStatus} from "@/types/UserStatus.ts";

interface UserAvatarWithStatusProps extends React.ComponentProps<typeof UserAvatar> {
  status: UserStatus
}

export function UserAvatarWithStatus({status, ...props}: UserAvatarWithStatusProps) {
  const statusColor = {
    online: "bg-green-500",
    offline: "bg-gray-400"
  }

  return (
    <div className={`relative h-10 w-10`}>
      <UserAvatar {...props} />
      <span
        className={clsx(
          "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-background",
          statusColor[status]
        )}
      />
    </div>
  )
}
