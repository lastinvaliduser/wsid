"use client"

import { useState } from "react"
import { Tooltip, UnstyledButton, Stack, rem, Group, ColorSwatch, Text, Popover } from "@mantine/core"
import {
    IconHome2, IconSearch, IconInfoCircle, IconPalette, IconDeviceLaptop,
    IconCode, IconBinary, IconTerminal, IconCpu, IconActivity,
    IconLayersIntersect, IconWaveSawTool, IconDeviceGamepad2, IconTrophy,
    IconCoin, IconGhost, IconShieldSearch, IconCommand, IconSettings,
    IconWriting, IconBrush, IconColorPicker, IconNotebook, IconMicrophone2,
    IconMusic, IconDisc, IconBolt, IconTerminal2, IconHeart
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppTheme, ThemeName } from "@/lib/ThemeContext"
import { AboutModal } from "./AboutModal"

/**
 * THEME CONFIGURATION
 * --------------------------------------------------------------------------
 */
const THEMES: { name: ThemeName; label: string; color: string }[] = [
    { name: "light", label: "Light", color: "#ffffff" },
    { name: "dark", label: "Dark", color: "#1a1a1a" },
    { name: "dracula", label: "Dracula", color: "#bd93f9" },
    { name: "sketch", label: "Sketchpad", color: "#0984e3" },
    { name: "cyberpunk", label: "Cyberpunk", color: "#f3f303" },
    { name: "matrix", label: "Matrix", color: "#00ff41" },
    { name: "gameboy", label: "GameBoy", color: "#9bbc0f" },
    { name: "mario", label: "Super Mario", color: "#ff0000" },
    { name: "terminal", label: "Terminal", color: "#ffb000" },
    { name: "kali", label: "Kali Linux", color: "#2facff" },
    { name: "linkinpark", label: "Linkin Park", color: "#e01e37" },
    { name: "adele", label: "Adele", color: "#000000" },
]

/**
 * ICON MAPPING LOGIC
 * Returns a set of contextually relevant icons based on the active theme.
 */
const getThemeIcons = (theme: ThemeName) => {
    const base = { Home: IconHome2, Search: IconSearch, Theme: IconPalette, About: IconInfoCircle }

    switch (theme) {
        case "matrix":
            return { ...base, Home: IconDeviceLaptop, Search: IconCode, Theme: IconBinary, About: IconTerminal }
        case "cyberpunk":
            return { ...base, Home: IconCpu, Search: IconActivity, Theme: IconLayersIntersect, About: IconWaveSawTool }
        case "gameboy":
        case "mario":
            return { ...base, Home: IconDeviceGamepad2, Search: IconTrophy, Theme: IconCoin, About: IconGhost }
        case "kali":
            return { ...base, Home: IconTerminal, Search: IconShieldSearch, Theme: IconCommand, About: IconSettings }
        case "sketch":
            return { ...base, Home: IconWriting, Search: IconBrush, Theme: IconColorPicker, About: IconNotebook }
        case "linkinpark":
            return { ...base, Home: IconMicrophone2, Search: IconMusic, Theme: IconDisc, About: IconBolt }
        case "terminal":
            return { ...base, Home: IconTerminal2, Search: IconCode, Theme: IconBinary, About: IconTerminal }
        case "adele":
            return { ...base, Home: IconMusic, Search: IconSearch, Theme: IconDisc, About: IconMicrophone2 }
        default:
            return base
    }
}

/**
 * SUB-COMPONENT: SidebarLink
 * A unified link/button for the sidebar with tooltip support.
 */
interface SidebarLinkProps {
    icon: any
    label: string
    active?: boolean
    onClick?(): void
    href?: string
    style?: React.CSSProperties
    size?: number
}

function SidebarLink({ icon: Icon, label, active, onClick, href, style, size = 22 }: SidebarLinkProps) {
    const content = (
        <UnstyledButton
            onClick={onClick}
            className="w-10 h-10 flex items-center justify-center transition-all duration-200 rounded-lg group"
            style={{
                backgroundColor: active ? 'var(--primary)' : 'transparent',
                color: active ? 'var(--background)' : 'var(--foreground)',
                opacity: active ? 1 : 0.6,
                ...style
            }}
        >
            <Icon style={{ width: rem(size), height: rem(size) }} stroke={1.5} className="group-hover:scale-110 transition-transform" />
        </UnstyledButton>
    )

    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }} hidden={!label}>
            {href ? <Link href={href}>{content}</Link> : content}
        </Tooltip>
    )
}

/**
 * SUB-COMPONENT: ThemePickerContent
 * Shared UI for theme selection in both desktop and mobile popovers.
 */
