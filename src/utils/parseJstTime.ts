/** Parses any JST time string and returns 24-hour hours and minutes.
 *  Handles: "21:00 JST", "21:00〜23:15 JST (開場 20:45)", "8:30 PM JST", "7:00 AM JST"
 */
export function parseJstHoursMinutes(time: string): { hours: number; minutes: number } {
  const match = time.match(/(\d{1,2}):(\d{2})/)
  let hours = match ? parseInt(match[1], 10) : 23
  const minutes = match ? parseInt(match[2], 10) : 59
  if (/pm/i.test(time) && hours < 12) hours += 12
  if (/am/i.test(time) && hours === 12) hours = 0
  return { hours, minutes }
}
