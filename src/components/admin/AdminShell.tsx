"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  AppShell,
  Burger,
  NavLink,
  Text,
  Button,
  Group,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  IconLayoutDashboard,
  IconArticle,
  IconPhoto,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: IconArticle },
  { href: "/admin/media", label: "Media", icon: IconPhoto },
  { href: "/admin/settings", label: "Settings", icon: IconSettings },
]

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 220, breakpoint: "md", collapsed: { mobile: !opened } }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
            <Text fw={600} size="md">
              wsid.now Admin
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            component={Link}
            href={item.href}
            label={item.label}
            leftSection={<item.icon size={18} />}
            active={
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            }
            mb={4}
          />
        ))}

        <div style={{ marginTop: "auto", paddingTop: 12 }}>
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconLogout size={18} />}
            fullWidth
            justify="start"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            Sign Out
          </Button>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
