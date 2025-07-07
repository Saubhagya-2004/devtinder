import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constant";

const connection = () => {
  const fetchedconnection = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    fetchedconnection();
  }, []);
  return (
    <>
      <div className="min-h-screen">connection</div>;
    </>
  );
};

export default connection;
