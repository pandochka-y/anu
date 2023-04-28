<script lang="ts" setup>
import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'

defineOptions({
  name: 'ADatePicker',
  inheritAttrs: false,
})

dayjs.locale(ru)
dayjs.extend(utc)
dayjs.extend(isoWeek)

const dateRef = ref(dayjs().utc())

const monthRange = computed(() => {
  const startOfMonth = dateRef.value.startOf('month')
  const startOfWeek = startOfMonth.subtract(startOfMonth.day(), 'day')

  console.log(startOfMonth.isoWeek(1), startOfMonth.day())

  const r = startOfMonth.day()
    ? range(startOfWeek.date(), startOfWeek.daysInMonth())
      .concat(range(1, startOfMonth.daysInMonth()))
    : range(1, startOfMonth.daysInMonth())

  return {
    start: startOfMonth.day(),
    end: r.length,
    range: r.concat(range(1, 42 - r.length)),
  }
})

function range(start: number, end: number) {
  return Array.from({ length: (end - start + 1) }, (v, k) => k + start)
}

function setMonth(v: number) {
  dateRef.value = dateRef.value.add(v, 'month')
}
</script>

<template>
  <div>
    <ABtn @click="setMonth(-1)" />
    <ABtn @click="setMonth(1)" />
    {{ dateRef.day() }}
    {{ monthRange }}
    <div
      :key="dateRef.month()"
      class="grid grid-cols-7"
    >
      <div
        v-for="item in monthRange.range"
        :key="item"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
