"use client"

import { useState } from "react"
import { Tooltip, UnstyledButton, Stack, rem, Modal, Group, ColorSwatch, Text, Popover } from "@mantine/core"
import {
    IconHome2,
    IconSearch,
    IconInfoCircle,
    IconPalette,
    IconArrowRight,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppTheme, ThemeName } from "@/lib/ThemeContext"
import { AboutModal } from "./AboutModal"

interface NavbarLinkProps {
    icon: typeof IconHome2
    label: string
    active?: boolean
    onClick?(): void
    href?: string
}

function SidebarLink({ icon: Icon, label, active, onClick, href }: NavbarLinkProps) {
    const content = (
        <UnstyledButton
            onClick={onClick}
            className={`w-10 h-10 flex items-center justify-center transition-all duration-200 rounded-lg`}
            style={{
                backgroundColor: active ? 'var(--primary)' : 'transparent',
                color: active ? 'var(--background)' : 'var(--foreground)',
                opacity: active ? 1 : 0.6,
            }}
        >
            <Icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
        </UnstyledButton>
    )

    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            {href ? (
                <Link href={href}>
                    {content}
                </Link>
            ) : content}
        </Tooltip>
    )
}

const THEMES: { name: ThemeName; label: string; color: string }[] = [
    { name: "light", label: "Light", color: "#ffffff" },
    { name: "dark", label: "Dark", color: "#1a1a1a" },
    { name: "cyberpunk", label: "Cyberpunk", color: "#f3f303" },
    { name: "matrix", label: "Matrix", color: "#00ff41" },
    { name: "gameboy", label: "GameBoy", color: "#9bbc0f" },
    { name: "retro", label: "Retro", color: "#ffb000" },
    { name: "arch", label: "Arch", color: "#1793d1" },
    { name: "dracula", label: "Dracula", color: "#bd93f9" },
]

export function SiteSidebar() {
    const pathname = usePathname()
    const { theme, setTheme } = useAppTheme()
    const [aboutOpened, setAboutOpened] = useState(false)

    const openSearch = () => {
        window.dispatchEvent(new KeyboardEvent("keydown", {
            key: "f",
            shiftKey: true,
            metaKey: true,
            bubbles: true
        }))
    }

    return (
        <>
            <nav
                className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] py-4 px-2 backdrop-blur-md shadow-xl hidden md:block"
                style={{
                    backgroundColor: 'rgba(var(--background-rgb), 0.8)',
                    border: 'var(--border)',
                    borderRadius: 'var(--radius)',
                }}
            >
                <Stack justify="center" gap="xs">
                    <SidebarLink
                        icon={IconHome2}
                        label="Home"
                        href="/"
                        active={pathname === "/"}
                    />
                    <SidebarLink
                        icon={IconSearch}
                        label="Search (⌘⇧F)"
                        onClick={openSearch}
                    />

                    <Popover position="right" withArrow shadow="md" radius="md">
                        <Popover.Target>
                            <UnstyledButton className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 transition-all">
                                <IconPalette style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
                            </UnstyledButton>
                        </Popover.Target>
                        <Popover.Dropdown
                            p="xs"
                            style={{
                                backgroundColor: 'var(--background)',
                                border: 'var(--border)',
                                borderRadius: 'var(--radius)',
                                fontFamily: 'var(--font-main)',
                            }}
                        >
                            <Text size="xs" fw={700} mb="xs" c="dimmed" tt="uppercase" lts="1px" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Select Theme</Text>
                            <div className="grid grid-cols-4 gap-2">
                                {THEMES.map((t) => (
                                    <Tooltip key={t.name} label={t.label} position="top">
                                        <UnstyledButton
                                            onClick={() => setTheme(t.name)}
                                            className={`p-1 rounded-md transition-all ${theme === t.name ? 'scale-110' : 'hover:bg-white/5'}`}
                                            style={{ backgroundColor: theme === t.name ? 'var(--primary)' : 'transparent' }}
                                        >
                                            <ColorSwatch color={t.color} size={20} />
                                        </UnstyledButton>
                                    </Tooltip>
                                ))}
                            </div>
                        </Popover.Dropdown>
                    </Popover>

                    <SidebarLink
                        icon={IconInfoCircle}
                        label="About"
                        onClick={() => setAboutOpened(true)}
                    />
                </Stack>
            </nav>

            <AboutModal opened={aboutOpened} onClose={() => setAboutOpened(false)} />

            {/* Mobile Bottom Bar */}
            <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] py-2 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-xl flex md:hidden gap-6 items-center">
                <Link href="/" className={pathname === "/" ? "text-primary" : "text-gray-500"}>
                    <IconHome2 size={24} stroke={1.5} />
                </Link>
                <UnstyledButton onClick={openSearch} className="text-gray-500">
                    <IconSearch size={22} stroke={1.5} />
                </UnstyledButton>
                <UnstyledButton onClick={() => setAboutOpened(true)} className="text-gray-500">
                    <IconInfoCircle size={22} stroke={1.5} />
                </UnstyledButton>
            </nav>
        </>
    )
}
