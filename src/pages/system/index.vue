<template>
  <SubLayout root-path="/system"></SubLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubLayout from '~/pages/layout/SubLayout.vue';

export default defineComponent({
  name: 'PageSystem',
  components: { SubLayout },
  setup() {
    return {};
  },
});
</script>
