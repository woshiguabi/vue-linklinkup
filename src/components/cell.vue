<template>
  <td :class="classNames">
    <div v-if="isLine" :class="lineClass"></div>
    {{className}}
  </td>
</template>
<script>
  export default {
    name: 'cell',
    props: ['isSelected', 'isBlank', 'className', 'lineClass', 'isLine'],
    computed: {
      classNames () {
        return {
          'selected': this.isSelected, // 选中
          'blank': this.isBlank // 空白
        }
      }
    }
  }
</script>
