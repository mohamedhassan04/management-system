import { Repository } from 'typeorm';

interface GenerateNumeroOptions<T> {
  repo: Repository<T>;
  dateColumn: string; // e.g. 'paymentDate', 'createdAt'
  numberColumn: string; // e.g. 'invoiceNo', 'orderNo'
  padding?: number; // default 3
}

export async function generateNumero<T>(
  options: GenerateNumeroOptions<T>,
): Promise<string> {
  const { repo, dateColumn, numberColumn, padding = 3 } = options;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const lastItem = await repo
    .createQueryBuilder('e')
    .where(`EXTRACT(YEAR FROM e.${dateColumn}) = :year`, { year })
    .andWhere(`EXTRACT(MONTH FROM e.${dateColumn}) = :month`, {
      month: Number(month),
    })
    .orderBy(`e.${numberColumn}`, 'DESC')
    .getOne();

  let sequence = 1;

  if (lastItem?.[numberColumn]) {
    const parts = String(lastItem[numberColumn]).split('-');
    sequence = parseInt(parts[2], 10) + 1;
  }

  const seqStr = String(sequence).padStart(padding, '0');

  return `${year}-${month}-${seqStr}`;
}
