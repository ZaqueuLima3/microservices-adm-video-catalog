import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CatecoriesProviders } from './categories.providers';

@Module({
  controllers: [CategoriesController],
  providers: [
    ...Object.values(CatecoriesProviders.Repositories),
    ...Object.values(CatecoriesProviders.UseCases),
  ],
})
export class CategoriesModule {}
