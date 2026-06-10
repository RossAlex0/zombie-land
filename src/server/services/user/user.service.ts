import { userFindUniqueArgs, userWhereInput } from '../../../../prisma/generated/models';
import { AbstractModel } from '@server/services/AbstractModel';
import type { UserSearchParams } from '@server/schemas/user/admin/user.schema';

export class UserModel extends AbstractModel<'user'> {
  constructor() {
    super('user');
  }

  async findUserByEmail(email: string) {
    return await this.table.findFirst({
      where: { email, deleted_at: null },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        role: true,
        booking: true,
        birth_date: true,
      },
    });
  }

  async findUserById(id: number, fields?: userFindUniqueArgs['select']) {
    const args: userFindUniqueArgs = { where: { id }, select: fields ?? {} };

    return await this.table.findUnique(args);
  }

  async findUserWithRole(id: number) {
    return await this.table.findUnique({
      where: { id },
      select: { id: true, role: true },
    });
  }

  async countByRole(role: string) {
    return await this.table.count({ where: { role: { name: role } } });
  }

  async findBookings(userId: number) {
    return await this.prisma.booking.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        status: true,
        start_at: true,
        end_at: true,
        duration: true,
        created_at: true,
        _count: { select: { ticket: true } },
      },
      orderBy: { start_at: 'desc' },
    });
  }

  async searchAndCount(params: UserSearchParams) {
    const where: userWhereInput = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { first_name: { contains: params.search, mode: 'insensitive' } },
        { last_name: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.role) {
      where.role = { name: params.role };
    }

    if (params.valid_email !== undefined) {
      where.valid_email = params.valid_email;
    }

    const [data, total] = await Promise.all([
      this.table.findMany({
        where,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          role_id: true,
          role: true,
          birth_date: true,
          valid_email: true,
          created_at: true,
        },
        orderBy: { [params.sortBy]: params.sortOrder },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.table.count({ where }),
    ]);

    return { data, total, page: params.page, limit: params.limit };
  }

  async anonymizeUser(id: number) {
    // Anonymisation RGPD : on écrase les données perso mais on concerve l'historique des actions.
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: {
          first_name: 'Utilisateur',
          last_name: 'supprimé',
          email: `deleted-${id}@anonymized.local`,
          birth_date: null,
          password: '', // bloque le login (aucun hash ne match une chaîne vide)
          valid_email: false,
          deleted: true,
          deleted_at: new Date(),
        },
      }),

      this.prisma.refresh_token.deleteMany({ where: { user_id: id } }),
    ]);
  }
}
