import { NextContext } from '@customTypes/nextApi';
import { NextRequest, NextResponse } from 'next/server';
import { HttpError } from '../../errors/errors';

export type Controller<T> = (req: NextRequest, context: NextContext<T>) => Promise<NextResponse>;

export function withErrorHandler<T>(controller: Controller<T>) {
  return async (req: NextRequest, context: NextContext<T>): Promise<NextResponse> => {
    try {
      return await controller(req, context);
    } catch (error) {
      console.log(`controller returned an error`);

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
