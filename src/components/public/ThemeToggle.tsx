"use client"

import { useMantineColorScheme, ActionIcon, Group } from "@mantine/core"
import { IconSun, IconMoon } from "@tabler/icons-react"

export function ThemeToggle() {
    const { colorScheme, setColorScheme } = useMantineColorScheme()
    const isDark = colorScheme === "dark"

    return (
        <Group justify="center">
            <ActionIcon
                onClick={() => setColorScheme(isDark ? "light" : "dark")}
                variant="subtle"
                color="gray"
                size="lg"
                aria-label="Toggle color scheme"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
                {isDark ? <IconSun size={20} stroke={1.5} /> : <IconMoon size={20} stroke={1.5} />}
            </ActionIcon>
        </Group>
    )
}
