import { prisma } from '@prismaInstance/*';
import type { PrismaClient } from '../../../prisma/generated/client';

type ModelName = Exclude<keyof PrismaClient, `$${string}` | symbol>;

type Delegate<T extends ModelName> = PrismaClient[T];

// Type "structurel" minimal commun à tous les delegates Prisma
type UniformDelegate = {
  findMany: (args?: unknown) => Promise<unknown[]>;
  findUnique: (args: unknown) => Promise<unknown>;
  findFirst: (args?: unknown) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
  count: (args?: unknown) => Promise<number>;
};

export abstract class AbstractModel<T extends ModelName> {
  protected prisma: PrismaClient;
  protected table: Delegate<T>;

  constructor(table: T) {
    if (new.target === AbstractModel) {
      throw new TypeError("Abstract class 'AbstractModel' cannot be instantiated directly");
    }
    this.prisma = prisma;
    this.table = prisma[table];
  }

  // Helper privé : voit `this.table` comme un UniformDelegate, pas comme une union
  private get t(): UniformDelegate {
    return this.table as unknown as UniformDelegate;
  }

  async readAll(args?: Parameters<Delegate<T>['findMany']>[0]) {
    const result = await this.t.findMany(args ?? {});
    return result as Awaited<ReturnType<Delegate<T>['findMany']>>;
  }

  async create(args: Parameters<Delegate<T>['create']>[0]) {
    const result = await this.t.create(args);
    return result as Awaited<ReturnType<Delegate<T>['create']>>;
  }

  async update(args: Parameters<Delegate<T>['update']>[0]) {
    const result = await this.t.update(args);
    return result as Awaited<ReturnType<Delegate<T>['update']>>;
  }

  async delete(args: Parameters<Delegate<T>['delete']>[0]) {
    const result = await this.t.delete(args);
    return result as Awaited<ReturnType<Delegate<T>['delete']>>;
  }
}
