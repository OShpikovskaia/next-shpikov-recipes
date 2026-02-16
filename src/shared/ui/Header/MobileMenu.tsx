import Link from 'next/link';
import { Button } from '@heroui/button';
import { NavbarMenu, NavbarMenuItem } from '@heroui/navbar';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';

import type { SessionStatus } from '@/shared/model/auth-status';
import { AUTH_STATUS } from '@/shared/model/auth-status';

import type { NavItem } from './types';
import { isIngredients } from './utils/isIngredients';

function MobileMenu({
  navItems,
  isAuth,
  activePath,
  status,
  userEmail,
  onSignout,
  onOpenLogin,
  onOpenSignup,
  closeMenu,
}: {
  navItems: readonly NavItem[];
  isAuth: boolean;
  activePath: string;
  status: SessionStatus;
  userEmail?: string | null;
  onSignout: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  closeMenu: () => void;
}) {
  const isLoading = status === AUTH_STATUS.LOADING;

  return (
    <NavbarMenu className="pt-6">
      {navItems.map((item) => {
        const active = activePath === item.href;
        const disabled = isIngredients(item.href) && !isAuth;

        return (
          <NavbarMenuItem key={item.href}>
            {disabled ? (
              <span className="block cursor-not-allowed px-4 py-3 text-base font-medium text-white/35 select-none">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                onClick={closeMenu}
                className={clsx(
                  'block rounded-xl px-4 py-3 text-base font-medium transition-colors',
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-white/85 hover:bg-white/10 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            )}
          </NavbarMenuItem>
        );
      })}

      <div className="my-4 border-t border-gray-100" />

      <div className="px-2">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        ) : isAuth ? (
          <div className="flex flex-col gap-3">
            <span className="max-w-65 truncate text-sm text-gray-500">
              Logged in as <span className="font-medium text-slate-900">{userEmail}</span>
            </span>
            <Button
              size="sm"
              variant="flat"
              onPress={onSignout}
              className="self-start bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200"
            >
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              size="md"
              variant="flat"
              onPress={() => {
                closeMenu();
                onOpenLogin();
              }}
            >
              Login
            </Button>
            <Button
              size="md"
              color="primary"
              onPress={() => {
                closeMenu();
                onOpenSignup();
              }}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </NavbarMenu>
  );
}

export default MobileMenu;
