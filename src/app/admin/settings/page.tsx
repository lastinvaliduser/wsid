import { prisma } from "@/lib/prisma"
import { Title } from "@mantine/core"
import { SettingsForm } from "@/components/admin/SettingsForm"

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany()
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <div>
      <Title order={2} mb="lg">Settings</Title>
      <SettingsForm settings={settingsMap} />
    </div>
  )
}
