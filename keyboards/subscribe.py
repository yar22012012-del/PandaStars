from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton



CHANNEL_LINK = "https://t.me/+gcLLLjToTmAxNjUy"




def subscribe_keyboard():

    return InlineKeyboardMarkup(

        inline_keyboard=[

            [

                InlineKeyboardButton(

                    text="📢 Подписаться на канал",

                    url=CHANNEL_LINK

                )

            ],


            [

                InlineKeyboardButton(

                    text="✅ Проверить подписку",

                    callback_data="check_sub"

                )

            ]

        ]

    )