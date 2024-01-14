"use client";

import { UserRole } from "@prisma/client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RoleGate } from "@/components/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { admin } from "@/actions/admin";

const AdminPage = () => {
  const onApiRouteClick = () => {
    const resultPromise = fetch("/api/admin");

    toast.promise(resultPromise, {
      loading: "API Route Loading...",
      success: "Allowed API Route!",
      error: "Forbidden API Route!",
    });
  };

  const onServerActionClick = () => {
    const resultPromise = admin().then((data) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.sucess);
      }
    });

    toast.promise(resultPromise, {
      loading: "Server Action Loading...",
    });
  };

  return (
    <Card className="w-[600px] max-w-[95%]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
