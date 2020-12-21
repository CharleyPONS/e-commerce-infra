import { Inject, Service } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { FilterQuery, UpdateQuery } from 'mongoose';

import { WinstonLogger } from '../../../core/services/winston-logger';
import { UserEntity } from '../../User/entity/user.entity';
import { CATEGORIES } from '../entity/product.enum';
import { ProductEntity } from '../entity/product.entity';

@Service()
export class ProductRepository {
  @Inject(ProductEntity)
  private product: MongooseModel<ProductEntity>;

  $onInit() {}

  async findById(id: string): Promise<any> {
    try {
      new WinstonLogger().logger().info(`Search a product with id ${id}`);
      return await this.product.findById(id).exec();
    } catch (err) {
      new WinstonLogger().logger().warn(`Search a product with id ${id} request failed`,
        { error: err });
    }
  }

  async findByCategories(categoriesSelected: CATEGORIES): Promise<any> {
    try {
      new WinstonLogger().logger().info(`Search a product with id ${categoriesSelected}`);
      return await this.product.findOne({ categories: categoriesSelected }).exec();
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a product with id ${categoriesSelected} request failed`,
        { error: err });
    }
  }

  async save(product: ProductEntity): Promise<any> {
    try {
      const model = new this.product(product);
      new WinstonLogger().logger().info(`Save product`, { product });
      await model.save();
      new WinstonLogger().logger().info(`Save product succeed`, { product });

      return model;
    } catch (err) {
      new WinstonLogger().logger().warn(`Save a product with id request failed`, { error: err });
    }
  }

  async updateOne(
    filter: FilterQuery<UserEntity>,
    updateQuery: UpdateQuery<UserEntity>,
    product: ProductEntity
  ): Promise<any> {
    try {
      new WinstonLogger().logger().info(`update product`, { product });
      await this.product.updateOne(filter, updateQuery);
      new WinstonLogger().logger().info(`Update product succeed`, { product });
    } catch (err) {
      new WinstonLogger().logger().warn(`Update a product with id request failed`, { error: err });
    }
  }

  async findAll(): Promise<ProductEntity[]> {
    new WinstonLogger().logger().info(`Find all product`);
    const product: ProductEntity[] = await this.product.find().exec();
    return product;
  }
}
