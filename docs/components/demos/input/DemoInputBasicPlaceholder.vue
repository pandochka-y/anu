<script setup lang="ts">
import { ref, watch } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)
watch(inputRef, newVal => {
  console.log('newVal', newVal)
})
</script>

<template>
  <div class="grid-row sm:grid-cols-2 place-items-stretch new-item">
    {{ inputRef?.id }}
    <div>
      <AInput
        id="123www"
        ref="inputRef"
        data-test="123"
        class="test-test-test"
      />
    </div>
  </div>
</template>
