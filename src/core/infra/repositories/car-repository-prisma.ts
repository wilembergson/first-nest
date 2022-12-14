import { Car } from '@domain/entities';
import { CarRepository } from '@domain/repositories';
import { Database } from 'src/core/infra/database';
import { PrismaClient } from '@prisma/client';

export class CarRepositoryPrisma implements CarRepository {
  constructor(private readonly database: Database<PrismaClient>) {}

  /*async listCars(): Promise<Car[] | null> {
    return await this.database.getConnection().car.findMany();
  }*/

  async delete(input: CarRepository.Input.FindOne): Promise<void> {
    await this.database.getConnection().car.delete({
      where: {
        id: input.id,
      },
    });
  }

  async findOne(input: CarRepository.Input.FindOne): Promise<Car | null> {
    const data = await this.database.getConnection().car.findFirst({
      where: {
        OR: [
          {
            id: input.id,
          },
          {
            plate: input.plate,
          },
        ],
      },
    });
    if (!data) return null;
    return new Car({
      name: data.name,
      brand: data.brand,
      plate: data.plate,
    });
  }

  async save(car: Car): Promise<void> {
    const { id, name, brand, plate } = car.getState();
    await this.database.getConnection().car.create({
      data: { id, name, brand, plate },
    });
  }
}
