from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton




GIFTS = [

    ("🧸 Мишка",15),

    ("❤️ Сердце",15),


    ("🌹 Роза",25),

    ("🎁 Коробка",25),


    ("🍺 Пиво",50),

    ("🎂 Торт",50),

    ("💐 Цветы",50),

    ("🚀 Ракета",50),


    ("🏆 Кубок",100),

    ("💍 Кольцо",100),

    ("💎 Бриллиант",100)

]





def gifts_keyboard():

    buttons=[]


    for name,price in GIFTS:


        buttons.append(

            [

                InlineKeyboardButton(

                    text=f"{name} ⭐{price}",

                    callback_data=f"gift_{price}_{name}"

                )

            ]

        )



    return InlineKeyboardMarkup(

        inline_keyboard=buttons

    )