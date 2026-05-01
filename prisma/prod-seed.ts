
import { PrismaClient, RoleType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting production-safe database seed...');

  // 1. Validate environment variables
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'superadmin@smartlms.space';
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'ChangeMe123!';
  const rootSubdomain = 'platform';

  console.log(`Setting up initial Super Admin: ${adminEmail}`);

  // 2. Create the Root Tenant (for platform management)
  const rootTenant = await prisma.tenant.upsert({
    where: { subdomain: rootSubdomain },
    update: {},
    create: {
      name: 'SmartLMS Platform',
      subdomain: rootSubdomain,
      accentColor: '#22D3EE',
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      onboardingCompleted: true,
    },
  });

  // 3. Create the Initial Super Admin
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { 
      tenantId_email: { 
        tenantId: rootTenant.id, 
        email: adminEmail 
      } 
    },
    update: {},
    create: {
      email: adminEmail,
      name: 'System Administrator',
      role: RoleType.SUPER_ADMIN,
      tenantId: rootTenant.id,
      password: hashedPassword,
    },
  });

  console.log('✅ Production seed completed successfully!');
  console.log('------------------------------------------');
  console.log(`Admin Email: ${adminEmail}`);
  console.log(`Subdomain:   ${rootSubdomain}`);
  console.log('IMPORTANT: Change your password immediately after first login.');
  console.log('------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during production seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
