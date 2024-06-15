import axios from "axios";

export const registerUser = async (user) => {
  console.log(user);
  const response = await axios.post(
    "https://radiantbackendnative.onrender.com/api/users/register",
    user,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
export const loginUser = async (user) => {
  const response = await axios.post(
    "https://radiantbackendnative.onrender.com/api/users/login",
    user,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
