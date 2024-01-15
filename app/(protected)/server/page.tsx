import { currentUser } from "@/lib/auth";

import { UserInfo } from "@/components/user-info";

export const metadata = {
  title: "Server",
};

const ServerPage = async () => {
  const user = await currentUser();

  return <UserInfo user={user} label="💻Server component" />;
};

export default ServerPage;
