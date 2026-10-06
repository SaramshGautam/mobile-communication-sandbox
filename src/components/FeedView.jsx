import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import Avatar from "./Avatar.jsx";
import { findPerson } from "../lib/people.js";

export default function FeedView({ data, logEvent }) {
  return (
    <section className="screen feed-screen">
      <div className="stories" aria-label="People">
        {data.people.map((person) => (
          <button
            key={person.id}
            className="story"
            onClick={() => logEvent("profile_viewed", { objectId: person.id })}
          >
            <Avatar
              src={person.avatar}
              name={person.name}
              initials={person.initials}
              size="story"
            />
            <span>{person.firstName}</span>
          </button>
        ))}
      </div>
      <div className="composer">
        <Avatar name="Pat Morgan" initials="PM" />
        <button>What would you like to share?</button>
      </div>
      <div className="feed-list">
        {data.posts.map((post) => {
          const author = data.people.find(
            (person) => person.id === post.authorId
          );
          return (
            <article
              className="post-card"
              key={post.id}
              onClick={() => logEvent("post_viewed", { objectId: post.id })}
            >
              <div className="post-head">
                <Avatar
                  src={author.avatar}
                  name={author.name}
                  initials={author.initials}
                />
                <div>
                  <strong>{author.name}</strong>
                  <small>{post.time}</small>
                </div>
                <MoreHorizontal size={19} />
              </div>
              <p>{post.text}</p>
              {post.photo && (
                <button
                  className="post-photo"
                  onClick={() =>
                    logEvent("photo_opened", { objectId: post.photo.id })
                  }
                >
                  <img
                    src={post.photo.src}
                    alt={post.photo.alt}
                    width={post.photo.width}
                    height={post.photo.height}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              )}
              {post.comments?.length > 0 && (
                <div className="comment-list">
                  {post.comments.map((comment) => {
                    const commenter = findPerson(data.people, comment.author);
                    return (
                      <div className="comment" key={comment.id}>
                        <Avatar
                          src={commenter?.avatar}
                          name={comment.author}
                          initials={commenter?.initials}
                          size="sm"
                        />
                        <div className="comment-bubble">
                          <strong>{comment.author}</strong>
                          <span>{comment.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="post-actions">
                <button onClick={() => logEvent("like", { objectId: post.id })}>
                  <Heart size={19} />
                  Like
                </button>
                <button
                  onClick={() =>
                    logEvent("comment_opened", { objectId: post.id })
                  }
                >
                  <MessageCircle size={19} />
                  Comment
                </button>
                <button
                  onClick={() =>
                    logEvent("share_opened", { objectId: post.id })
                  }
                >
                  <Share2 size={19} />
                  Share
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
