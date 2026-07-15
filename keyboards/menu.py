from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo


def main_menu():

    return InlineKeyboardMarkup(

        inline_keyboard=[

            [

                InlineKeyboardButton(
                    text="⭐ Баланс",
                    callback_data="balance"
                ),

                InlineKeyboardButton(
                    text="👤 Профиль",
                    callback_data="profile"
                )

            ],


            [

                InlineKeyboardButton(
                    text="👥 Друзья",
                    callback_data="friends"
                ),

                InlineKeyboardButton(
                    text="🏆 Топ рефералов",
                    callback_data="top"
                )

            ],


            [

                InlineKeyboardButton(
                    text="📋 Задания",
                    callback_data="tasks"
                ),

                InlineKeyboardButton(
                    text="🎁 Вывод",
                    callback_data="gifts"
                )

            ],


            [

                InlineKeyboardButton(
                    text="🎰 Кейс",
                    callback_data="game"
                ),

                InlineKeyboardButton(
                    text="🖱 Кликер",
                    callback_data="clicker"
                )

            ],


            [

                InlineKeyboardButton(
                    text="🌐 Mini App",
                    web_app=WebAppInfo(
                        url="https://yar22012012-del.github.io/PandaStars/"
                    )
                )

            ]

        ]

    )



def back_button():

    return InlineKeyboardMarkup(

        inline_keyboard=[

            [

                InlineKeyboardButton(
                    text="⬅️ Назад",
                    callback_data="back"
                )

            ]

        ]

    )