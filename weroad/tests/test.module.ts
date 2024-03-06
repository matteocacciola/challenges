import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { testDbDataSource } from '../src/app.datasource';
import { Role } from '../src/roles/roles.entity';
import { User } from '../src/users/users.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { TravelsModule } from '../src/travels/travels.module';
import { ToursModule } from '../src/tours/tours.module';
import { RolesModule } from '../src/roles/roles.module';
import { AppResolver } from '../src/app.resolver';
import { AccessControlService } from '../src/auth/access-control.service';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { AuthMiddleware } from '../src/auth/auth.middleware';

@Global()
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot(testDbDataSource),
    TypeOrmModule.forFeature([Role, User]),
    AuthModule,
    UsersModule,
    TravelsModule,
    ToursModule,
    RolesModule,
  ],
  providers: [AppResolver, AccessControlService, AuthService, UsersService],
})
export class TestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'graphql',
      method: RequestMethod.ALL,
    });
  }
}
