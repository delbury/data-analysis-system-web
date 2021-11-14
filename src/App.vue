<template>
  <locale-provider>
    <router-view></router-view>
  </locale-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Provider from '/@/plugins/Provider';

export default defineComponent({
  name: 'App',
  components: {
    [Provider.name]: Provider,
  },
});
</script>
