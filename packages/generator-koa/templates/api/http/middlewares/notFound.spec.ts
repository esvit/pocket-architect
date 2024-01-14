import notFoundMiddleware from './notFound';

test('notFoundMiddleware', async () => {
    const func = notFoundMiddleware();
    const ctx = {
        status: 0,
        body: null
    };
    func(ctx);
    expect(ctx).toEqual({
        status: 405,
        body: 'Method Not Allowed'
    });
});
