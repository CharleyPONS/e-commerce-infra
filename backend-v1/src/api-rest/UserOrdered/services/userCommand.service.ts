import { Context, Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { isEqual, merge } from 'lodash';

import { WinstonLogger } from '../../../core/services/winston-logger';
import { UserEntity } from '../../User/entity/user.entity';
import { UserRepository } from '../../User/services/user.repository';
import { UserOrderedEntity } from '../entity/userOrdered.entity';

import { UserCommandRepository } from './userCommand.repository';

@Service()
export class UserCommandService {
  constructor(
    private _userRepository: UserRepository,
    private _userCommandRepository: UserCommandRepository
  ) {}
  async main(context: Context, userCommand: UserOrderedEntity): Promise<void> {
    const user: UserEntity = await this._userRepository.findByUserId(userCommand?.userId);
    if (!user) {
      new WinstonLogger().logger().info(`User not found to login`, { userCommand });
      throw new NotFound('User not found to login ');
    }
    await this._userRepository.updateOne(
      { userId: userCommand?.userId },
      {
        numberOrder: (user?.numberOrder || []).concat({
          isValidate: false,
          madeAt: new Date().toISOString()
        })
      },
      user
    );
    const command: UserOrderedEntity = await this._userCommandRepository.findById(userCommand._id);
    if (command) {
      if (isEqual(command, userCommand)) {
        new WinstonLogger()
          .logger()
          .info(`Command already store no need to update`, { userCommand });
        return;
      }
      await this._userCommandRepository.updateOne(
        { userOrderedId: userCommand.userOrderedId },
        merge(command, userCommand),
        merge(command, userCommand)
      );
      context.getResponse().status(204).send('order update');
    } else {
      await this._userCommandRepository.save(userCommand);
      context.getResponse().status(204).send('order create');
    }
  }
}