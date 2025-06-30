<template>
  <div class="tree-container">
    <img :src="treeImage" :alt="stage" class="tree-img" />
    <p class="text-center mt-2 text-sm text-gray-600">
      経験値: {{ exp }} / 現在: {{ stage }} <br>
      毎日のご褒美達成で育てよう🌳
    </p>
  </div>
</template>

<script>
import bud from '@/assets/bug.png';
import sapling from '@/assets/sapling.png';
import young from '@/assets/young_tree.png';
import big from '@/assets/big_tree.png';


export default {
  name: 'Seityou',
  props: {
    exp: { type: Number, required: true }
  },
  computed: {
    stage() {
      if (this.exp <= 10) return '芽';
      if (this.exp <= 30) return '苗木';
      if (this.exp <= 70) return '若木';
      return '大樹';
    },
    treeImage() {
      const map = {
        '芽': bud,
        '苗木': sapling,
        '若木': young,
        '大樹': big,
      };
      return map[this.stage];
    },
  }
};

</script>


<style scoped>
.tree-container { @apply flex flex-col items-center; }
.tree-img       { width: 200px; height: auto; }
</style>
