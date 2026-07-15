from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton



def game_keyboard():

    return InlineKeyboardMarkup(

        inline_keyboard=[

            [

                InlineKeyboardButton(
                    text="🎰 Открыть кейс ⭐5",
                    callback_data="open_case"
                )

            ],

            [

                InlineKeyboardButton(
                    text="🎮 Демо режим",
                    callback_data="demo_case"
                )

            ],

            [

                InlineKeyboardButton(
                    text="⬅️ Назад",
                    callback_data="back"
                )

            ]

        ]

    )