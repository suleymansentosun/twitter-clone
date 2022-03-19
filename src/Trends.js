import React from "react";
import TrendTopic from "./TrendTopic";
import SidebarSection from "./SidebarSection";

function Trends() {
  return (
    <SidebarSection header="Trends for you" canBeSet={true}>
      <TrendTopic topicName="#React" tweetCount="7565" />
      <TrendTopic topicName="#JavaScript" tweetCount="10654" />
      <TrendTopic topicName="#WebDeveloper" tweetCount="6598" />
      <TrendTopic topicName="#Portfolio" tweetCount="1257" />
      <TrendTopic topicName="#Web3" tweetCount="3565" />
    </SidebarSection>
  );
}

export default Trends;
