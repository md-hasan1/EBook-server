import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../config";
export const initiateSuperAdmin = async () => {
  const hashedPassword=await bcrypt.hash('123456789',Number(config.bcrypt_salt_rounds))
  const payload: any = {
    fullName : "Super",
    phoneNumber: "+8801728026096",
    email: "",
    password: hashedPassword,
    status: UserStatus.ACTIVE,
    role: UserRole.ADMIN,
  };

  const isExistUser = await prisma.user.findFirst({
    where: {
      role: UserRole.ADMIN,
    },
  });

  if (isExistUser) return;

  await prisma.user.create({
    data: payload,
  });
};
