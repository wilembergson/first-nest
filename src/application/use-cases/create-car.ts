import { Car } from '@domain/entities';
import { CarRepository } from '@domain/repositories';

export class CreateCar {
  constructor(private readonly carRepository: CarRepository) {}

  async execute(input: CreateCar.Input): Promise<void> {
    const foundCar = await this.carRepository.findOne({ board: input.board });
    if (foundCar) throw Error('O carro com este nome já está cadastrado.');
    const car = new Car({
      name: input.name,
      brand: input.brand,
      board: input.board,
      price: input.price,
    });
    await this.carRepository.save(car);
  }
}

export namespace CreateCar {
  export type Input = {
    name: string;
    brand: string;
    board: string;
    price: number;
  };
}