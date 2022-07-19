import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
  GetCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from '@micro-videos/core/category/application';
import { UseCase } from '@micro-videos/core/@seedwork/application';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;
  let createCategoryUseCase: CreateCategoryUseCase.UseCase;
  let updateCategoryUseCase: UpdateCategoryUseCase.UseCase;
  let deleteCategoryUseCase: DeleteCategoryUseCase.UseCase;
  let getCategoryUseCase: GetCategoryUseCase.UseCase;
  let listCategoryUseCase: ListCategoriesUseCase.UseCase;

  beforeEach(async () => {
    const mockUseCase: UseCase<any, any> = {
      execute: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CreateCategoryUseCase.UseCase,
          useFactory: () => mockUseCase,
        },
        {
          provide: ListCategoriesUseCase.UseCase,
          useFactory: () => mockUseCase,
        },
        {
          provide: GetCategoryUseCase.UseCase,
          useFactory: () => mockUseCase,
        },
        {
          provide: UpdateCategoryUseCase.UseCase,
          useFactory: () => mockUseCase,
        },
        {
          provide: DeleteCategoryUseCase.UseCase,
          useFactory: () => mockUseCase,
        },
      ],
    }).compile();

    createCategoryUseCase = moduleRef.get<CreateCategoryUseCase.UseCase>(
      CreateCategoryUseCase.UseCase,
    );
    updateCategoryUseCase = moduleRef.get<UpdateCategoryUseCase.UseCase>(
      UpdateCategoryUseCase.UseCase,
    );
    deleteCategoryUseCase = moduleRef.get<DeleteCategoryUseCase.UseCase>(
      DeleteCategoryUseCase.UseCase,
    );
    getCategoryUseCase = moduleRef.get<GetCategoryUseCase.UseCase>(
      GetCategoryUseCase.UseCase,
    );
    listCategoryUseCase = moduleRef.get<ListCategoriesUseCase.UseCase>(
      ListCategoriesUseCase.UseCase,
    );
    controller = moduleRef.get<CategoriesController>(CategoriesController);
  });

  it('should create a category', async () => {
    const output: CreateCategoryUseCase.Output = {
      id: '745ea3de-c65e-4557-bfe7-b486d5693e4e',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    jest.spyOn(createCategoryUseCase, 'execute').mockResolvedValue(output);

    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };
    const response = await controller.create(input);

    expect(createCategoryUseCase.execute).toHaveBeenCalledWith(input);
    expect(response).toStrictEqual(output);
  });

  it('should update a category', async () => {
    const id = '745ea3de-c65e-4557-bfe7-b486d5693e4e';
    const output: UpdateCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    jest.spyOn(createCategoryUseCase, 'execute').mockResolvedValue(output);

    const input: UpdateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };
    const response = await controller.update(id, input);

    expect(updateCategoryUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
    expect(response).toStrictEqual(output);
  });

  it('should delete a category', async () => {
    const output = undefined;
    jest.spyOn(createCategoryUseCase, 'execute').mockResolvedValue(output);

    const id = '745ea3de-c65e-4557-bfe7-b486d5693e4e';
    const response = await controller.remove(id);

    expect(deleteCategoryUseCase.execute).toHaveBeenCalledWith({ id });
    expect(response).toStrictEqual(output);
  });

  it('should get a category', async () => {
    const id = '745ea3de-c65e-4557-bfe7-b486d5693e4e';
    const output: GetCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    jest.spyOn(getCategoryUseCase, 'execute').mockResolvedValue(output);

    const response = await controller.findOne(id);

    expect(getCategoryUseCase.execute).toHaveBeenCalledWith({ id });
    expect(response).toStrictEqual(output);
  });

  it('should list categories', async () => {
    const output: ListCategoriesUseCase.Output = {
      current_page: 1,
      items: [
        {
          id: '745ea3de-c65e-4557-bfe7-b486d5693e4e',
          name: 'Movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    jest.spyOn(listCategoryUseCase, 'execute').mockResolvedValue(output);

    const input: ListCategoriesUseCase.Input = {
      page: 1,
      per_page: 1,
    };
    const response = await controller.search(input);

    expect(listCategoryUseCase.execute).toHaveBeenCalledWith(input);
    expect(response).toStrictEqual(output);
  });
});
