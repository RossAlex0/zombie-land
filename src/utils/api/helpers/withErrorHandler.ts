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

      // Erreurs de validation Zod : 400 lisible avec le détail par champ
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        for (const issue of error.issues) {
          const field = String(issue.path[0]);
          if (field && !errors[field]) errors[field] = issue.message;
        }
        return NextResponse.json({ message: 'Champs invalides', errors }, { status: 400 });
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
