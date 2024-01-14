export default
function notFoundMiddleware() {
    return (ctx) => {
        ctx.status = 405;
        ctx.body = 'Method Not Allowed';
    };
}
