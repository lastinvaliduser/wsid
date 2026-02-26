import Image from "next/image"

interface AuthorCardProps {
  avatar: string | null
  bio: string | null
}

export function AuthorCard({ avatar, bio }: AuthorCardProps) {
  return (
    <div className="flex items-start gap-4 border-t border-gray-100 pt-8 mt-12">
      {avatar ? (
        <Image
          src={avatar}
          alt="CreoVibe Coding"
          width={56}
          height={56}
          className="rounded-full flex-shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-500 text-xl font-semibold">C</span>
        </div>
      )}
      <div>
        <p className="font-semibold text-gray-900">CreoVibe Coding</p>
        <a
          href="mailto:creovibecoding@gmail.com"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          creovibecoding@gmail.com
        </a>
        {bio && <p className="mt-1 text-sm text-gray-500">{bio}</p>}
      </div>
    </div>
  )
}
