"use client"

import { Modal, Text, Title, Stack, Group, Anchor } from "@mantine/core"
import { IconMail, IconArrowRight } from "@tabler/icons-react"

interface AboutModalProps {
    opened: boolean
    onClose: () => void
}

export function AboutModal({ opened, onClose }: AboutModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="About wsid.now"
            size="md"
            radius="md"
            centered
            styles={{
                header: {
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderBottom: "var(--border)",
                    fontFamily: "var(--font-main)",
                },
                content: {
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    border: "var(--border)",
                    borderRadius: "var(--radius)",
                    fontFamily: "var(--font-main)",
                }
            }}
        >
            <Stack gap="md">
                <Text size="sm" c="dimmed">
                    "What Should I Do Now?" (wsid.now) is a personal space where I document my journey through technology, music, and the open road.
                </Text>

                <section>
                    <Title order={5} mb="xs">The Vision</Title>
                    <Text size="sm">
                        To share insights, patterns, and stories that might help someone else in their own creative or technical pursuits.
                    </Text>
                </section>

                <section>
                    <Title order={5} mb="xs">Connect</Title>
                    <Stack gap="xs">
                        <Group gap="xs">
                            <IconMail size={16} />
                            <Anchor href="mailto:creovibecoding@gmail.com" size="sm">
                                creovibecoding@gmail.com
                            </Anchor>
                        </Group>
                    </Stack>
                </section>

                <Text size="xs" c="dimmed" mt="lg">
                    © {new Date().getFullYear()} CreoVibe Coding. Built with Next.js, Mantine, and love for the craft.
                </Text>
            </Stack>
        </Modal>
    )
}
