import { errorMiddleware } from './error';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../../libs/error';

test('errorMiddleware', async () => {
    const Logger = {
        error: jest.fn()
    };
    const logException = jest.fn();
    const func = errorMiddleware({ Logger });
    const state = {
        getIpAddress: () => '127.0.0.1',
        user: {
            Id: 1,
            Email: 'test@itfin.io'
        },
        scope: {
            resolve: jest.fn().mockImplementation(() => jest.fn())
        }
    };
    const ctx = {
        status: 0,
        body: null,
        state,
        badRequest: jest.fn(),
        ok: jest.fn(),
        forbidden: jest.fn(),
        notFound: jest.fn(),
        internalServerError: jest.fn(),
    };
    const err = new Error('Test');
    await func(ctx, async () => {
        throw err;
    });
    expect(logException).toHaveBeenCalledWith(err, state.user, '127.0.0.1');
    expect(ctx.status).toEqual(500);
    expect(ctx.body).toEqual('{"message":"Test"}');
    logException.mockClear();
    await func(ctx, async () => {
        throw new BadRequestError('Invalid field');
    });
    expect(ctx.badRequest).toHaveBeenCalledWith({ message: 'Invalid field' });
    logException.mockClear();
    ctx.badRequest.mockClear();
    await func(ctx, async () => {
        throw new ForbiddenError('No access');
    });
    expect(ctx.forbidden).toHaveBeenCalledWith({ message: 'No access' });
    logException.mockClear();
    ctx.forbidden.mockClear();
    await func(ctx, async () => {
        throw new NotFoundError('Not found');
    });
    expect(ctx.notFound).toHaveBeenCalledWith({ message: 'Not found' });
});
