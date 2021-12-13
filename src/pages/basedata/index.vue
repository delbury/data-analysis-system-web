<template>
  <SubLayout root-path="/basedata"></SubLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubLayout from '~/pages/layout/SubLayout.vue';


export default defineComponent({
  name: 'PageBasedata',
  components: { SubLayout },
  setup() {
    return {};
  },
});
</script>