const ThemePickerContent = ({ current, onSelect }: { current: string, onSelect: (n: ThemeName) => void }) => (
    <div className="p-2" style={{ fontFamily: 'var(--font-main)' }}>
        <Text size="xs" fw={700} mb="xs" c="dimmed" tt="uppercase" lts="1px" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
            Select Theme
        </Text>
        <div className="grid grid-cols-4 gap-2">
            {THEMES.map((t) => (
                <Tooltip key={t.name} label={t.label} position="top">
                    <UnstyledButton
                        onClick={() => onSelect(t.name)}
                        className={`p-1 rounded-md transition-all ${current === t.name ? 'scale-110' : 'hover:bg-white/10'}`}
                        style={{
                            backgroundColor: current === t.name ? 'var(--primary)' : 'transparent',
                            border: '1px solid rgba(128, 128, 128, 0.2)'
                        }}
                    >
                        <ColorSwatch
                            color={t.color}
                            size={20}
                            style={{ border: '1px solid rgba(128, 128, 128, 0.2)' }}
                        />
                    </UnstyledButton>
                </Tooltip>
            ))}
        </div>
    </div>
)

/**
 * MAIN COMPONENT: SiteSidebar
 * Responsive navigation system with theme-reactive icons and styles.
 */
export function SiteSidebar() {
    const pathname = usePathname()
    const { theme, setTheme } = useAppTheme()
    const [aboutOpened, setAboutOpened] = useState(false)
    const icons = getThemeIcons(theme)

    // Trigger universal search (Spotlight)
    const openSearch = () => {
        window.dispatchEvent(new KeyboardEvent("keydown", {
            key: "f", shiftKey: true, metaKey: true, bubbles: true
        }))
    }

    const commonPopoverProps = {
        shadow: "md",
        radius: "md",
        styles: {
            dropdown: {
                backgroundColor: 'var(--background)',
                border: 'var(--border)',
                borderRadius: 'var(--radius)',
            }
        }
    }

    return (
        <>
            {/* Desktop Navigation (Left Sidebar) */}
            <nav
                className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] py-4 px-2 backdrop-blur-md shadow-xl hidden md:block"
                style={{
                    backgroundColor: 'rgba(var(--background-rgb), 0.8)',
                    border: 'var(--border)',
                    borderRadius: 'var(--radius)',
                }}
            >
                <Stack justify="center" gap="xs">
                    <SidebarLink icon={icons.Home} label="Home" href="/" active={pathname === "/"} />
                    <SidebarLink icon={icons.Search} label="Search (⌘⇧F)" onClick={openSearch} />

                    <Popover position="right" withArrow {...commonPopoverProps}>
                        <Popover.Target>
                            <UnstyledButton className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 transition-all" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                                <icons.Theme style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
                            </UnstyledButton>
                        </Popover.Target>
                        <Popover.Dropdown p={0}>
                            <ThemePickerContent current={theme} onSelect={setTheme} />
                        </Popover.Dropdown>
                    </Popover>

                    <SidebarLink icon={icons.About} label="About" onClick={() => setAboutOpened(true)} />
                </Stack>
            </nav>

            {/* Mobile Navigation (Bottom Bar) */}
            <nav
                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] py-2 px-6 backdrop-blur-md shadow-xl flex md:hidden gap-8 items-center"
                style={{
                    backgroundColor: 'rgba(var(--background-rgb), 0.8)',
                    border: 'var(--border)',
                    borderRadius: '100px', // Iconic pill shape for mobile
                }}
            >
                <Link href="/" className="transition-all" style={{ color: pathname === "/" ? "var(--primary)" : "var(--foreground)", opacity: pathname === "/" ? 1 : 0.6 }}>
                    <icons.Home size={24} stroke={1.5} />
                </Link>

                <UnstyledButton onClick={openSearch} className="transition-all" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                    <icons.Search size={22} stroke={1.5} />
                </UnstyledButton>

                <Popover position="top" withArrow {...commonPopoverProps}>
                    <Popover.Target>
                        <UnstyledButton className="transition-all" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                            <icons.Theme size={22} stroke={1.5} />
                        </UnstyledButton>
                    </Popover.Target>
                    <Popover.Dropdown p={0} style={{ marginBottom: '10px' }}>
                        <ThemePickerContent current={theme} onSelect={setTheme} />
                    </Popover.Dropdown>
                </Popover>

                <UnstyledButton onClick={() => setAboutOpened(true)} className="transition-all" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                    <icons.About size={22} stroke={1.5} />
                </UnstyledButton>
            </nav>

            <AboutModal opened={aboutOpened} onClose={() => setAboutOpened(false)} />
        </>
    )
}
