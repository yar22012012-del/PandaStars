from aiogram import Router
from aiogram.types import CallbackQuery


from database.db import (
    get_balance,
    add_balance
)


from keyboards.menu import back_button


from keyboards.gifts import gifts_keyboard



router = Router()





# =========================
# ОТКРЫТЬ ПОДАРКИ
# =========================


@router.callback_query(lambda c: c.data == "gifts")
async def gifts(callback: CallbackQuery):


    await callback.message.edit_text(

        "🎁 <b>Вывод подарков</b>\n\n"

        "Выберите подарок:\n\n"

        "⭐15 — 🧸 Мишка, ❤️ Сердце\n"

        "⭐25 — 🌹 Роза, 🎁 Коробка\n"

        "⭐50 — 🍺 Пиво, 🎂 Торт, 💐 Цветы, 🚀 Ракета\n"

        "⭐100 — 🏆 Кубок, 💍 Кольцо, 💎 Бриллиант",

        reply_markup=gifts_keyboard(),

        parse_mode="HTML"

    )





# =========================
# ВЫБОР ПОДАРКА
# =========================


@router.callback_query(
    lambda c: c.data.startswith("gift_")
)
async def select_gift(callback: CallbackQuery):


    data = callback.data.split("_")



    price = int(data[1])



    name = data[2]



    balance = await get_balance(

        callback.from_user.id

    )



    if balance < price:


        await callback.answer(

            f"❌ Недостаточно Stars\n\n"
            f"Нужно: ⭐{price}\n"
            f"Ваш баланс: ⭐{balance}",

            show_alert=True

        )

        return





    # списание Stars

    await add_balance(

        callback.from_user.id,

        -price

    )




    await callback.message.edit_text(

        "✅ <b>Заявка создана!</b>\n\n"

        f"🎁 Подарок: {name}\n"

        f"⭐ Цена: {price}\n\n"

        "Администратор:\n"

        "@Momelop\n\n"

        "Ожидайте выдачи подарка.",

        reply_markup=back_button(),

        parse_mode="HTML"

    )