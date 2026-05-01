import { PrismaClient, RoleType, CourseStatus, LessonCompletionMode, Platform, NotificationType, BadgeType, MessageScope, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  // Helper for password hashing
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 1. Create Tenants
  console.log('Creating Tenants...');
  const tenant1 = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo Academy',
      subdomain: 'demo',
      accentColor: '#22D3EE',
      plan: 'PRO',
      status: 'ACTIVE',
      onboardingCompleted: true,
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { subdomain: 'tech' },
    update: {},
    create: {
      name: 'Tech Institute',
      subdomain: 'tech',
      accentColor: '#8B5CF6',
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      onboardingCompleted: true,
    },
  });

  // 2. Create Users
  console.log('Creating Users...');
  const usersData = [
    { email: 'admin@demo.com', name: 'Admin User', role: RoleType.ADMIN, tenantId: tenant1.id },
    { email: 'tenantadmin@demo.com', name: 'Tenant Manager', role: RoleType.TENANT_ADMIN, tenantId: tenant1.id },
    { email: 'instructor@demo.com', name: 'John Instructor', role: RoleType.INSTRUCTOR, tenantId: tenant1.id },
    { email: 'student1@demo.com', name: 'Jane Student', role: RoleType.STUDENT, tenantId: tenant1.id },
    { email: 'student2@demo.com', name: 'Bob Student', role: RoleType.STUDENT, tenantId: tenant1.id },
    { email: 'superadmin@platform.com', name: 'Platform Manager', role: RoleType.SUPER_ADMIN, tenantId: tenant1.id },
    { email: 'instructor@tech.com', name: 'Sarah Tech', role: RoleType.INSTRUCTOR, tenantId: tenant2.id },
  ];

  const users: Record<string, User> = {};
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: u.tenantId, email: u.email } },
      update: {},
      create: {
        ...u,
        password: hashedPassword,
      },
    });
    users[u.email] = user;
  }

  // 3. Create Courses with Modules and Lessons
  console.log('Creating Courses...');
  const course1 = await prisma.course.create({
    data: {
      tenantId: tenant1.id,
      instructorId: users['instructor@demo.com'].id,
      title: 'Fullstack Web Development 2024',
      description: 'Master HTML, CSS, React, and Node.js in this comprehensive bootcamp.',
      status: CourseStatus.PUBLISHED,
      price: 199.99,
      publishedAt: new Date(),
      modules: {
        create: [
          {
            title: 'Frontend Fundamentals',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Introduction to HTML5',
                  content: '<h1>Welcome</h1><p>HTML is the backbone of the web.</p>',
                  order: 1,
                  duration: 600,
                  completionMode: LessonCompletionMode.MANUAL,
                },
                {
                  title: 'CSS Grid & Flexbox',
                  content: '<p>Learn modern layouts.</p>',
                  order: 2,
                  duration: 1200,
                  completionMode: LessonCompletionMode.VIDEO_THRESHOLD,
                },
              ],
            },
          },
          {
            title: 'Backend Mastery',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'Node.js Basics',
                  content: '<p>JavaScript on the server.</p>',
                  order: 1,
                  duration: 1800,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 4. Create Exams
  console.log('Creating Exams...');
  await prisma.exam.create({
    data: {
      courseId: course1.id,
      title: 'Mid-term Frontend Assessment',
      duration: 60,
      questions: [
        {
          type: 'multiple-choice',
          question: 'What does HTML stand for?',
          options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink Text Management'],
          answer: 'Hyper Text Markup Language',
        },
        {
          type: 'open-ended',
          question: 'Explain the difference between Flexbox and Grid.',
        },
      ],
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    },
  });

  // 5. Create Assignments
  console.log('Creating Assignments...');
  const assignment1 = await prisma.assignment.create({
    data: {
      courseId: course1.id,
      title: 'Personal Portfolio Project',
      description: 'Build and host your personal portfolio website.',
      totalPoints: 100,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  // 6. Submissions
  console.log('Creating Submissions...');
  await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      userId: users['student1@demo.com'].id,
      content: 'Here is my portfolio link: https://jane-portfolio.com',
      grade: 95,
      feedback: 'Excellent work on the responsive design!',
      gradedById: users['instructor@demo.com'].id,
      submittedAt: new Date(),
      gradedAt: new Date(),
    },
  });

  // 7. Live Classes
  console.log('Creating Live Classes...');
  await prisma.liveClass.create({
    data: {
      courseId: course1.id,
      title: 'Q&A Session: Backend Architecture',
      platform: Platform.ZOOM,
      meetingUrl: 'https://zoom.us/j/123456789',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 60,
    },
  });

  // 8. Enrollments and Progress
  console.log('Creating Enrollments...');
  await prisma.enrollment.create({
    data: {
      userId: users['student1@demo.com'].id,
      courseId: course1.id,
      progress: 45,
    },
  });

  // 9. Gamification
  console.log('Creating Gamification data...');
  await prisma.streak.upsert({
    where: { userId: users['student1@demo.com'].id },
    update: {
      currentStreak: 5,
      longestStreak: 12,
      lastActiveDate: new Date(),
    },
    create: {
      userId: users['student1@demo.com'].id,
      currentStreak: 5,
      longestStreak: 12,
      lastActiveDate: new Date(),
    },
  });

  await prisma.badge.createMany({
    data: [
      { userId: users['student1@demo.com'].id, type: BadgeType.FIRST_LESSON },
      { userId: users['student1@demo.com'].id, type: BadgeType.WEEK_STREAK },
    ],
  });

  // 10. AI Chat
  console.log('Creating AI Chat data...');
  await prisma.aIChat.create({
    data: {
      userId: users['student1@demo.com'].id,
      courseId: course1.id,
      messages: [
        { role: 'user', content: 'What is a closure in JavaScript?' },
        { role: 'assistant', content: 'A closure is the combination of a function bundled together with references to its surrounding state...' },
      ],
    },
  });

  // 11. Notifications
  console.log('Creating Notifications...');
  await prisma.notification.create({
    data: {
      userId: users['student1@demo.com'].id,
      type: NotificationType.COURSE_UPDATE,
      title: 'New Content Added',
      message: 'A new lesson on React Hooks has been added to your course.',
      read: false,
    },
  });

  // 12. Message Threads
  console.log('Creating Message Threads...');
  await prisma.messageThread.create({
    data: {
      tenantId: tenant1.id,
      courseId: course1.id,
      scope: MessageScope.COURSE,
      title: 'General Course Discussion',
      createdById: users['instructor@demo.com'].id,
      members: {
        create: [
          { userId: users['instructor@demo.com'].id },
          { userId: users['student1@demo.com'].id },
          { userId: users['student2@demo.com'].id },
        ],
      },
      messages: {
        create: [
          {
            senderId: users['instructor@demo.com'].id,
            body: 'Welcome everyone to the course! Feel free to ask questions here.',
          },
          {
            senderId: users['student1@demo.com'].id,
            body: 'Thanks John! Excited to start.',
          },
        ],
      },
    },
  });

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


