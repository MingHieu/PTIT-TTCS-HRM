import { PrismaClient } from '@prisma/client';
import { PERMISSIONS, ROLES } from '../../auth/constants';
import * as argon from 'argon2';

const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { username: 'hrwebapp01' },
    update: {
      username: 'hrwebapp01',
      password: await argon.hash('12345678'),
      name: 'Lê Minh Hiếu',
      sex: 0,
      dob: new Date('06-12-2002'),
      phoneNumber: '0999999999',
      email: 'test@gmail.com',
      address: 'Thanh Trì, Hà Nội',
      joinAt: new Date(),
      role: ROLES.HR,
    },
    create: {
      username: 'hrwebapp01',
      password: await argon.hash('12345678'),
      name: 'Lê Minh Hiếu',
      sex: 0,
      dob: new Date('06-12-2002'),
      phoneNumber: '0999999999',
      email: 'test@gmail.com',
      address: 'Thanh Trì, Hà Nội',
      joinAt: new Date(),
      role: ROLES.HR,
    },
  });

  await prisma.user.upsert({
    where: { username: 'nvwebapp01' },
    update: {
      username: 'nvwebapp01',
      password: await argon.hash('12345678'),
      name: 'Lê Minh Hiếu',
      sex: 0,
      dob: new Date('06-12-2002'),
      phoneNumber: '0999999999',
      email: 'test@gmail.com',
      address: 'Thanh Trì, Hà Nội',
      joinAt: new Date(),
      role: ROLES.NV,
    },
    create: {
      username: 'nvwebapp01',
      password: await argon.hash('12345678'),
      name: 'Lê Minh Hiếu',
      sex: 0,
      dob: new Date('06-12-2002'),
      phoneNumber: '0999999999',
      email: 'test@gmail.com',
      address: 'Thanh Trì, Hà Nội',
      joinAt: new Date(),
      role: ROLES.NV,
    },
  });

  for (const key in ROLES) {
    await prisma.role.upsert({
      where: { name: ROLES[key] },
      update: { name: ROLES[key] },
      create: { name: ROLES[key] },
    });
  }

  for (const key in PERMISSIONS) {
    for (const role of PERMISSIONS[key]['role']) {
      await prisma.permission.upsert({
        where: {
          name_role: {
            name: PERMISSIONS[key]['name'],
            role: role,
          },
        },
        update: {
          name: PERMISSIONS[key]['name'],
          role: role,
        },
        create: {
          name: PERMISSIONS[key]['name'],
          role: role,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
