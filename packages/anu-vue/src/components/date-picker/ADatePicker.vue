<script lang="ts" setup>
import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import localeData from 'dayjs/plugin/localeData'
import toObject from 'dayjs/plugin/toObject'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

defineOptions({
  name: 'ADatePicker',
  inheritAttrs: false,
})

dayjs.extend(localeData)
dayjs.extend(updateLocale)
dayjs.locale(ru)
dayjs.extend(utc)
dayjs.extend(toObject)

const date = ref(dayjs().locale('ru'))

const currentDate = ref(dayjs())

const calendar = computed(() => {
  const startOfMonth = date.value.startOf('month')
  const lastMonth = date.value.add(-1, 'month')
  const startOfWeek = startOfMonth.subtract((startOfMonth.day() + 6) % 7, 'day')

  const r = startOfWeek.date() === 1
    ? range(startOfWeek.date(), startOfMonth.daysInMonth())
    : range(startOfWeek.date(), lastMonth.daysInMonth()).concat(range(1, startOfMonth.daysInMonth()))

  return {
    date: date.value.toObject(),
    start: (startOfMonth.day() + 6) % 7,
    end: r.length,
    range: r.concat(range(1, 42 - r.length)),
  }
})

function range(start: number, end: number) {
  return Array.from({ length: (end - start + 1) }, (v, k) => k + start)
}

function setMonth(v: number) {
  date.value = date.value.add(v, 'month')
}

function handleClick(index: number, val: number) {
  if (index < calendar.value.start)
    date.value = date.value.subtract(1, 'month')

  else if (index >= calendar.value.end)
    date.value = date.value.add(1, 'month')

  date.value = date.value.date(val)
}

const inputDate = computed(() => date.value.utc().format('DD MMMM YYYY'))

const [showCalendar, toggleShowCalendar] = useToggle(true)

function isSelectDate(item: number, index: number) {
  return (item === calendar.value.date.date)
            && (index >= calendar.value.start) && (index < calendar.value.end)
}

function isCurrentDate(item: number, index: number) {
  if (index < calendar.value.start || index >= calendar.value.end)
    return false

  return currentDate.value.month() === date.value.month() && currentDate.value.date() === item
}

function isActiveDate(index: number) {
  return index >= calendar.value.end || index < calendar.value.start
}

const weekDays = dayjs.weekdaysMin(true)
</script>

<template>
  <div>
    <div @click="toggleShowCalendar()">
      <AInput
        v-model="inputDate"
        :readonly="true"
      />
    </div>
    {{ date }}
    <br>
    {{ calendar }}

    <ACard
      v-if="showCalendar"
      class="px-4 py-4"
      variant="light"
      color="primary"
    >
      <div class="flex flex-row justify-between mb-4 ">
        <ABtn
          icon-only
          icon="i-bx-minus"
          class="text-2"
          variant="text"
          @click="setMonth(-1)"
        />
        <div class="text-white capitalize">
          {{ date.format('MMMM') }} {{ date.format('YYYY') }}
        </div>
        <ABtn
          icon-only
          icon="i-bx-plus"
          class="text-2"
          variant="text"
          @click="setMonth(1)"
        />
      </div>
      <div class="grid grid-cols-7 mb-4 border-b border-amber-900 pb-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-white capitalize flex items-center justify-center"
        >
          <div>
            {{ day }}
          </div>
        </div>
      </div>
      <div
        :key="date.month()"
        class="grid grid-cols-7"
      >
        <div
          v-for="item, index in calendar.range"
          :key="item"
          class="flex items-center justify-center text-white"
          :class="[
            isActiveDate(index) && '!color-gray-500']"
        >
          <div
            class=" rd-50 flex items-center cursor-pointer justify-center h-8 w-8 "
            :class="[
              isSelectDate(item, index) && 'bg-red-500',
              isCurrentDate(item, index) && '!color-blue-500',
            ]"
            @click="() => handleClick(index, item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </ACard>
  </div>
</template>
