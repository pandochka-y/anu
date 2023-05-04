<script lang="ts" setup>
import { ref } from 'vue'

const colors = [
  'primary',
  'success',
  'info',
  'warning',
  'danger',
]

const inputRef = ref<Date>(new Date())
</script>

<template>
  <div class="container mx-auto min-h-screen">
    <ACard
      title="Playground"
      class="m-8"
    >
      <div class="a-card-body flex items-center gap-4">
        <!-- <ABtn
          v-for="color in colors"
          :key="color"
          class="focus:ring-4 transition-shadow transition-ease-both ring-offset-0 ring-[hsla(var(--a-layer-c),.35)]"
          :color="color"
        >
          {{ color }}
        </ABtn> -->

        <div>
          {{ inputRef }}
          <div>
            container
            <ADatePicker
              v-model="inputRef"
              class="testest"
            >
              <template #default="{ formattedDate }">
                <AInput
                  :model-value="formattedDate"
                  :readonly="true"
                />
              </template>
            </ADatePicker>
          </div>
        </div>
      </div>
    </ACard>
  </div>
</template>
