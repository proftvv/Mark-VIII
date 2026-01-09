import { sql } from '@vercel/postgres'

export async function logActivity(
  userId: number,
  action: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await sql`
      INSERT INTO activity_log (user_id, action, ip_address, user_agent)
      VALUES (${userId}, ${action}, ${ipAddress}, ${userAgent})
    `
  } catch (error) {
    console.error('Activity logging error:', error)
    // Don't throw - logging errors shouldn't break the app
  }
}

export async function getActivityLog(userId: number, limit = 20) {
  try {
    const result = await sql`
      SELECT id, action, ip_address, user_agent, created_at
      FROM activity_log
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return result.rows
  } catch (error) {
    console.error('Get activity log error:', error)
    return []
  }
}
