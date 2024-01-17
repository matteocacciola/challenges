import { DataSource, Repository as TypeOrmRepository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';

export class Repository<T> extends TypeOrmRepository<T> {
  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(
      entity,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }
}
