import asyncio


from aiogram import Bot, Dispatcher


from config import BOT_TOKEN


from database.db import create_database


from handlers.start import router as start_router
from handlers.menu import router as menu_router
from handlers.clicker import router as clicker_router
from handlers.gifts import router as gifts_router
from handlers.game import router as game_router
from handlers.admin import admin_router
from api import start_api


bot = Bot(
    token=BOT_TOKEN
)



dp = Dispatcher()



async def main():

    print("🚀 Panda Stars запускается...")


    await create_database()

    await start_api(host='127.0.0.1', port=8080)


    dp.include_router(
        start_router
    )


    dp.include_router(
        menu_router
    )


    dp.include_router(
        clicker_router
    )


    dp.include_router(
        gifts_router
    )


    dp.include_router(
        game_router
    )


    dp.include_router(
        admin_router
    )



    print(
        "✅ Panda Stars запущен"
    )



    await dp.start_polling(
        bot
    )




if __name__ == "__main__":

    asyncio.run(main())