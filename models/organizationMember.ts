import { prisma } from '@/lib/prisma';

export const countOrganizationMembers = async ({ where }) => {
  return await prisma.organizationMember.count({
    where,
  });
};

export const updateOrganizationMember = async ({ where, data }) => {
  return await prisma.organizationMember.update({
    where,
    data,
  });
};
