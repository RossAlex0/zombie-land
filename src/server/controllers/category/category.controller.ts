import { NextContext } from '@customTypes/nextApi';
import { categoryCreateSchema } from '@server/schemas';
import { CategoryModel } from '@server/services';
import { NextRequest, NextResponse } from 'next/server';

export const categoryController = {
  readAllCategories: async () => {
    const categoryService = new CategoryModel();
    const categories = await categoryService.readAll();
    return NextResponse.json({ data: categories }, { status: 200 });
  },

  readCategoryById: async (req: NextRequest, context: NextContext<{ categoryId: string }>) => {
    const { categoryId } = await context.params;
    const categoryService = new CategoryModel();
    const category = await categoryService.getCategoryById(Number(categoryId));
    return NextResponse.json({ data: category }, { status: 200 });
  },

  create: async (req: NextRequest) => {
    const body = await req.json();
    const { label } = categoryCreateSchema.parse(body);

    const categoryService = new CategoryModel();
    const category = await categoryService.create({ data: { label } });
    return NextResponse.json({ data: category }, { status: 201 });
  },
};
