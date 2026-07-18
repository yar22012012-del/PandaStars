from aiohttp import web

from database.sync import (
    ensure_user,
    get_user_data,
    set_balance,
    set_last_free_case,
)


async def cors_middleware(app, handler):
    async def middleware(request):
        if request.method == 'OPTIONS':
            response = web.Response()
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
            return response

        response = await handler(request)
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

    return middleware


async def handle_get_user(request):
    user_id = int(request.match_info['user_id'])
    username = request.query.get('username', '')
    await ensure_user(user_id, username)
    data = await get_user_data(user_id)
    return web.json_response(data)


async def handle_post_user(request):
    user_id = int(request.match_info['user_id'])
    payload = await request.json()
    username = payload.get('username', '')
    await ensure_user(user_id, username)

    if 'balance' in payload:
        await set_balance(user_id, int(payload['balance']))

    if 'last_free_case' in payload:
        await set_last_free_case(user_id, int(payload['last_free_case']))

    return web.json_response({'status': 'ok'})


def create_app():
    app = web.Application(middlewares=[cors_middleware])
    app.router.add_get('/api/user/{user_id}', handle_get_user)
    app.router.add_post('/api/user/{user_id}', handle_post_user)
    return app


async def start_api(host='127.0.0.1', port=8080):
    app = create_app()
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, host, port)
    await site.start()
    print(f'🌐 Panda API запущен на http://{host}:{port}')
    return runner
