<template>
  <div class="tree-container">
    <img v-if="stage === '芽'" :src="budImg" alt="芽" class="tree-img" />
    <img v-else-if="stage === '苗木'" :src="saplingImg" alt="苗木" class="tree-img" />
    <img v-else-if="stage === '若木'" :src="youngTreeImg" alt="若木" class="tree-img" />
    <img v-else :src="bigTreeImg" alt="大樹" class="tree-img" />

    <p class="text-center mt-2">
      🧪 経験値: {{ exp }}<br />
      🌿 今の状態: {{ stage }}
    </p>
  </div>
</template>

<script>
import budImg from '@/assets/bug.png';
import saplingImg from '@/assets/sapling.png';
import youngTreeImg from '@/assets/young_tree.png';
import bigTreeImg from '@/assets/big_tree.png';

export default {
  name: 'TreeGrowth',
  props: {
    exp: {
      type: Number,
      required: true,
    },
  },
  computed: {
    stage() {
      if (this.exp <= 10) return '芽';
      if (this.exp <= 30) return '苗木';
      if (this.exp <= 70) return '若木';
      return '大樹';
    },
  },
  data() {
    return {
      budImg,
      saplingImg,
      youngTreeImg,
      bigTreeImg,
    };
  },
};
</script>

<style scoped>
.tree-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tree-img {
  width: 200px;
  height: auto;
}
</style>

