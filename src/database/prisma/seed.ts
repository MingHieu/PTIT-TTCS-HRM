import { PrismaClient } from '@prisma/client';
import { PERMISSIONS, ROLES } from '../../auth/constants';
import * as argon from 'argon2';
import { SKILLS } from '../../model/skill/constants';
import { REQUEST_TYPE, REQUEST_STATUS } from '../../model/request/constants';

const prisma = new PrismaClient();

async function seedAccount() {
  await prisma.user.upsert({
    where: { username: 'hrwebapp01' },
    update: {},
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
    update: {},
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
}

async function seedRoles() {
  for (const key in ROLES) {
    await prisma.role.upsert({
      where: { name: ROLES[key] },
      update: { name: ROLES[key] },
      create: { name: ROLES[key] },
    });
  }
}

async function seedPermissions() {
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

async function seedNews() {
  await prisma.news.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      name: 'Bản tin Công Nghệ và Chuyển Đổi Số - Số 3 (2/2022)',
      content: `{"time":1677139341912,"blocks":[{"id":"i9Bz3t9ziV","type":"header","data":{"text":"Bản tin Công Nghệ và Chuyển Đổi Số - Số 3 (2/2022)","level":1}}],"version":"2.26.5"}`,
    },
  });
}

async function seedEvent() {
  await prisma.event.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      name: 'Đi du lịch',
      from: new Date(Date.now() + 8 * 24 * 3600 * 1000),
      to: new Date(Date.now() + 11 * 24 * 3600 * 1000),
      expiredAt: new Date(Date.now() + 5 * 24 * 3600 * 1000),
      address: '123 Main St, Anytown, USA',
    },
  });
}

async function seedSkill() {
  for (const name of SKILLS) {
    await prisma.skill.upsert({
      where: { name },
      update: { name },
      create: { name },
    });
  }
}

async function seedProject() {
  await prisma.project.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      startAt: new Date(),
      finishAt: new Date(),
      name: 'Dự án quản lý đào tạo',
      status: 0,
      content: '',
      leaderUsername: 'hrwebapp01',
      skills: {
        connect: [
          { name: SKILLS[0] },
          { name: SKILLS[1] },
          { name: SKILLS[2] },
        ],
      },
    },
  });
  await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      startAt: new Date(),
      finishAt: new Date(),
      name: 'Dự án chấm công bằng khuôn mặt',
      status: 1,
      content: '',
      leaderUsername: 'hrwebapp01',
      skills: {
        connect: [
          { name: SKILLS[3] },
          { name: SKILLS[4] },
          { name: SKILLS[5] },
        ],
      },
    },
  });
  await prisma.project.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      startAt: new Date(),
      finishAt: new Date(),
      name: 'Dự án quản lý chung cư',
      status: 2,
      content: '',
      leaderUsername: 'hrwebapp01',
      skills: {
        connect: [
          { name: SKILLS[6] },
          { name: SKILLS[7] },
          { name: SKILLS[8] },
        ],
      },
    },
  });
}

async function seedRequest() {
  for (let i = 0; i < REQUEST_TYPE.length; ++i) {
    await prisma.request.upsert({
      where: { id: i },
      update: {},
      create: {
        id: i,
        name: REQUEST_TYPE[i].name,
        type: REQUEST_TYPE[i].type,
        status:
          REQUEST_STATUS[
            Object.keys(REQUEST_STATUS)[
              Math.round(Math.random() * Object.keys(REQUEST_STATUS).length)
            ]
          ],
        senderUsername: 'hrwebapp01',
      },
    });
  }
}

async function main() {
  await seedRoles();
  await seedPermissions();
  await seedNews();
  await seedEvent();
  await seedAccount();
  await seedSkill();
  await seedProject();
  await seedRequest();
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
