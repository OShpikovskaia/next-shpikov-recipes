import Link from 'next/link';
import { NavbarContent, NavbarItem } from '@heroui/navbar';
import clsx from 'clsx';

import type { NavItem } from './types';
import { isIngredients } from './utils/isIngredients';

function DesktopNav({
  navItems,
  isAuth,
  activePath,
}: {
  navItems: readonly NavItem[];
  isAuth: boolean;
  activePath: string;
}) {
  return (
    <NavbarContent className="hidden gap-2 sm:flex" justify="center">
      {navItems.map((item) => {
        const active = activePath === item.href;
        const disabled = isIngredients(item.href) && !isAuth;

        return (
          <NavbarItem key={item.href} className="px-0">
            {disabled ? (
              <span
                aria-disabled="true"
                title="Login to access Ingredients"
                className="cursor-not-allowed rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-slate-400 select-none"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={clsx(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'hover:bg-primary-soft hover:text-primary text-slate-700',
                )}
              >
                {item.label}
              </Link>
            )}
          </NavbarItem>
        );
      })}
    </NavbarContent>
  );
}

export default DesktopNav;
