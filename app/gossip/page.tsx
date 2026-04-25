'use client'
import { useEffect, useState } from 'react'

const tags = ['All', 'Tea', 'Night Life', 'Drama', 'Food', 'Classic', 'Bromance', 'Confession', 'Funny']

interface GossipPost {
  id: string
  content: string
  tag: string
  likes: number
  createdAt: string
}

export default function GossipPage() {
  const [posts, setPosts] = useState<GossipPost[]>([])
  const [activeTag, setActiveTag] = useState('All')
  const [content, setContent] = useState('')
  const [tag, setTag] = useState('Tea')
  const [submitting, setSubmitting] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/gossip')
      const data = await res.json()
      setPosts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit = async () => {
    if (!content.trim() || content.length < 10) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/gossip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tag }),
      })
      const newPost = await res.json()
      setPosts((prev) => [newPost, ...prev])
      setContent('')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (id: string) => {
    if (liked.has(id)) return
    setLiked((prev) => new Set([...prev, id]))
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)))
    await fetch(`/api/gossip/${id}/like`, { method: 'POST' })
  }

  const filtered = activeTag === 'All' ? posts : posts.filter((post) => post.tag === activeTag)

  const timeAgo = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="paper-page">
      <div className="paper-container" style={{ maxWidth: '900px' }}>
        <div className="animate-in" style={{ marginBottom: '24px' }}>
          <p className="section-kicker" style={{ marginBottom: '10px' }}>
            Anonymous Campfire
          </p>
          <h1 className="board-title" style={{ fontSize: 'clamp(34px, 5vw, 54px)', marginBottom: '12px' }}>
            Gossip Wall
          </h1>
          <p style={{ color: '#5f4930', fontSize: '16px', lineHeight: 1.8 }}>
            Share the fun side of the conference. Keep it light, kind, and worth retelling around the board.
          </p>
        </div>

        <div className="board-panel animate-in" style={{ padding: '26px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="section-kicker" style={{ marginBottom: '10px' }}>
              Drop A Story
            </p>
            <textarea
              placeholder="I heard that..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              style={{ resize: 'none', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {tags
                  .filter((item) => item !== 'All')
                  .map((item) => (
                    <button
                      key={item}
                      onClick={() => setTag(item)}
                      className="board-chip"
                      style={{
                        background: tag === item ? 'rgba(255, 212, 45, 0.45)' : 'rgba(255,255,255,0.4)',
                        border: tag === item ? '3px solid #6a3416' : '2px solid rgba(107, 61, 28, 0.12)',
                        color: '#6f4a28',
                      }}
                    >
                      {item}
                    </button>
                  ))}
              </div>
              <button onClick={handleSubmit} disabled={submitting || content.length < 10} className="wood-button">
                {submitting ? 'Posting...' : 'Post Story'}
              </button>
            </div>
            {content.length > 0 && content.length < 10 ? (
              <p style={{ fontSize: '12px', color: '#8d7559', marginTop: '10px' }}>Minimum 10 characters.</p>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {tags.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTag(item)}
              className="board-chip"
              style={{
                background: activeTag === item ? 'rgba(255, 212, 45, 0.45)' : 'rgba(255,255,255,0.4)',
                border: activeTag === item ? '3px solid #6a3416' : '2px solid rgba(107, 61, 28, 0.12)',
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="board-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ position: 'relative', zIndex: 1, color: '#7b5b36' }}>Loading stories...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="board-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="board-title" style={{ fontSize: '30px', marginBottom: '10px' }}>
                Quiet Campfire
              </p>
              <p style={{ color: '#6a5035' }}>No stories yet. Be the first to start the buzz.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {filtered.map((post, index) => (
              <div key={post.id} className="board-panel animate-in card-hover" style={{ padding: '22px' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span className="board-chip" style={{ background: 'rgba(255,255,255,0.35)' }}>
                      {post.tag}
                    </span>
                    <span style={{ color: '#8a6f51', fontFamily: 'DM Mono, monospace', fontSize: '12px', paddingTop: '8px' }}>{timeAgo(post.createdAt)}</span>
                  </div>
                  <p style={{ color: '#4d2d16', fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>{post.content}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <p className="section-kicker" style={{ color: '#8c5a2b' }}>
                      Campfire Story {index + 1}
                    </p>
                    <button
                      onClick={() => handleLike(post.id)}
                      className="board-chip"
                      style={{
                        background: liked.has(post.id) ? 'rgba(196, 81, 40, 0.18)' : 'rgba(255,255,255,0.35)',
                        border: liked.has(post.id) ? '3px solid #8b3f20' : '2px solid rgba(107, 61, 28, 0.12)',
                        color: liked.has(post.id) ? '#8b3f20' : '#6f4a28',
                      }}
                    >
                      Heat {post.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
