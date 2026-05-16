<script setup lang="ts">
import { ref, watch } from 'vue'

const model = defineModel<string>({
  default: '00:00',
})

const [initH, initM] = model.value.split(':')

const hour = ref(initH ?? '00')
const minute = ref(initM ?? '00')

watch(model, (val) => {
  const [h, m] = val.split(':')
  hour.value = h ?? '00'
  minute.value = m ?? '00'
})

watch([hour, minute], () => {
  model.value = `${hour.value.padStart(2, '0')}:${minute.value.padStart(2, '0')}`
})
</script>

<template>
  <div>
    <select v-model="hour">
      <option v-for="h in 24" :key="h - 1" :value="String(h - 1).padStart(2, '0')">
        {{ String(h - 1).padStart(2, '0') }}
      </option>
    </select>

    :

    <select v-model="minute">
      <option v-for="m in 60" :key="m - 1" :value="String(m - 1).padStart(2, '0')">
        {{ String(m - 1).padStart(2, '0') }}
      </option>
    </select>
  </div>
</template>
