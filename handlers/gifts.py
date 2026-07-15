from aiogram import Router
from aiogram.types import CallbackQuery

from config import ADMIN_ID, SECOND_ADMIN_ID

from database.db import (
    get_balance,
    add_balance,
    get_referrals
)

from keyboards.menu import back_button
from keyboards.gifts import gifts_keyboard


router = Router()


# =========================
# ОТКРЫТЬ ПОДАРКИ
# =========================

@router.callback_query(lambda c: c.data == "gifts")
async def gifts(callback: CallbackQuery):

    referrals = await get_referrals(callback.from_user.id)

    if referrals >= 5:

        status = (
            "✅ <b>Требование выполнено!</b>\n\n"
            f"👥 Ваш прогресс: {referrals}/5\n\n"
        )

    else:

        status = (
            "❗ <b>Для вывода требуется:</b>\n\n"
            "👥 Минимум 5 приглашённых друзей,\n"
            "активировавших бота.\n\n"
            f"📊 Ваш прогресс: {referrals}/5\n\n"
        )

    await callback.message.edit_text(

        "🎁 <b>Вывод подарков</b>\n\n"

        + status +

        "━━━━━━━━━━━━━━━━━━\n\n"

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

@router.callback_query(lambda c: c.data.startswith("gift_"))
async def select_gift(callback: CallbackQuery):

    data = callback.data.split("_")

    price = int(data[1])

    name = data[2]

    referrals = await get_referrals(callback.from_user.id)

    if referrals < 5:

        await callback.answer(
            "❌ Для вывода требуется минимум 5 приглашённых друзей, активировавших бота.",
            show_alert=True
        )

        return

    balance = await get_balance(
        callback.from_user.id
    )

    if balance < price:

        await callback.answer(
            f"❌ Недостаточно Stars\n\n"
            f"Нужно: ⭐{price}\n"
            f"Баланс: ⭐{balance}",
            show_alert=True
        )

        return

    await add_balance(
        callback.from_user.id,
        -price
    )

    username = callback.from_user.username

    if username:
        user_text = f"@{username}"
    else:
        user_text = "без username"

    message = (
        "🔔 <b>Новая заявка на вывод!</b>\n\n"
        f"👤 Пользователь: {user_text}\n"
        f"🆔 ID: {callback.from_user.id}\n\n"
        f"🎁 Подарок: {name}\n"
        f"⭐ Цена: {price}"
    )
        # сообщение тебе
    await callback.bot.send_message(
        ADMIN_ID,
        message,
        parse_mode="HTML"
    )

    # сообщение второму администратору
    await callback.bot.send_message(
        SECOND_ADMIN_ID,
        message,
        parse_mode="HTML"
    )

    # сообщение игроку
    await callback.message.edit_text(

        "✅ <b>Заявка создана!</b>\n\n"

        f"🎁 Подарок: {name}\n"
        f"⭐ Цена: {price}\n\n"

        "Ожидайте выдачи подарка.",

        reply_markup=back_button(),

        parse_mode="HTML"

    )