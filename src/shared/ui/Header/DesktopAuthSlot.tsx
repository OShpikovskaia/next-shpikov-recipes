import { Button } from '@heroui/button';
import { NavbarItem } from '@heroui/navbar';
import { Skeleton } from '@heroui/skeleton';

import type { SessionStatus } from '@/shared/model/auth-status';
import { AUTH_STATUS } from '@/shared/model/auth-status';

function DesktopAuthSlot({
  status,
  isAuth,
  userEmail,
  onSignout,
  onOpenLogin,
  onOpenSignup,
}: {
  status: SessionStatus;
  isAuth: boolean;
  userEmail?: string | null;
  onSignout: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}) {
  const isLoading = status === AUTH_STATUS.LOADING;

  return (
    <div className="hidden min-w-[320px] items-center justify-end gap-3 sm:flex">
      {isLoading ? (
        <>
          <Skeleton className="h-4 w-44 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </>
      ) : isAuth ? (
        <>
          <span className="max-w-50 truncate text-xs text-gray-500">
            Hello,&nbsp;<span className="font-medium text-slate-900">{userEmail}</span>!
          </span>
          <NavbarItem className="flex">
            <Button
              size="sm"
              variant="flat"
              className="bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200"
              onPress={onSignout}
            >
              Sign out
            </Button>
          </NavbarItem>
        </>
      ) : (
        <>
          <NavbarItem className="flex">
            <Button variant="flat" size="sm" onPress={onOpenLogin}>
              Login
            </Button>
          </NavbarItem>
          <NavbarItem className="flex">
            <Button color="primary" size="sm" onPress={onOpenSignup}>
              Sign up
            </Button>
          </NavbarItem>
        </>
      )}
    </div>
  );
}

export default DesktopAuthSlot;
