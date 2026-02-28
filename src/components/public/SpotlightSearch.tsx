"use client"

import { useEffect, useState, useRef } from "react"
import { Modal, TextInput, Loader, UnstyledButton } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useDebouncedValue } from "@mantine/hooks"
import Link from "next/link"
import { categoryToUrlSegment } from "@/lib/category"
import type { Category } from "@prisma/client"

interface SearchResult {
    id: string
    title: string
    slug: string
    category: Category
    excerpt: string | null
    publishedAt: string | null
}

export function SpotlightSearch() {
    const [opened, setOpened] = useState(false)
    const [query, setQuery] = useState("")
    const [debouncedQuery] = useDebouncedValue(query, 300)
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "f") {
                e.preventDefault()
                setOpened((o) => {
                    if (!o) {
                        setTimeout(() => inputRef.current?.focus(), 100)
                    }
                    return true
                })
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([])
            return
        }

        const fetchResults = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/posts?status=PUBLISHED&limit=5&search=${encodeURIComponent(debouncedQuery)}`)
                if (res.ok) {
                    const data = await res.json()
                    setResults(data.posts)
                }
            } catch (error) {
                console.error("Search failed:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [debouncedQuery])

    const close = () => {
        setOpened(false)
        setQuery("")
        setResults([])
    }

    return (
        <Modal
            opened={opened}
            onClose={close}
            withCloseButton={false}
            size="lg"
            padding="md"
            radius="md"
            yOffset="20vh"
            overlayProps={{
                backgroundOpacity: 0.5,
                blur: 3,
            }}
            styles={{
                content: {
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid var(--mantine-color-gray-2)",
                }
            }}
        >
            <TextInput
                ref={inputRef}
                placeholder="Search posts..."
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
                rightSection={loading ? <Loader size="xs" /> : null}
                variant="unstyled"
                size="lg"
                data-autofocus
                styles={{
                    input: {
                        fontSize: "1.2rem",
                        color: "var(--foreground)",
                    }
                }}
            />

            {results.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                    {results.map((post) => {
                        const href = `/${categoryToUrlSegment(post.category)}/${post.slug}`
                        return (
                            <UnstyledButton
                                key={post.id}
                                component={Link}
                                href={href}
                                onClick={close}
                                className="block p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                style={{
                                    border: "1px solid transparent",
                                }}
                            >
                                <div className="font-semibold text-gray-900 dark:text-gray-100">{post.title}</div>
                                {post.excerpt && (
                                    <div className="text-sm text-gray-500 line-clamp-1 mt-1">{post.excerpt}</div>
                                )}
                                <div className="text-xs text-gray-400 mt-2">
                                    <span className="capitalize">{post.category.toLowerCase()}</span>
                                    {post.publishedAt && (
                                        <span className="ml-2">
                                            • {new Date(post.publishedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </UnstyledButton>
                        )
                    })}
                </div>
            )}

            {debouncedQuery.trim() && !loading && results.length === 0 && (
                <div className="mt-8 mb-4 text-center text-gray-500 text-sm">
                    No results found for &quot;{debouncedQuery}&quot;
                </div>
            )}
        </Modal>
    )
}
