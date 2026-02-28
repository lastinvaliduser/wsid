"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type ThemeName = "light" | "dark" | "cyberpunk" | "matrix" | "gameboy" | "retro" | "arch" | "dracula"

interface ThemeContextType {
    theme: ThemeName
    setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeName>("light")
    const [mounted, setMounted] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("app-theme") as ThemeName
        if (savedTheme) {
            setThemeState(savedTheme)
        }
        setMounted(true)
    }, [])

    const setTheme = (newTheme: ThemeName) => {
        setThemeState(newTheme)
        localStorage.setItem("app-theme", newTheme)
    }

    // Apply theme to document element
    useEffect(() => {
        if (!mounted) return

        const html = document.documentElement
        html.setAttribute("data-theme", theme)

        // Mantine compatibility (most themes are dark-based now)
        const lightThemes: ThemeName[] = ["light"]
        const mantineScheme = lightThemes.includes(theme) ? "light" : "dark"
        html.setAttribute("data-mantine-color-scheme", mantineScheme)
    }, [theme, mounted])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useAppTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error("useAppTheme must be used within ThemeProvider")
    return context
}
