import React from "react";
import dayjs from "dayjs";
const Time = ({ times }) => {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  // const year = day * 365;
  const now = new Date().getTime();
  const time = new Date(times).getTime();
  const timePost =
    (now - time) / minute < 1
      ? "Just now"
      : (now - time) / minute < 59
      ? Math.round((now - time) / minute) + "m"
      : (now - time) / hour < 24
      ? Math.round((now - time) / hour) + "h"
      : (now - time) / day < 3
      ? Math.round((now - time) / day) + "d"
      : dayjs(new Date(times)).format("DD/MM/YYYY");

  return <div className="text-xs text-[#aaa]">{timePost}</div>;
};

export default Time;
