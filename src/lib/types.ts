

export type Post = {
  title: string
  description: string
  date: string
  slug: string
  categories: string[]
  published: boolean
  content: PostContent
}

export type PostMetadata = {
  title: string
  description: string
  date: string
  slug?: string
  categories: string[]
  published: boolean
}

export type PostResult = {
  default: PostContent
  metadata: PostMetadata
}

export type PostsResults = {
  [key: string]: PostResult
}

export type PostContent = {
  render: () => unknown
  $$render: () => unknown
}