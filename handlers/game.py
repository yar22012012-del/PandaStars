from aiogram import Router
from aiogram.types import CallbackQuery

import asyncio
import random


from database.db import (
    get_balance,
    add_balance
)


from keyboards.game import game_keyboard
from keyboards.menu import back_button



router = Router()



# Обычный кейс ⭐5

REAL_PRIZES = [

    (0, 45),   # ничего

    (1, 25),   # 1 звезда

    (3, 15),   # 3 звезды

    (7, 8),    # 7 звезд

    (18, 5),   # 18 звезд

    (27, 2)    # 27 звезд

]



# Демо режим (улучшенные шансы)

DEMO_PRIZES = [

    (0, 10),   # ничего 10%

    (1, 30),   # 1 звезда 30%

    (3, 20),   # 3 звезды 20%

    (7, 12),   # 7 звезд 12%

    (18, 7),   # 18 звезд 7%

    (27, 21)   # 27 звезд 21%

]





def get_prize(table):

    result = []


    for prize, chance in table:

        result += [prize] * chance


    return random.choice(result)





async def spin(callback: CallbackQuery):

    slots = [

        "🍒 ⭐ 🍋",

        "⭐ 💎 🍀",

        "🍀 🍒 ⭐",

        "💎 ⭐ 🍋",

        "🎰 🎰 🎰"

    ]


    for slot in slots:


        await callback.message.edit_text(

            "🎰 <b>Крутится...</b>\n\n"

            f"{slot}",

            parse_mode="HTML"

        )


        await asyncio.sleep(0.7)







@router.callback_query(lambda c: c.data == "game")
async def game_menu(callback: CallbackQuery):


    await callback.answer()


    await callback.message.edit_text(

        "🎰 <b>Panda Case</b>\n\n"

        "🎰 Обычный кейс\n"
        "Стоимость: ⭐5\n\n"

        "🎮 Демо режим\n"
        "Бесплатно\n\n"

        "Испытай свою удачу!",

        reply_markup=game_keyboard(),

        parse_mode="HTML"

    )







# =====================
# ДЕМО КЕЙС
# =====================


@router.callback_query(lambda c: c.data == "demo_case")
async def demo_case(callback: CallbackQuery):


    await callback.answer()


    await spin(callback)



    prize = get_prize(DEMO_PRIZES)



    if prize == 0:


        text = (

            "🎮 <b>DEMO MODE</b>\n\n"

            "😢 Не повезло\n\n"

            "Выигрыш: ⭐0\n\n"

            "Баланс не изменён"

        )


    else:


        text = (

            "🎮 <b>DEMO MODE</b>\n\n"

            "🎉 Поздравляем!\n\n"

            f"Вы выиграли ⭐{prize}\n\n"

            "Баланс не изменён"

        )





    await callback.message.edit_text(

        text,

        reply_markup=back_button(),

        parse_mode="HTML"

    )








# =====================
# НАСТОЯЩИЙ КЕЙС
# =====================


@router.callback_query(lambda c: c.data == "open_case")
async def open_case(callback: CallbackQuery):


    user_id = callback.from_user.id



    balance = await get_balance(user_id)



    if balance < 5:


        await callback.answer(

            "❌ Недостаточно Stars\nНужно ⭐5",

            show_alert=True

        )

        return





    # списываем 5 звезд

    await add_balance(

        user_id,

        -5

    )



    await callback.answer()



    await spin(callback)



    prize = get_prize(REAL_PRIZES)





    if prize > 0:


        await add_balance(

            user_id,

            prize

        )


        text = (

            "🎰 <b>Кейс открыт!</b>\n\n"

            "🎉 Вы выиграли:\n"

            f"⭐{prize}"

        )


    else:


        text = (

            "🎰 <b>Кейс открыт!</b>\n\n"

            "😢 Пусто...\n\n"

            "Выигрыш: ⭐0"

        )





    await callback.message.edit_text(

        text,

        reply_markup=back_button(),

        parse_mode="HTML"

    )