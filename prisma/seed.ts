import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a sample tenant
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo Academy',
      subdomain: 'demo',
      accentColor: '#22D3EE',
      plan: 'PRO',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created tenant:', tenant.name);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@demo.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@demo.com',
      name: 'Admin User',
      password: '$2a$10$placeholder', // This should be hashed in real implementation
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create instructor
  const instructor = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'instructor@demo.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'instructor@demo.com',
      name: 'John Instructor',
      password: '$2a$10$placeholder',
      role: 'INSTRUCTOR',
    },
  });

  console.log('✅ Created instructor:', instructor.email);

  // Create student
  const student = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'student@demo.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'student@demo.com',
      name: 'Jane Student',
      password: '$2a$10$placeholder',
      role: 'STUDENT',
    },
  });

  console.log('✅ Created student:', student.email);

  // Create a sample course
  const course = await prisma.course.create({
    data: {
      tenantId: tenant.id,
      instructorId: instructor.id,
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development',
      status: 'PUBLISHED',
      modules: {
        create: [
          {
            title: 'Getting Started',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Welcome to the Course',
                  content: 'This is your first lesson',
                  order: 1,
                  duration: 300,
                },
                {
                  title: 'Setting Up Your Environment',
                  content: 'Learn how to set up your development environment',
                  order: 2,
                  duration: 600,
                },
              ],
            },
          },
          {
            title: 'HTML Basics',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'Introduction to HTML',
                  content: 'Learn the basics of HTML',
                  order: 1,
                  duration: 900,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Created course:', course.title);

  // Create enrollment
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
      progress: 25,
    },
  });

  console.log('✅ Created enrollment');

  // Create streak
  await prisma.streak.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      currentStreak: 3,
      longestStreak: 5,
      lastActiveDate: new Date(),
    },
  });

  console.log('✅ Created streak');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

