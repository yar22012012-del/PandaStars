import aiosqlite
import time


DATABASE = "database/panda.db"



async def create_database():

    async with aiosqlite.connect(DATABASE) as db:

        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS users(

                id INTEGER PRIMARY KEY,

                username TEXT,

                balance INTEGER DEFAULT 0,

                total_earned INTEGER DEFAULT 0,

                referrals INTEGER DEFAULT 0,

                referred_by INTEGER DEFAULT 0,

                last_click INTEGER DEFAULT 0,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            )
            """
        )


        # добавление новой колонки для старой базы
        try:

            await db.execute(
                """
                ALTER TABLE users
                ADD COLUMN total_earned INTEGER DEFAULT 0
                """
            )

        except:

            pass


        await db.commit()





async def get_user(user_id):

    async with aiosqlite.connect(DATABASE) as db:

        cursor = await db.execute(
            """
            SELECT *
            FROM users
            WHERE id=?
            """,
            (user_id,)
        )

        return await cursor.fetchone()





async def add_user(user_id, username, ref=0):

    async with aiosqlite.connect(DATABASE) as db:

        await db.execute(
            """
            INSERT OR IGNORE INTO users
            (
                id,
                username,
                referred_by
            )

            VALUES(?,?,?)

            """,
            (
                user_id,
                username,
                ref
            )
        )


        await db.commit()





async def add_referral(user_id):

    async with aiosqlite.connect(DATABASE) as db:

        await db.execute(
            """
            UPDATE users

            SET

            balance = balance + 4,

            total_earned = total_earned + 4,

            referrals = referrals + 1

            WHERE id=?

            """,
            (user_id,)
        )


        await db.commit()





async def get_balance(user_id):

    async with aiosqlite.connect(DATABASE) as db:

        cursor = await db.execute(
            """
            SELECT balance

            FROM users

            WHERE id=?

            """,
            (user_id,)
        )


        result = await cursor.fetchone()


        if result:

            return result[0]


        return 0





async def add_balance(user_id, amount):

    async with aiosqlite.connect(DATABASE) as db:

        await db.execute(
            """
            UPDATE users

            SET

            balance = balance + ?,

            total_earned = total_earned +
            CASE
                WHEN ? > 0 THEN ?
                ELSE 0
            END

            WHERE id=?

            """,
            (
                amount,
                amount,
                amount,
                user_id
            )
        )


        await db.commit()





async def get_total_earned(user_id):

    async with aiosqlite.connect(DATABASE) as db:

        cursor = await db.execute(
            """
            SELECT total_earned

            FROM users

            WHERE id=?

            """,
            (user_id,)
        )


        result = await cursor.fetchone()


        if result:

            return result[0]


        return 0





async def get_profile(user_id):

    async with aiosqlite.connect(DATABASE) as db:

        cursor = await db.execute(
            """
            SELECT *

            FROM users

            WHERE id=?

            """,
            (user_id,)
        )


        return await cursor.fetchone()





async def get_referrals(user_id):

    async with aiosqlite.connect(DATABASE) as db:

        cursor = await db.execute(
            """
            SELECT referrals

            FROM users

            WHERE id=?

            """,
            (user_id,)
        )


        result = await cursor.fetchone()


        if result:

            return result[0]


        return 0





async def get_top_referrals():

    async with aiosqlite.connect(DATABASE) as db:

        cursor = await db.execute(
            """
            SELECT username, referrals

            FROM users

            ORDER BY referrals DESC

            LIMIT 10

            """
        )


        return await cursor.fetchall()





async def get_click(user_id):

    async with aiosqlite.connect(DATABASE) as db:

        cursor = await db.execute(
            """
            SELECT last_click

            FROM users

            WHERE id=?

            """,
            (user_id,)
        )


        result = await cursor.fetchone()


        if result:

            return result[0]


        return 0





async def update_click(user_id):

    async with aiosqlite.connect(DATABASE) as db:

        await db.execute(
            """
            UPDATE users

            SET last_click=?

            WHERE id=?

            """,
            (
                int(time.time()),
                user_id
            )
        )


        await db.commit()