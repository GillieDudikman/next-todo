"use client"

import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DesktopIcon, MoonIcon, SunIcon} from "@radix-ui/react-icons";

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if(!mounted) return null;
    return(
       <Tabs defaultValue={theme}>
           <TabsList className="border dark:border-neutral-800 dark:bg-[#030303]">
               <TabsTrigger onClick={e => setTheme("light")} value="light"><SunIcon className="h-[1.2rem] w-[1.2rem]"/>
               </TabsTrigger>
               <TabsTrigger onClick={e => setTheme("dark")} value="dark"><MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-90
               transition-all dark:rotate-0"/>
               </TabsTrigger>
               <TabsTrigger onClick={e => setTheme("system")} value="system"><DesktopIcon className="h-[1.2rem] w-[1.2rem]"/>
               </TabsTrigger>
           </TabsList>
       </Tabs>
    )
}
export default ThemeSwitcher