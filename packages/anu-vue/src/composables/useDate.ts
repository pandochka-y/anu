import dayjs from 'dayjs'

// import calendar from 'dayjs/plugin/calendar'
import ru from 'dayjs/locale/ru'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length)
  for (let i = 0; i < length; i++)
    valuesArray[i] = valueFunction(i)

  return valuesArray
}

dayjs.extend(utc)
dayjs.extend(tz)

const ruTz = 'America/New_York'

export function useDate(_date?: Date | undefined) {
  const dataTz = dayjs.tz(ruTz)
  const dateRef = dataTz.locale(ru)
  const days = computed(() => range(dateRef.daysInMonth(), i => i + 1))

  return { dateRef, days }
}
