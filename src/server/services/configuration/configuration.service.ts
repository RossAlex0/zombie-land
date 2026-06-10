import { AbstractModel } from '@server/services/AbstractModel';

export class ConfigurationModel extends AbstractModel<'configuration'> {
  constructor() {
    super('configuration');
  }

  readSingleton() {
    return this.table.findFirst();
  }
}
