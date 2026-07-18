import aiosqlite

DATABASE = "database/panda.db"


async def ensure_user(user_id, username=''):
    async with aiosqlite.connect(DATABASE) as db:
        await db.execute(
            """
            INSERT OR IGNORE INTO users (id, username) VALUES(?, ?)
            """,
            (user_id, username)
        )
        await db.commit()


async def get_user_data(user_id):
    async with aiosqlite.connect(DATABASE) as db:
        cursor = await db.execute(
            """
            SELECT balance, last_free_case FROM users WHERE id=?
            """,
            (user_id,)
        )
        row = await cursor.fetchone()
        if row:
            return {'balance': row[0] or 0, 'last_free_case': row[1] or 0}
        return {'balance': 0, 'last_free_case': 0}


async def set_balance(user_id, amount):
    async with aiosqlite.connect(DATABASE) as db:
        await db.execute(
            """
            UPDATE users SET balance = ? WHERE id=?
            """,
            (amount, user_id)
        )
        await db.commit()


async def set_last_free_case(user_id, timestamp):
    async with aiosqlite.connect(DATABASE) as db:
        await db.execute(
            """
            UPDATE users SET last_free_case = ? WHERE id=?
            """,
            (timestamp, user_id)
        )
        await db.commit()
