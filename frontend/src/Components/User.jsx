import { useParams } from "react-router-dom";

import React from "react";

export default function User() {
  const { username } = useParams();

  return <div className="text-red-500">User: {username}</div>;
}
