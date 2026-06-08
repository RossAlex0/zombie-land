import { NextContext } from '@customTypes/nextApi';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { HttpError } from '../../errors/errors';

export type Controller<T> = (req: NextRequest, context: NextContext<T>) => Promise<NextResponse>;

export function withErrorHandler<T>(controller: Controller<T>) {
  return async (req: NextRequest, context: NextContext<T>): Promise<NextResponse> => {
    try {
      return await controller(req, context);
    } catch (error) {
      console.error(`Controller returned an error`, error);

      if (error instanceof ZodError) {
        return NextResponse.json(
          { message: 'Validation error', code: 'BAD_REQUEST', errors: error.issues },
          { status: 400 }
        );
      }

      if (!(error instanceof HttpError) || (error.code && error.statusCode === 500)) {
        return NextResponse.json(
          { message: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.statusCode }
      );
    }
  };
}
