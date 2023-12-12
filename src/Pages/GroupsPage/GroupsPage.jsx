import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
// import PostLoading from "../../Components/CommonComponents/PostLoading/PostLoading";
import LeftBar from "../../Components/GroupsPageLeftSideContainer/LeftBar";
import CreateNewGroup from "../../Components/CreateNewGroupDialog/CreateNewGroup";
import { useParams } from "react-router-dom";
import GroupDetail from "../../Components/GroupDetail/GroupDetail";
import InviteFriend from "../../Components/GroupDetail/InviteFriend";
import JoinedGroups from "../../Components/GroupsContainer/JoinedGroups";
import InvitationGroup from "../../Components/GroupsContainer/InvitationGroups";
import FeedGroups from "../../Components/FeedGroups/FeedGroups";

const GroupsPage = () => {
  const [isOpenDialogCreateGroup, setIsOpenDialogCreateGroup] =
    useState(false);
  const [tabActive, setTabActive] = useState("discussion");
  const [allFriends, setAllFriends] = useState(null);
  const [isOpenInviteFriendDiaLog, setIsOpenInviteFriendDiaLog] =
    useState(false);

  const { user, accessToken } = useSelector((state) => state.user);

  let params = useParams();
  // eslint-disable-next-line no-unused-vars
  const { org, "*": splat } = params;
  const groupId = splat.includes("detail") && splat.split("/")[1];

  const getFriends = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/user/allFriend/${user._id}`,
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setAllFriends(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-slate-200 min-h-screen scroll-smooth overflow-x-hidden">
      <div>
        <Navbar />
      </div>
      <div className="flex mx-auto pt-16 md:pt-14 w-full h-screen">
        {/* <div className="sticky top-20"> */}
        <LeftBar
          setIsOpenDialogCreateGroup={setIsOpenDialogCreateGroup}
          splat={splat}
        />
        {splat === "" && <FeedGroups></FeedGroups>}
        {splat === "joinedGroup" && <JoinedGroups></JoinedGroups>}
        {splat === "invitationGroup" && (
          <InvitationGroup></InvitationGroup>
        )}
        {groupId && (
          <GroupDetail
            groupId={groupId}
            tabActive={tabActive}
            setTabActive={setTabActive}
            setIsOpenInviteFriendDiaLog={setIsOpenInviteFriendDiaLog}
          />
        )}
      </div>
      {isOpenDialogCreateGroup && (
        <CreateNewGroup
          allFriends={allFriends}
          setIsOpenDialogCreateGroup={setIsOpenDialogCreateGroup}
        />
      )}
      {isOpenInviteFriendDiaLog && (
        <InviteFriend
          getFriends={getFriends}
          groupId={groupId}
          allFriends={allFriends}
          setIsOpenInviteFriendDiaLog={setIsOpenInviteFriendDiaLog}
        />
      )}
    </div>
  );
};

export default GroupsPage;
