from aiogram import Router
from aiogram.types import Message

from config import ADMIN_ID

import aiosqlite


admin_router = Router()


DB_PATH = "database/panda.db"



@admin_router.message()
async def add_stars_admin(message: Message):

    # проверка владельца
    if message.from_user.id != ADMIN_ID:
        return


    if not message.text:
        return


    args = message.text.split()


    if args[0] != "/addstars":
        return



    if len(args) != 3:

        await message.answer(
            "Используй:\n"
            "/addstars ID количество"
        )

        return



    try:

        user_id = int(args[1])
        amount = int(args[2])

    except:

        await message.answer(
            "❌ Ошибка в числах"
        )

        return



    async with aiosqlite.connect(DB_PATH) as db:


        await db.execute(
            """
            UPDATE users
            SET balance = balance + ?
            WHERE id = ?
            """,
            (amount, user_id)
        )


        await db.commit()



    await message.answer(
        f"✅ Добавлено {amount}⭐ пользователю {user_id}"
    )