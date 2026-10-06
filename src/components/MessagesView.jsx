import { useMemo, useState } from "react";
import { ChevronLeft, Info, Paperclip, Send } from "lucide-react";
import Avatar from "./Avatar.jsx";
import { findPerson } from "../lib/people.js";

export default function MessagesView({ data, logEvent }) {
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState("");
  const conversation = useMemo(
    () => data.conversations.find((item) => item.id === selectedId),
    [selectedId, data]
  );

  const selectConversation = (id) => {
    setSelectedId(id);
    logEvent("conversation_viewed", { objectId: id });
  };
  const send = () => {
    if (!draft.trim()) return;
    logEvent("message_sent", {
      objectId: selectedId,
      textLength: draft.trim().length,
    });
    setDraft("");
  };

  if (!conversation)
    return (
      <section className="screen message-list-screen">
        <div className="section-title">
          <h2>Messages</h2>
          <span>{data.conversations.length} conversations</span>
        </div>
        {data.conversations.map((item) => (
          <button
            className="conversation-row"
            key={item.id}
            onClick={() => selectConversation(item.id)}
          >
            <Avatar
              src={findPerson(data.people, item.title)?.avatar}
              name={item.title}
              initials={item.initials}
            />
            <span className="conversation-copy">
              <strong>{item.title}</strong>
              <small>{item.preview}</small>
            </span>
            <time>{item.time}</time>
          </button>
        ))}
      </section>
    );

  return (
    <section className="screen chat-screen">
      <div className="chat-head">
        <button className="icon-button" onClick={() => setSelectedId(null)}>
          <ChevronLeft />
        </button>
        <Avatar
          src={findPerson(data.people, conversation.title)?.avatar}
          name={conversation.title}
          initials={conversation.initials}
          size="sm"
        />
        <div>
          <strong>{conversation.title}</strong>
          <small>{conversation.members}</small>
        </div>
        <Info size={20} />
      </div>
      <div className="message-thread">
        {conversation.messages.map((message) => {
          const sender = message.mine
            ? null
            : findPerson(data.people, message.sender);
          return (
          <div
            key={message.id}
            className={message.mine ? "message-row mine" : "message-row"}
          >
            {!message.mine && (
              <Avatar
                src={sender?.avatar}
                name={sender?.name ?? message.sender}
                initials={sender?.initials}
                size="xs"
              />
            )}
          <div className={message.mine ? "bubble mine" : "bubble"}>
            <small>{message.sender}</small>
            {message.attachment && (
              <button
                className="message-attachment"
                onClick={() =>
                  logEvent("attachment_opened", {
                    objectId: message.attachment.id,
                  })
                }
              >
                <img
                  src={message.attachment.src}
                  alt={message.attachment.alt}
                />
              </button>
            )}
            {message.text && <span>{message.text}</span>}
            <time>{message.time}</time>
          </div>
          </div>
          );
        })}
      </div>
      <div className="message-composer">
        <button
          className="icon-button"
          onClick={() =>
            logEvent("attachment_picker_opened", { objectId: selectedId })
          }
        >
          <Paperclip size={20} />
        </button>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message"
        />
        <button className="send-button" onClick={send}>
          <Send size={18} />
        </button>
      </div>
    </section>
  );
}
