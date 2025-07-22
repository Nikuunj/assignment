import { PrismaClient as prismaClient1 } from '../../db/db1/generated/prisma1'
import { PrismaClient as prismaClient2 } from '../../db/db2/generated/prisma2'
import { PrismaClient as prismaClient3 } from '../../db/db3/generated/prisma3' 
import { PrismaClient as prismaClient4 } from '../../db/db4/generated/prisma4'
import { PrismaClient as prismaClient5 } from '../../db/db5/generated/prisma5'

export const db1 = new prismaClient1();
export const db2 = new prismaClient2();
export const db3 = new prismaClient3();
export const db4 = new prismaClient4();
export const db5 = new prismaClient5();