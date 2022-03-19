import React from "react";
import SidebarSection from "./SidebarSection";
import PersonCanBeFollowed from "./PersonCanBeFollowed";

function WhoToFollow(props) {
  const mostFollowedUsers = props.mostFollowedUsers;
  const listItems = mostFollowedUsers.map((user) =>
  <PersonCanBeFollowed key={user.id} username={user.data.username} name={user.data.name} userId={user.id} />
);

  return (
    <SidebarSection header="Who to follow" canBeSet={false}>
      {listItems}
    </SidebarSection>
  );
}

export default WhoToFollow;
