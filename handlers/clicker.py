from aiogram import Router
from aiogram.types import CallbackQuery

import time


from database.db import (
    get_click,
    update_click,
    add_balance
)


from keyboards.menu import back_button



router = Router()



# 1 час в секундах

CLICK_TIME = 60 * 60





@router.callback_query(lambda c: c.data == "clicker")
async def clicker(callback: CallbackQuery):


    user_id = callback.from_user.id



    last_click = await get_click(

        user_id

    )



    now = int(time.time())



    if last_click:


        wait = CLICK_TIME - (now - last_click)



        if wait > 0:


            minutes = wait // 60



            await callback.message.edit_text(

                "🖱 <b>Кликер</b>\n\n"

                "⏳ Клик ещё недоступен\n\n"

                f"Попробуйте через: {minutes} минут",

                reply_markup=back_button(),

                parse_mode="HTML"

            )


            return





    await add_balance(

        user_id,

        1

    )


    await update_click(

        user_id

    )



    await callback.message.edit_text(

        "🎉 <b>Клик выполнен!</b>\n\n"

        "Вы получили:\n"

        "⭐ +1 Star\n\n"

        "Возвращайтесь через час!",

        reply_markup=back_button(),

        parse_mode="HTML"

    )