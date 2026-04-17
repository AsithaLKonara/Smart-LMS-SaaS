# RBAC matrix

## Mental model

- **Primary role:** `User.role` (`RoleType`) is the runtime persona for v1.
- **Custom roles:** `Role` (Prisma) with `permissions Json` is reserved for future overlay; until wired, all checks use `User.role` + `constants/permissions.ts`.

## Multi-role

- **v1:** One role per user per tenant.
- **Future:** `Membership` + active context in session (org switcher).

## Matrix (resource × action)

| Resource / action | STUDENT | INSTRUCTOR | ADMIN | SUPER_ADMIN |
|-------------------|---------|------------|-------|-------------|
| course:view | own enrolled + catalog published | yes (tenant) | yes | yes |
| course:create | no | yes | yes | yes |
| course:edit | no | own or delegated | yes | yes |
| course:publish | no | yes | yes | yes |
| course:archive | no | yes | yes | yes |
| assignment:submit | enrolled | no | no | no |
| assignment:grade | no | course instructor | yes (override) | yes |
| grade:override | no | no | yes | yes |
| exam:take | enrolled | no | no | no |
| exam:grade | no | yes | yes | yes |
| live:join | enrolled | yes | yes | yes |
| live:create | no | yes | yes | yes |
| message:direct | yes (tenant peers) | yes | yes | yes |
| message:broadcast | no | course | yes | yes |
| asset:upload | no | yes | yes | yes |
| asset:download | per asset policy + enrollment | yes | yes | yes |
| billing:view | no | no | yes | yes |
| tenant:manage | no | no | yes | yes |
| audit:view | no | no | yes | yes |
| ai:use | yes (limits) | yes | yes | yes |
| ai:admin | no | no | yes | yes |

Implementation: see `constants/permissions.ts` and server helpers `lib/auth/access.ts`, `lib/auth/permissions.ts`. Middleware remains coarse path checks only.
