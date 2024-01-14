import {
  RequestValidationError, BadRequestError, ForbiddenError, NotFoundError, ResponseValidationError
} from '../../../libs/error';

export
function devErrorMiddleware({ Logger }) {
  return async (ctx, next):Promise<void> => {
    try {
      await next();
    } catch (err) {
      Logger.error(err);
      // logException(err, ctx.state.user, ctx.state.getIpAddress());
      if (err instanceof RequestValidationError) {
        ctx.badRequest({ message: err.message, data: err.data });
      }
      else if (err && err.name === 'SequelizeDatabaseError' && err.message === 'Query was empty') {
        ctx.ok({ message: 'No fields to update' });
      }
      else if (err instanceof BadRequestError) {
        ctx.badRequest({ message: err.message });
      }
      else if (err instanceof ForbiddenError) {
        ctx.forbidden({ message: err.message });
      }
      else if (err instanceof NotFoundError) {
        ctx.notFound({ message: err.message });
      }
      else if (err instanceof ResponseValidationError) {
        ctx.internalServerError({ message: err.message });
      }
      else {
        ctx.status = (err && err.statusCode) || 500;
        ctx.body = JSON.stringify(err && (err.toJSON ? err.toJSON() : { message: err.message, ...err }));
      }
    }
  };
}

export
function errorMiddleware({ Logger }) {
  return async (ctx, next):Promise<void> => {
    try {
      await next();
    } catch (err) {
      Logger.error(err);
      // logException(err, ctx.state.user, ctx.state.getIpAddress());
      if (err instanceof RequestValidationError) {
        ctx.badRequest({ message: err.message, data: err.data });
      } else if (err instanceof BadRequestError) {
        ctx.badRequest({ message: err.message });
      } else if (err instanceof ForbiddenError) {
        ctx.forbidden({ message: err.message });
      } else if (err instanceof NotFoundError) {
        ctx.notFound({ message: err.message });
      } else {
        const $t = ctx.state.scope.resolve('$t');
        ctx.internalServerError({
          message: $t('sorrySomethingWentWrongPleaseTryAgainOrContactSupport')
        });
      }
    }
  };
}
