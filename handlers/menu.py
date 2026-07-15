from aiogram import Router
from aiogram.types import CallbackQuery


from database.db import (
    get_balance,
    get_profile,
    get_referrals,
    get_top_referrals,
    get_total_earned
)


from keyboards.menu import (
    main_menu,
    back_button
)



router = Router()



# =========================
# НАЗАД В МЕНЮ
# =========================


@router.callback_query(lambda c: c.data == "back")
async def back(callback: CallbackQuery):


    await callback.message.edit_text(


        "⭐ <b>Panda Stars</b>\n\n"
        "Выберите раздел:",


        reply_markup=main_menu(),


        parse_mode="HTML"

    )




# =========================
# БАЛАНС
# =========================


@router.callback_query(lambda c: c.data == "balance")
async def balance(callback: CallbackQuery):


    money = await get_balance(

        callback.from_user.id

    )


    await callback.message.edit_text(


        "⭐ <b>Ваш баланс</b>\n\n"


        f"У вас: ⭐ {money} Stars",


        reply_markup=back_button(),


        parse_mode="HTML"

    )





# =========================
# ПРОФИЛЬ
# =========================


@router.callback_query(lambda c: c.data == "profile")
async def profile(callback: CallbackQuery):


    user = await get_profile(

        callback.from_user.id

    )


    if user is None:


        await callback.answer(

            "❌ Профиль не найден",

            show_alert=True

        )

        return




    balance = await get_balance(

        callback.from_user.id

    )


    total = await get_total_earned(

        callback.from_user.id

    )


    friends = await get_referrals(

        callback.from_user.id

    )



    if callback.from_user.username:


        username = "@" + callback.from_user.username


    else:


        username = "Без username"




    link = (

        "https://t.me/pandastarsobot"

        f"?start={callback.from_user.id}"

    )




    await callback.message.edit_text(


        "👤 <b>ВАШ ПРОФИЛ</b>\n\n"


        f"🐼 Пользователь: {username}\n"

        f"🆔 ID: <code>{callback.from_user.id}</code>\n\n"


        f"⭐ Баланс: {balance}\n"

        f"💰 Всего заработано: {total}⭐\n\n"


        f"👥 Всего друзей: {friends}\n\n"


        "🔗 Ваша реферальная ссылка:\n"

        f"<code>{link}</code>",



        reply_markup=back_button(),


        parse_mode="HTML"

    )





# =========================
# ДРУЗЬЯ
# =========================


@router.callback_query(lambda c: c.data == "friends")
async def friends(callback: CallbackQuery):


    count = await get_referrals(

        callback.from_user.id

    )


    link = (

        "https://t.me/pandastarsobot"

        f"?start={callback.from_user.id}"

    )



    await callback.message.edit_text(


        "👥 <b>Реферальная система</b>\n\n"


        f"Приглашено друзей: {count}\n\n"


        "⭐ За каждого друга: +4 Stars\n\n"


        "Ваша ссылка:\n"

        f"<code>{link}</code>",


        reply_markup=back_button(),


        parse_mode="HTML"

    )





# =========================
# ТОП 10
# =========================


@router.callback_query(lambda c: c.data == "top")
async def top(callback: CallbackQuery):


    users = await get_top_referrals()



    text = "🏆 <b>ТОП 10 РЕФЕРАЛОВ</b>\n\n"



    if not users:


        text += "Пока никого нет"



    else:


        place = 1


        for user in users:


            username = user[0]


            if username:


                name = "@" + username


            else:


                name = "Без username"



            text += (

                f"{place}. {name} — "

                f"{user[1]} 👥\n"

            )


            place += 1




    await callback.message.edit_text(


        text,


        reply_markup=back_button(),


        parse_mode="HTML"

    )





# =========================
# ЗАДАНИЯ
# =========================


@router.callback_query(lambda c: c.data == "tasks")
async def tasks(callback: CallbackQuery):


    await callback.message.edit_text(


        "📋 <b>Задания</b>\n\n"

        "⭐ Здесь скоро появятся задания.",


        reply_markup=back_button(),


        parse_mode="HTML"

    )