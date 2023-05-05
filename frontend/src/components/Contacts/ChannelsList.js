export function ChannelsList({ props, search }) {
  return props.channels
    .filter((channel, index) =>
      channel.name
        ? channel.name.toLowerCase().startsWith(search.toLowerCase())
        : `channel ${index + 1}`.startsWith(search.toLowerCase())
    )
    .map((channel, index) => (
      <li
        className={
          props.selectedChannel === props.channels.indexOf(channel)
            ? "list-item selected"
            : "list-item"
        }
        style={{ padding: "1em 0" }}
        key={`channel-${index}`}
        onClick={() => {
          props.setLoading(true);
          props.setSelectedChannel(props.channels.indexOf(channel));
          props.setSelectedContact(undefined);
        }}>
        <p>
          {channel.name
            ? channel.name
            : `Channel ${props.channels.indexOf(channel) + 1}`}
        </p>
      </li>
    ));
}
