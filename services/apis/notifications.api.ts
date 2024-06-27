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
  role,
  userId,
}: {
  title: string;
  body: string;
  role?: string;
  userId?: string;
}) => {
  try {
    const url = userId
      ? `/notification/send-notification?userId=${userId}`
      : `/notification/send-notification?role=${role}`;
    const { data } = await api.post(url, {
      title,
      body,
    });

    return {
      success: true,
      response: data.data,
    };
  } catch (error: any) {
    console.log(error, "err from send notifications");
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
    const { data } = await api.get(`/notification?page=${page}&limit=${limit}`);

    return data.data;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};

export const updateNotification = async (id: string) => {
  try {
    const url = id ? `/notification?id=${id}` : "/notification";
    const { data } = await api.put(url);

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
