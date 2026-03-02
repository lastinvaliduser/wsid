"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { TextInput, PasswordInput, Button, Paper, Title, Text, Alert } from "@mantine/core"
import { useForm } from "@mantine/form"

interface LoginForm {
  email: string
  password: string
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin"
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginForm>({
    initialValues: { email: "", password: "" },
    validate: {
      email: (v) => (/\S+@\S+\.\S+/.test(v) ? null : "Invalid email"),
      password: (v) => (v.length >= 1 ? null : "Password is required"),
    },
  })

  async function handleSubmit(values: LoginForm) {
    setError(null)
    setLoading(true)

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      if (result.status === 429) {
        setError("Too many attempts. Please wait 15 minutes before trying again.")
      } else {
        setError("Invalid email or password.")
      }
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Paper shadow="sm" p="xl" radius="md" w={380} withBorder>
        <Title order={2} mb="xs" className="text-gray-900">
          Admin Login
        </Title>
        <Text size="sm" c="dimmed" mb="lg">
          wsid.now — CreoVibe Coding
        </Text>

        {error && (
          <Alert color="red" mb="md" radius="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            type="email"
            placeholder="creovibecoding@gmail.com"
            mb="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mb="lg"
            {...form.getInputProps("password")}
          />
          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>
      </Paper>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
