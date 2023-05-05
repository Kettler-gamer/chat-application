export function Notifications({ notices }) {
  return (
    <div className="notifications-container">
      {notices.map((notice, index) => (
        <div key={`notice-${index}`}>
          {notice.type === "message" && (
            <>
              <p>{notice.data.author}</p>
              <p>
                {notice.data.content.length < 25
                  ? notice.data.content
                  : notice.data.content.slice(0, 25) + "..."}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
