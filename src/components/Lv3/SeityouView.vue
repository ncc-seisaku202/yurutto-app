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
export default {
  name: 'SeityouView',
  props: {
    exp: { type: Number, required: true }
  },
  computed: {
    stage() {
      if (this.exp <= 300) return '芽';
      if (this.exp <= 700) return '苗木';
      if (this.exp <= 1200) return '若木';
      return '大樹';
    },
    treeImage() {
      const map = {
        '芽': 'https://lszykhbjdgiugznueyqs.supabase.co/storage/v1/object/public/tree-images/bug.png',
        '苗木': 'https://lszykhbjdgiugznueyqs.supabase.co/storage/v1/object/public/tree-images/sapling.png',
        '若木': 'https://lszykhbjdgiugznueyqs.supabase.co/storage/v1/object/public/tree-images/young_tree.png',
        '大樹': 'https://lszykhbjdgiugznueyqs.supabase.co/storage/v1/object/public/tree-images/big_tree.png',
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
