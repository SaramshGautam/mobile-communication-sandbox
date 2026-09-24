import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'

export default function FeedView({ data, logEvent }) {
  return (
    <section className="screen feed-screen">
      <div className="stories" aria-label="People">
        {data.people.map((person) => (
          <button key={person.id} className="story" onClick={() => logEvent('profile_viewed', { objectId: person.id })}>
            <span className="avatar">{person.initials}</span><span>{person.firstName}</span>
          </button>
        ))}
      </div>
      <div className="composer"><span className="avatar">PM</span><button>What would you like to share?</button></div>
      <div className="feed-list">
        {data.posts.map((post) => {
          const author = data.people.find((person) => person.id === post.authorId)
          return (
            <article className="post-card" key={post.id} onClick={() => logEvent('post_viewed', { objectId: post.id })}>
              <div className="post-head"><span className="avatar">{author.initials}</span><div><strong>{author.name}</strong><small>{post.time}</small></div><MoreHorizontal size={19} /></div>
              <p>{post.text}</p>
              {post.photo && <div className="photo-placeholder"><span>{post.photo.label}</span></div>}
              <div className="post-actions">
                <button onClick={() => logEvent('like', { objectId: post.id })}><Heart size={19} />Like</button>
                <button onClick={() => logEvent('comment_opened', { objectId: post.id })}><MessageCircle size={19} />Comment</button>
                <button onClick={() => logEvent('share_opened', { objectId: post.id })}><Share2 size={19} />Share</button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
