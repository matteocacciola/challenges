import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { dbDataSource } from './app.datasource';
import { UsersModule } from './users/users.module';
import { TravelsModule } from './travels/travels.module';
import { ToursModule } from './tours/tours.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { AppResolver } from './app.resolver';
import { AccessControlService } from './auth/access-control.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { Role } from './roles/roles.entity';
import { User } from './users/users.entity';

@Global()
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot(dbDataSource),
    TypeOrmModule.forFeature([Role, User]),
    AuthModule,
    UsersModule,
    TravelsModule,
    ToursModule,
    RolesModule,
  ],
  providers: [AppResolver, AccessControlService, AuthService, UsersService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'graphql',
      method: RequestMethod.ALL,
    });
  }
}
