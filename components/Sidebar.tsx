"use client";

import { HiHomeModern } from "react-icons/hi2";
import { VscSearchFuzzy } from "react-icons/vsc";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";

import SidebarItem from "./SidebarItem";
import Box from "./Box";
import Library from "./Library";
import { useMemo } from "react";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar = ({ children, songs }: SidebarProps) => {
  const pathname = usePathname();
  const player = usePlayer();

  const routes = useMemo(() => [
    {
      icon: HiHomeModern,
      label: 'Home',
      active: pathname !== '/search',
      href: '/'
    },
    {
      icon: VscSearchFuzzy,
      label: 'Search',
      href: '/search',
      active: pathname === '/search'
    },
  ], [pathname]);

  return (
    <div
      className={twMerge(`
        flex 
        h-full
        `,
        player.activeId && 'h-[calc(100%-80px)]'
      )}
    >
      <div
        className="
          hidden 
          md:flex 
          flex-col 
          gap-y-2 
          bg-gray-950 
          h-full 
          w-[300px] 
          p-2
        "
      >
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs} />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
}

export default Sidebar;