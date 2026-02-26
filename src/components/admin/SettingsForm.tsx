"use client"

import { useState } from "react"
import { TextInput, Textarea, Button, Paper, Title, Stack, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"

interface SettingsFormProps {
  settings: Record<string, string>
}

type SiteSettings = {
  "site.author": string
  "site.email": string
  "site.bio": string
  "site.twitter": string
  "site.github": string
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [saving, setSaving] = useState(false)

  const form = useForm<SiteSettings>({
    initialValues: {
      "site.author": settings["site.author"] ?? "CreoVibe Coding",
      "site.email": settings["site.email"] ?? "creovibecoding@gmail.com",
      "site.bio": settings["site.bio"] ?? "",
      "site.twitter": settings["site.twitter"] ?? "",
      "site.github": settings["site.github"] ?? "",
    },
  })

  async function saveSetting(key: string, value: string) {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    })
    if (!response.ok) throw new Error("Failed to save setting")
  }

  async function handleSubmit(values: SiteSettings) {
    setSaving(true)
    try {
      await Promise.all(
        Object.entries(values).map(([key, value]) => saveSetting(key, value))
      )
      notifications.show({ title: "Saved", message: "Settings updated.", color: "green" })
    } catch {
      notifications.show({ title: "Error", message: "Failed to save settings.", color: "red" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Paper withBorder p="lg" radius="md" mb="lg">
        <Title order={4} mb="md">Site Information</Title>
        <Stack gap="md">
          <TextInput
            label="Author Name"
            {...form.getInputProps("site.author")}
          />
          <TextInput
            label="Email"
            type="email"
            {...form.getInputProps("site.email")}
          />
          <Textarea
            label="Bio"
            placeholder="Write a short bio about yourself..."
            autosize
            minRows={3}
            {...form.getInputProps("site.bio")}
          />
        </Stack>
      </Paper>

      <Paper withBorder p="lg" radius="md" mb="lg">
        <Title order={4} mb="md">Social Links</Title>
        <Stack gap="md">
          <TextInput
            label="Twitter / X Handle"
            placeholder="username (without @)"
            leftSection={<Text size="sm">@</Text>}
            {...form.getInputProps("site.twitter")}
          />
          <TextInput
            label="GitHub Username"
            placeholder="your-github-username"
            {...form.getInputProps("site.github")}
          />
        </Stack>
      </Paper>

      <Button type="submit" loading={saving}>
        Save Settings
      </Button>
    </form>
  )
}
