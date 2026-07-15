from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message, CallbackQuery

from aiogram.enums import ChatMemberStatus


from database.db import (
    get_user,
    add_user,
    add_referral
)


from keyboards.menu import main_menu

from keyboards.subscribe import subscribe_keyboard



router = Router()



CHANNEL_ID = -1003948068522



waiting_ref = {}





@router.message(CommandStart())
async def start(message: Message):


    user = await get_user(
        message.from_user.id
    )


    if user is None:


        args = message.text.split()


        ref = 0


        if len(args) > 1:


            try:

                ref = int(args[1])

            except:

                ref = 0



        waiting_ref[
            message.from_user.id
        ] = ref



        await message.answer(

            "👋 Добро пожаловать в Panda Stars ⭐\n\n"

            "Чтобы пользоваться ботом,\n"
            "подпишитесь на наш канал:",

            reply_markup=subscribe_keyboard()

        )


        return




    await message.answer(

        "⭐ Panda Stars\n\n"
        "Главное меню:",

        reply_markup=main_menu()

    )







@router.callback_query(lambda c: c.data=="check_sub")
async def check_sub(callback: CallbackQuery):


    member = await callback.bot.get_chat_member(

        CHANNEL_ID,

        callback.from_user.id

    )



    if member.status in [

        ChatMemberStatus.LEFT,

        ChatMemberStatus.KICKED

    ]:


        await callback.answer(

            "❌ Вы не подписались",

            show_alert=True

        )


        return




    ref = waiting_ref.get(

        callback.from_user.id,

        0

    )



    await add_user(

        callback.from_user.id,

        callback.from_user.username,

        ref

    )



    if ref:


        await add_referral(ref)



    await callback.message.edit_text(

        "✅ Подписка подтверждена!\n\n"
        "Добро пожаловать в Panda Stars ⭐",

        reply_markup=main_menu()

    )