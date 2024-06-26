import api from "../middleware/middleware";

export const registerGCMToken = async ({
  endpoint,
  expirationTime,
  authToken,
  hashKey,
}: {
  endpoint: string;
  expirationTime: number | null;
  authToken: string;
  hashKey: string;
}) => {
  try {
    const reqData = {
      endpoint,
      expirationTime,
      keys: {
        auth: authToken,
        p256dh: hashKey,
      },
    };
    const { data } = await api.post("/notification/subscriptions", reqData);

    return {
      success: true,
      response: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const sendNotification = async ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => {
  try {
    const { data } = await api.post("/notification/send-notification", {
      title,
      body,
    });

    return {
      success: true,
      response: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const fetchNotifications = async ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  try {
    const { data } = await api.get(
      `/notification?page=${page}&limit=${10}`
    );

    return data.data;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};
