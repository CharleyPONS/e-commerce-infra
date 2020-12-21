import { BodyParams, Context, Controller, Delete, Get, PathParams, Post } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Status, Summary } from '@tsed/schema';

import { UserEntity } from '../entity/user.entity';
import { UserRepository } from '../services/user.repository';
import { UserDeleteTokenService } from '../services/userDeleteToken.service';
import { UserLogInService } from '../services/userLogIn.service';

@Controller({
  path: '/user'
})
export class UserCtrl {
  constructor(
    private _userRepository: UserRepository,
    private _userLoginService: UserLogInService,
    private _userDeleteTokenService: UserDeleteTokenService
  ) {}

  @Get('/:id')
  @Summary('Return a User from his ID')
  @(Status(200, UserEntity).Description('Success'))
  async getUser(@PathParams('id') id: string): Promise<UserEntity> {
    const user = await this._userRepository.findById(id);

    if (user) {
      return user;
    }

    throw new NotFound('User not present');
  }

  @Delete('/:id')
  @Summary('Delete a User from his ID')
  @(Status(204, UserEntity).Description('Success delete'))
  async deleteUser(@PathParams('id') id: string): Promise<UserEntity> {
    const user = await this._userRepository.delete(id);
    if (user) {
      return user;
    }
    throw new NotFound('User not found so not deleted');
  }

  @Post('/signIn')
  @Summary('Return JWT token if sign in succeed')
  @(Status(200, UserEntity).Description('Success'))
  async logInUser(
    @Context() ctx: Context,
    @BodyParams('user') userBody: UserEntity
  ): Promise<UserEntity> {
    const user: UserEntity = await this._userLoginService.main(ctx, userBody);
    return ctx.getResponse().status(200).send(user);
  }

  @Post('/logout')
  @Summary('Delete JWT token')
  @(Status(200).Description('Success'))
  async logOut(@Context() ctx: Context, @BodyParams('user') userBody: UserEntity): Promise<void> {
    await this._userDeleteTokenService.main(userBody);
    return;
  }
}