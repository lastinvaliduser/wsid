"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  TextInput,
  Textarea,
  Select,
  Switch,
  Button,
  Group,
  Stack,
  Paper,
  Title,
  TagsInput,
  Text,
  SimpleGrid,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { RichEditor } from "./RichEditor"
import type { Post } from "@prisma/client"

type PostFormValues = {
  title: string
  category: string
  content: string
  excerpt: string
  tags: string[]
  seoTitle: string
  seoDesc: string
  status: "DRAFT" | "PUBLISHED"
}

interface PostFormProps {
  post?: Post
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const form = useForm<PostFormValues>({
    initialValues: {
      title: post?.title ?? "",
      category: post?.category ?? "CODING",
      content: post?.content ?? "",
      excerpt: post?.excerpt ?? "",
      tags: post?.tags ?? [],
      seoTitle: post?.seoTitle ?? "",
      seoDesc: post?.seoDesc ?? "",
      status: post?.status ?? "DRAFT",
    },
    validate: {
      title: (v) => (v.trim().length > 0 ? null : "Title is required"),
      content: (v) => (v.trim().length > 0 ? null : "Content is required"),
    },
  })

  async function handleSave(values: PostFormValues, targetStatus: "DRAFT" | "PUBLISHED") {
    setSaving(true)
    const payload = { ...values, status: targetStatus }

    const url = post ? `/api/posts/${post.id}` : "/api/posts"
    const method = post ? "PATCH" : "POST"

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    setSaving(false)

    if (response.ok) {
      const data = await response.json()
      notifications.show({
        title: targetStatus === "PUBLISHED" ? "Published!" : "Saved",
        message:
          targetStatus === "PUBLISHED"
            ? "Your post is now live."
            : "Draft saved successfully.",
        color: targetStatus === "PUBLISHED" ? "green" : "blue",
      })
      if (!post) {
        router.push(`/admin/posts/${data.post.id}/edit`)
      }
      router.refresh()
    } else {
      const err = await response.json()
      notifications.show({ title: "Error", message: err.error ?? "Save failed", color: "red" })
    }
  }

  return (
    <form>
      <Stack gap="lg">
        <TextInput
          placeholder="Post title..."
          size="xl"
          fw={700}
          variant="unstyled"
          styles={{ input: { fontSize: 28, fontWeight: 700 } }}
          {...form.getInputProps("title")}
        />

        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={5} mb="md">Post Settings</Title>
            <Stack gap="md">
              <Select
                label="Category"
                data={["CODING", "GUITAR", "PHOTOGRAPHY", "MOTORBIKES"]}
                {...form.getInputProps("category")}
              />
              <Switch
                label="Published"
                description="Toggle to publish or unpublish"
                checked={form.values.status === "PUBLISHED"}
                onChange={(e) =>
                  form.setFieldValue("status", e.currentTarget.checked ? "PUBLISHED" : "DRAFT")
                }
              />
              <TagsInput
                label="Tags"
                placeholder="Add tag and press Enter"
                maxTags={10}
                {...form.getInputProps("tags")}
              />
            </Stack>
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Title order={5} mb="md">SEO</Title>
            <Stack gap="md">
              <Textarea
                label="Excerpt"
                placeholder="Short description (also used as meta description)"
                maxLength={500}
                autosize
                minRows={2}
                {...form.getInputProps("excerpt")}
              />
              <TextInput
                label="SEO Title"
                placeholder="Override page title for search engines (max 70 chars)"
                maxLength={70}
                rightSection={
                  <Text size="xs" c="dimmed">{form.values.seoTitle.length}/70</Text>
                }
                {...form.getInputProps("seoTitle")}
              />
              <Textarea
                label="SEO Description"
                placeholder="Meta description (max 160 chars)"
                maxLength={160}
                autosize
                minRows={2}
                rightSection={
                  <Text size="xs" c="dimmed">{form.values.seoDesc.length}/160</Text>
                }
                {...form.getInputProps("seoDesc")}
              />
            </Stack>
          </Paper>
        </SimpleGrid>

        <div>
          <Text size="sm" fw={500} mb={6}>Content</Text>
          <RichEditor
            content={form.values.content}
            onChange={(html) => form.setFieldValue("content", html)}
          />
        </div>

        <Group justify="flex-end" pb="xl">
          <Button
            variant="default"
            loading={saving}
            onClick={() => handleSave(form.values, "DRAFT")}
          >
            Save Draft
          </Button>
          <Button
            loading={saving}
            onClick={() => handleSave(form.values, "PUBLISHED")}
          >
            {post?.status === "PUBLISHED" ? "Update" : "Publish"}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
