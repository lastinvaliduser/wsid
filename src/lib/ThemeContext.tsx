"use client"

import { createContext, useContext, useEffect, useState } from "react"

/**
 * THEME TYPES & CONFIG
 * --------------------------------------------------------------------------
 */
export type ThemeName =
    | "light" | "dark" | "dracula"            // Modern
    | "cyberpunk" | "matrix" | "terminal"    // Geeky/Tech
    | "gameboy" | "mario"                   // Retro
    | "kali" | "sketch" | "linkinpark" | "adele" // Community/Artist

const VALID_THEMES: ThemeName[] = [
    "light", "dark", "dracula",
    "cyberpunk", "matrix", "terminal",
    "gameboy", "mario",
    "kali", "sketch", "linkinpark", "adele"
]

const LIGHT_THEMES: ThemeName[] = ["light", "sketch", "mario"]

interface ThemeContextType {
    theme: ThemeName
    setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * THEME PROVIDER
 * --------------------------------------------------------------------------
 * Manages theme state, persistence, and system synchronization (Mantine/HTML).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeName>("light")
    const [mounted, setMounted] = useState(false)

    /**
     * INITIALIZATION & MIGRATION
     * Runs once on mount to handle persistence and legacy theme names.
     */
    useEffect(() => {
        let savedTheme = localStorage.getItem("app-theme")

        // Handle theme renames from previous versions
        if (savedTheme === "retro") savedTheme = "terminal"
        if (savedTheme === "arch") savedTheme = "adele"

        if (savedTheme && VALID_THEMES.includes(savedTheme as ThemeName)) {
            setThemeState(savedTheme as ThemeName)
        }

        // Hydration guard: prevent server/client mismatch during initialization
        setMounted(true)
    }, [])

    /**
     * THEME UPDATER
     * Syncs state to localStorage for persistence.
     */
    const setTheme = (newTheme: ThemeName) => {
        if (!VALID_THEMES.includes(newTheme)) return
        setThemeState(newTheme)
        localStorage.setItem("app-theme", newTheme)
    }

    /**
     * DOM SYNCHRONIZATION
     * Updates HTML attributes for CSS variable scoping and Mantine color schemes.
     */
    useEffect(() => {
        if (!mounted) return

        const html = document.documentElement

        // Apply theme for global CSS variable scoping (:root[data-theme="..."])
        html.setAttribute("data-theme", theme)

        // Sync with Mantine's color scheme system
        const mantineScheme = LIGHT_THEMES.includes(theme) ? "light" : "dark"
        html.setAttribute("data-mantine-color-scheme", mantineScheme)
    }, [theme, mounted])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

/**
 * HOOK: useAppTheme
 * Context consumer with safety guard.
 */
export const useAppTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useAppTheme must be used within a ThemeProvider")
    }
    return context
}
